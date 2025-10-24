<template>
  <div class="education-page">

    <van-nav-bar
      title="教育信息"
      left-arrow
      @click-left="goBack"
    />


    <!-- 列表展示 -->
    <div v-if="list.length === 0" class="empty-tip">
      暂无数据，点击底部“+”添加学历或学籍信息
    </div>

    <van-cell-group v-else inset>
      <van-cell
        v-for="(item, index) in list"
        :key="item.id"
        :title="item.schoolName"
        :label="`${item.educationLevel} | ${item.major}`"
        :class="[
          'education-item',
          { 'type-xl': item.type === 'xl', 'type-xj': item.type === 'xj' }
        ]"
        clickable
        @click="editItem(index)"
      >
        <template #right-icon>
          <span style="color: #969799; font-size: 12px; margin-right: 8px">
            {{ item.studyForm }}
          </span>
          <van-icon name="delete" color="#ee0a24" @click.stop="deleteItem(index)" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 表单弹窗 -->
    <van-popup v-model:show="showForm" position="bottom" :style="{ height: '60%' }">
      <van-form @submit="onFormSubmit">
        <van-field
          v-model="currentForm.schoolName"
          name="schoolName"
          label="学校名称"
          placeholder="请输入学校名称"
          :rules="[{ required: true, message: '请输入学校名称' }]"
        />
        <van-field
          v-model="currentForm.educationLevel"
          name="educationLevel"
          label="学历层次"
          placeholder="例如：本科、专科、硕士"
          :rules="[{ required: true, message: '请输入学历层次' }]"
        />
        <van-field
          v-model="currentForm.major"
          name="major"
          label="专业"
          placeholder="请输入专业"
          :rules="[{ required: true, message: '请输入专业' }]"
        />
        <van-field
          v-model="currentForm.studyForm"
          name="studyForm"
          label="学习形式"
          placeholder="例如：普通全日制、成人教育"
          :rules="[{ required: true, message: '请输入学习形式' }]"
        />

        <div style="margin: 16px; display: flex; gap: 10px;">
          <van-button
            v-if="editingIndex !== null"
            type="danger"
            plain
            @click="deleteItem(editingIndex)"
            style="flex: 1"
          >
            删除
          </van-button>
          <van-button
            block
            type="primary"
            native-type="submit"
            :style="{ flex: editingIndex !== null ? 1 : 'none' }"
          >
            {{ editingIndex !== null ? '保存' : '确定' }}
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 底部两个加号按钮 -->
    <div class="add-buttons">
      <van-button
        round
        type="primary"
        icon="plus"
        size="large"
        @click="openForm('xl')"
        class="add-btn xl-btn"
      >
        学历
      </van-button>
      <van-button
        round
        type="success"
        icon="plus"
        size="large"
        @click="openForm('xj')"
        class="add-btn xj-btn"
      >
        学籍
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { showToast } from 'vant';

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

// 从 localStorage 读取数据
const loadFromStorage = () => {
  try {
    const xlList = JSON.parse(localStorage.getItem('xlList') || '[]');
    const xjList = JSON.parse(localStorage.getItem('xjList') || '[]');
    // 合并：学历在前，学籍在后
    list.value = [...xlList, ...xjList];
  } catch (e) {
    console.error('读取 localStorage 失败', e);
    list.value = [];
  }
};

// 保存到 localStorage
const saveToStorage = () => {
  const xlList = list.value.filter(item => item.type === 'xl');
  const xjList = list.value.filter(item => item.type === 'xj');
  try {
    localStorage.setItem('xlList', JSON.stringify(xlList));
    localStorage.setItem('xjList', JSON.stringify(xjList));
  } catch (e) {
    console.error('保存到 localStorage 失败', e);
    showToast('保存失败，请检查存储空间');
  }
};

// 打开表单（新增）
const openForm = (type) => {
  editingIndex.value = null;
  currentFormType.value = type;
  currentForm.schoolName = '';
  currentForm.educationLevel = '';
  currentForm.major = '';
  currentForm.studyForm = '';
  showForm.value = true;
};

// 编辑项
const editItem = (index) => {
  editingIndex.value = index;
  const item = list.value[index];
  currentFormType.value = item.type;
  currentForm.schoolName = item.schoolName || '';
  currentForm.educationLevel = item.educationLevel || '';
  currentForm.major = item.major || '';
  currentForm.studyForm = item.studyForm || '';
  showForm.value = true;
};

// 提交表单
const onFormSubmit = () => {
  const { schoolName, educationLevel, major, studyForm } = currentForm;
  if (!schoolName || !educationLevel || !major || !studyForm) {
    showToast('请填写完整信息');
    return;
  }

  if (editingIndex.value !== null) {
    // 更新
    list.value[editingIndex.value] = {
      ...list.value[editingIndex.value],
      schoolName,
      educationLevel,
      major,
      studyForm
    };
    showToast('更新成功');
  } else {
    // 新增
    const newItem = {
      id: Date.now().toString(),
      type: currentFormType.value,
      schoolName,
      educationLevel,
      major,
      studyForm
    };
    list.value.push(newItem);
    showToast('添加成功');
  }

  saveToStorage(); // 保存到 localStorage
  showForm.value = false;
};

// 删除项
const deleteItem = (index) => {
  list.value.splice(index, 1);
  showToast('已删除');
  saveToStorage(); // 保存到 localStorage
  showForm.value = false;
};

// 页面加载时读取数据
onMounted(() => {
  loadFromStorage();
});

//返回页面
const goBack = () => {
  // 如果你使用 Vue Router
  // router.go(-1); 
// 
  // 如果你没有用 Vue Router（纯静态页面）
  history.back();
};
</script>

<style scoped>
.education-page {
  padding-bottom: 80px;
}

.empty-tip {
  text-align: center;
  color: #969799;
  padding: 40px 20px;
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