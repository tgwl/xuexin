<template>
  <div class="education-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="教育信息" left-arrow @click-left="goBack" />

    <!-- 列表展示 -->
    <div v-if="list.length === 0" class="empty-tip">
      暂无数据，点击底部“+”添加学历或学籍信息
    </div>

    <div v-else class="draggable-list">
      <van-cell-group v-for="(item, index) in list" :key="item.id" inset class="draggable-item">
        <!-- 左滑容器 -->
        <van-swipe-cell :left-width="0" :right-width="120">
          <!-- 主内容区域（支持拖拽） -->
          <van-cell :title="item.schoolName" :label="`${item.educationLevel} | ${item.major}`" :class="[
            'education-item',
            { 'type-xl': item.type === 'xl', 'type-xj': item.type === 'xj' }
          ]" @touchstart="handleLongPressStart($event, index)" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
            @touchcancel="handleTouchCancel">
            <template #right-icon>
              <span style="color: #969799; font-size: 12px; margin-right: 8px">
                {{ item.studyForm }}
              </span>
            </template>
          </van-cell>

          <!-- 右侧滑出按钮 -->
          <template #right>
            <div style="display: flex; height: 100%">
              <van-button square type="primary" text style="width: 60px; border-radius: 0" @click="quickEdit(index)">
                修改
              </van-button>
              <van-button square type="danger" text style="width: 60px; border-radius: 0" @click="quickDelete(index)">
                删除
              </van-button>
            </div>
          </template>
        </van-swipe-cell>
      </van-cell-group>
    </div>

    <!-- 表单弹窗 -->
    <van-popup v-model:show="showForm" position="bottom" :style="{ height: '60%' }">
      <van-form @submit="onFormSubmit">
        <van-field v-model="currentForm.schoolName" name="schoolName" label="学校名称" placeholder="请输入学校名称"
          :rules="[{ required: true, message: '请输入学校名称' }]" />
        <van-field v-model="currentForm.educationLevel" name="educationLevel" label="学历层次" placeholder="例如：本科、专科、硕士"
          :rules="[{ required: true, message: '请输入学历层次' }]" />
        <van-field v-model="currentForm.major" name="major" label="专业" placeholder="请输入专业"
          :rules="[{ required: true, message: '请输入专业' }]" />
        <van-field v-model="currentForm.studyForm" name="studyForm" label="学习形式" placeholder="例如：普通全日制、成人教育"
          :rules="[{ required: true, message: '请输入学习形式' }]" />

        <div style="margin: 16px; display: flex; gap: 10px;">
          <van-button v-if="editingIndex !== null" type="danger" plain @click="deleteItem(editingIndex)" style="flex: 1">
            删除
          </van-button>
          <van-button block type="primary" native-type="submit" :style="{ flex: editingIndex !== null ? 1 : 'none' }">
            {{ editingIndex !== null ? '保存' : '确定' }}
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 底部加号按钮 -->
    <div class="add-buttons">
      <van-button round type="primary" icon="plus" size="large" @click="openForm('xl')" class="add-btn xl-btn">
        学历
      </van-button>
      <van-button round type="success" icon="plus" size="large" @click="openForm('xj')" class="add-btn xj-btn">
        学籍
      </van-button>

      <van-button round type="default" icon="question" size="small" class="help-fab" @click="showHelpDialog" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { showToast, showDialog } from 'vant';

// ===== 返回 =====
const goBack = () => {
  history.back();
};

// ===== 数据 =====
const list = ref([]);

// 表单相关
const showForm = ref(false);
const editingIndex = ref(null);
const currentFormType = ref('xl');
const currentForm = reactive({
  schoolName: '',
  educationLevel: '',
  major: '',
  studyForm: ''
});

// ===== 拖拽与长按状态 =====
let isDragging = false;
let dragStartIndex = null;
let longPressTimer = null;
const LONG_PRESS_DELAY = 3000; // 3秒长按
let startX = 0;
let startY = 0;
const MOVE_THRESHOLD = 10; // 垂直移动超过10px才视为拖拽

// ===== 左滑快捷操作 =====
const quickEdit = (index) => {
  editItem(index);
};

const quickDelete = (index) => {
  deleteItem(index);
};

// 显示操作指南
const showHelpDialog = () => {
  showDialog({
    title: '操作指南',
    message: `
      <div style="text-align: left; line-height: 1.6">
        <p>🔹 <strong>左滑</strong>列表项：显示「修改」「删除」按钮</p>
        <p>🔹 <strong>长按 3 秒后上下拖动</strong>：调整排序</p>
        <p>🔹 点击底部「学历」或「学籍」按钮：添加新信息</p>
      </div>
    `,
    confirmButtonText: '我知道了',
    closeOnPopstate: true,
    allowHtml: true
  });
};

// ===== 事件处理器 =====

