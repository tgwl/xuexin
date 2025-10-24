<template>
  <div class="page-wrapper">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="学生信息"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />

    <!-- 表单区域 -->
    <div class="form-container">
      <!-- 照片上传区（3:4） -->
      <div class="avatar-wrapper" @click="triggerUpload">
        <div class="avatar-container">
          <img 
            :src="formData.avatar || defaultAvatar" 
            class="avatar-cover"
            alt="学生照片"
          />
          <div class="upload-overlay" v-if="!isEditing">点击上传</div>
        </div>
      </div>

      <van-form @submit="onSubmit">
        <van-field v-model="formData.xm" label="姓名" :readonly="!isEditing" />
        <van-field v-model="formData.xb" label="性别" :readonly="!isEditing" />
        <van-field v-model="formData.mz" label="民族" :readonly="!isEditing" />
        <van-field v-model="formData.sfzh" label="身份证号" :readonly="!isEditing" />
        <van-field v-model="formData.xh" label="学号" :readonly="!isEditing" />
        <van-field v-model="formData.csrq" label="出生日期" :readonly="!isEditing" />
        <van-field v-model="formData.rxrq" label="入学日期" :readonly="!isEditing" />
        <van-field v-model="formData.byrq" label="预计毕业日期" :readonly="!isEditing" />
        <van-field v-model="formData.xz" label="学制" :readonly="!isEditing" />
        <van-field v-model="formData.bh" label="班级" :readonly="!isEditing" />
        <van-field v-model="formData.fy" label="院系" :readonly="!isEditing" />
        <van-field v-model="formData.xllb" label="学习形式" :readonly="!isEditing" />
        <van-field v-model="formData.xjzt" label="学籍状态" :readonly="!isEditing" />

        <div style="margin: 16px;">
          <van-button block type="primary" native-type="submit">
            {{ isEditing ? '保存' : '编辑' }}
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 隐藏文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

// refs
const isEditing = ref(true);
const fileInput = ref(null);

// 默认头像（SVG 占位图，3:4）
const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23e0e0e0"/><text x="150" y="220" font-size="16" text-anchor="middle" fill="%23999">点击上传照片</text></svg>';

const initialData = {
  csrq: "1999年05月15日",
  hasXlPic: false,
  xz: "4年",
  bh: "2019级1班",
  xsh: "计算机系",
  xllb: "普通高等教育",
  fy: "信息科学技术学院",
  xjzt: "注册在籍（正常）",
  id: "jsoapi4blfnpksww",
  hasLqPic: true,
  xlzms: false,
  mzItemName: "民族",
  xb: "男",
  mz: "汉族",
  rxrq: "2019年09月01日",
  xh: "2019123456",
  sfzh: "11010119990515XXXX",
  xm: "张三",
  byrq: "2023年06月30日",
  byrqItemName: "预计毕业日期",
  avatar: '' // 👈 新增字段
};

const formData = ref({ ...initialData });

onMounted(() => {
  const saved = localStorage.getItem('studentInfo');
  if (saved) {
    try {
      formData.value = { ...initialData, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse saved student info');
    }
  }
});

const router = useRouter();
const onBack = () => {
  if (router) {
    router.back();
  } else {
    window.history.back();
  }
};

// 上传相关
const triggerUpload = () => {
  if (isEditing.value) {
    fileInput.value?.click();
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    formData.value.avatar = event.target.result; // base64
    showToast('图片已加载');
  };
  reader.readAsDataURL(file);
  e.target.value = ''; // 允许重复选择同一张图
};

// 保存
const onSubmit = () => {
  if (isEditing.value) {
    localStorage.setItem('studentInfo', JSON.stringify(formData.value));
    isEditing.value = false;
    showToast({ message: '保存成功', duration: 1500 });
  } else {
    isEditing.value = true;
  }
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.form-container {
  flex: 1;
  padding: 16px;
}

/* 3:4 照片容器 */
.avatar-wrapper {
  width: 100%;
  max-width: 160px;
  margin: 0 auto 20px;
}

.avatar-container {
  position: relative;
  width: 100%;
  padding-top: 133.33%; /* 3:4 = 4/3 ≈ 1.3333 */
  border-radius: 8px;
  overflow: hidden;
  background-color: #e0e0e0;
  cursor: pointer;
}

.avatar-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-container:hover .upload-overlay,
.avatar-container:focus .upload-overlay {
  opacity: 1;
}
</style>