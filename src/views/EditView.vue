<template>
  <div class="education-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="教育信息" left-arrow @click-left="goBack" />

    <!-- 列表展示（支持拖拽） -->
    <div v-if="list.length === 0" class="empty-tip">
      暂无数据，点击底部“+”添加学历或学籍信息
    </div>

    <div v-else class="draggable-list">
      <van-cell-group v-for="(item, index) in list" :key="item.id" inset class="draggable-item" :data-index="index"
        @touchstart="handleDragStart($event, index)" @touchmove="handleDragMove" @touchend="handleDragEnd"
        @mousedown="handleDragStart($event, index)" draggable="false">
        <van-cell :title="item.schoolName" :label="`${item.educationLevel} | ${item.major}`" :class="[
          'education-item',
          { 'type-xl': item.type === 'xl', 'type-xj': item.type === 'xj' }
        ]" clickable @click="editItem(index)">
          <template #right-icon>
            <span style="color: #969799; font-size: 12px; margin-right: 8px">
              {{ item.studyForm }}
            </span>
            <van-icon name="delete" color="#ee0a24" @click.stop="deleteItem(index)" />
          </template>
        </van-cell>
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

    <!-- 底部两个加号按钮 -->
    <div class="add-buttons">
      <van-button round type="primary" icon="plus" size="large" @click="openForm('xl')" class="add-btn xl-btn">
        学历
      </van-button>
      <van-button round type="success" icon="plus" size="large" @click="openForm('xj')" class="add-btn xj-btn">
        学籍
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { showToast } from 'vant';

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

// ===== 拖拽状态 =====
let dragStartIndex = null;
let isDragging = false;

// ===== 拖拽事件 =====
const handleDragStart = (e, index) => {
  dragStartIndex = index;
  isDragging = true;
  // 移动端防止滚动
  if (e.type === 'touchstart') {
    e.preventDefault();
  }
};

const handleDragMove = (e) => {
  if (!isDragging || dragStartIndex === null) return;
  e.preventDefault(); // 阻止默认滚动
};

const handleDragEnd = (e) => {
  if (!isDragging || dragStartIndex === null) return;
  isDragging = false;

  // 获取当前手指/鼠标位置
  const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
  const elements = document.querySelectorAll('.draggable-item');
  let dragEndIndex = dragStartIndex;

  // 计算目标位置
  for (let i = 0; i < elements.length; i++) {
    const rect = elements[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      dragEndIndex = i;
      break;
    }
  }

  // 如果位置变化，交换
  if (dragStartIndex !== dragEndIndex) {
    const newList = [...list.value];
    const movedItem = newList.splice(dragStartIndex, 1)[0];
    newList.splice(dragEndIndex, 0, movedItem);
    list.value = newList;
    saveToStorage(); // 保存到 localStorage
    showToast('排序已更新');
  }
};

// ===== localStorage =====
const loadFromStorage = () => {
  try {
    const xlList = JSON.parse(localStorage.getItem('xlList') || '[]');
    const xjList = JSON.parse(localStorage.getItem('xjList') || '[]');
    list.value = [...xlList, ...xjList];
  } catch (e) {
    console.error('读取失败', e);
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

// ===== 表单逻辑（保持不变）=====
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
    schoolName: item.schoolName || '',
    educationLevel: item.educationLevel || '',
    major: item.major || '',
    studyForm: item.studyForm || ''
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
  cursor: grab;
  user-select: none;
}

.draggable-item:active {
  cursor: grabbing;
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
</style>