const handleLongPressStart = (e, index) => {
  // ⚠️ 必须第一行 preventDefault，确保 iOS 正常工作
  e.preventDefault();

  if (isDragging) return;

  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  dragStartIndex = index;

  longPressTimer = setTimeout(() => {
    if (!isDragging) {
      editItem(index);
    }
    longPressTimer = null;
  }, LONG_PRESS_DELAY);
};

const handleTouchMove = (e) => {
  if (!longPressTimer && !isDragging) return;

  const touch = e.touches[0];
  const dx = Math.abs(touch.clientX - startX);
  const dy = Math.abs(touch.clientY - startY);

  // 如果已在拖拽中，继续阻止默认行为
  if (isDragging) {
    e.preventDefault();
    return;
  }

  // 仅当垂直移动为主（dy > dx）且超过阈值时，才启动拖拽排序
  if (dy > dx && dy > MOVE_THRESHOLD) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    isDragging = true;
    e.preventDefault(); // 阻止页面滚动
  }
  // 水平滑动（dx >= dy）：不处理，交给 van-swipe-cell
};

const handleTouchEnd = (e) => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  if (isDragging) {
    const clientY = e.changedTouches[0].clientY;
    const items = document.querySelectorAll('.draggable-item');
    let dragEndIndex = dragStartIndex;

    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        dragEndIndex = i;
        break;
      }
    }

    if (dragStartIndex !== dragEndIndex) {
      const newList = [...list.value];
      const movedItem = newList.splice(dragStartIndex, 1)[0];
      newList.splice(dragEndIndex, 0, movedItem);
      list.value = newList;
      saveToStorage();
      showToast('排序已更新');
    }
    isDragging = false;
  }
};

const handleTouchCancel = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  isDragging = false;
};

// ===== 本地存储 =====
const loadFromStorage = () => {
  try {
    const xlList = JSON.parse(localStorage.getItem('xlList') || '[]');
    const xjList = JSON.parse(localStorage.getItem('xjList') || '[]');
    list.value = [...xlList, ...xjList];
  } catch (e) {
    console.error('读取本地数据失败', e);
    list.value = [];
  }
};

const saveToStorage = () => {
  const xlList = list.value.filter(item => item.type === 'xl');
  const xjList = list.value.filter(item => item.type === 'xj');
  try {
    localStorage.setItem('xlList', JSON.stringify(xlList));
    localStorage.setItem('xjList', JSON.stringify(xjList));
  } catch (e) {
    console.error('保存失败', e);
  }
};

// ===== 表单逻辑 =====
const openForm = (type) => {
  editingIndex.value = null;
  currentFormType.value = type;
  Object.assign(currentForm, {
    schoolName: '',
    educationLevel: '',
    major: '',
    studyForm: ''
  });
  showForm.value = true;
};

const editItem = (index) => {
  editingIndex.value = index;
  const item = list.value[index];
  currentFormType.value = item.type;
  Object.assign(currentForm, {
    schoolName: item.schoolName,
    educationLevel: item.educationLevel,
    major: item.major,
    studyForm: item.studyForm
  });
  showForm.value = true;
};

const onFormSubmit = () => {
  const { schoolName, educationLevel, major, studyForm } = currentForm;
  if (!schoolName || !educationLevel || !major || !studyForm) {
    showToast('请填写完整');
    return;
  }

  if (editingIndex.value !== null) {
    list.value[editingIndex.value] = {
      ...list.value[editingIndex.value],
      schoolName,
      educationLevel,
      major,
      studyForm
    };
    showToast('更新成功');
  } else {
    list.value.push({
      id: Date.now().toString(),
      type: currentFormType.value,
      schoolName,
      educationLevel,
      major,
      studyForm
    });
    showToast('添加成功');
  }
  saveToStorage();
  showForm.value = false;
};

const deleteItem = (index) => {
  list.value.splice(index, 1);
  showToast('已删除');
  saveToStorage();
  showForm.value = false;
};

// ===== 初始化 =====
onMounted(() => {
  loadFromStorage();
});
</script>

<style scoped>
.education-page {
  padding-bottom: 80px;
}

.empty-tip {
  text-align: center;
  color: #969799;
  padding: 40px 20px 0;
}

.draggable-list {
  padding: 0 12px;
}

.draggable-item {
  margin-bottom: 8px;
}

.education-item.type-xl {
  border-left: 4px solid #1989fa;
}

.education-item.type-xj {
  border-left: 4px solid #07c160;
}

.add-buttons {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  width: calc(100% - 40px);
  max-width: 400px;
}

.add-btn {
  flex: 1;
  font-weight: 500;
}

.xl-btn {
  background-color: #1989fa;
  border-color: #1989fa;
}

.xj-btn {
  background-color: #07c160;
  border-color: #07c160;
}

.help-fab {
  position: fixed;
  right: 20px;
  bottom: 90px;
  /* 高于底部加号按钮 */
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
}
</style>