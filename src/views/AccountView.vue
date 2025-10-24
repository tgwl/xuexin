<template>
  <div class="page-wrapper">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="学生信息" left-text="返回" left-arrow @click-left="onBack" />

    <!-- 表单区域 -->
    <div class="form-container">
      <!-- 照片上传区（3:4） -->
      <div class="avatar-wrapper" @click="triggerUpload">
        <div class="avatar-container">
          <img :src="formData.avatar || defaultAvatar" class="avatar-cover" alt="学生照片" />
          <div class="upload-overlay" v-if="!isEditing">点击上传</div>
        </div>
      </div>

      <van-form @submit="onSubmit">
        <van-field v-model="formData.avatarCaption" label="照片标注" placeholder="底部水印，如“学生照片” " :readonly="!isEditing" />
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
    <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

// refs
const isEditing = ref(true);
const fileInput = ref(null);

// 默认头像（3:4 SVG 占位图）
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
  avatar: '',
  rawAvatar: '',
  avatarCaption: '学生照片',
};

const formData = ref({ ...initialData });

// 初始化：从 localStorage 加载
onMounted(() => {
  const saved = localStorage.getItem('studentInfo');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      formData.value = { ...initialData, ...parsed };
    } catch (e) {
      console.warn('Failed to parse saved student info');
    }
  }
});

// 路由返回
const router = useRouter();
const onBack = () => {
  if (router) {
    router.back();
  } else {
    window.history.back();
  }
};

// 图片压缩函数
const compressImage = (file, maxWidth = 800, maxHeight = 1067, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas toBlob failed'));
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

// 触发文件选择
const triggerUpload = () => {
  if (isEditing.value) {
    fileInput.value?.click();
  }
};

// 处理文件上传并压缩
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  try {
    const compressedDataUrl = await compressImage(file, 800, 1067, 0.8);
    formData.value.rawAvatar = compressedDataUrl;
    // showToast('图片已压缩并加载');
  } catch (err) {
    console.error('图片压缩失败:', err);
    showToast('图片处理失败');
  }

  e.target.value = '';
};

// 重新生成带白条的头像（3:4 内嵌白条）
const regenerateAvatar = () => {
  const { rawAvatar, avatarCaption } = formData.value;
  if (!rawAvatar) {
    formData.value.avatar = defaultAvatar;
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onerror = () => {
    formData.value.avatar = defaultAvatar;
    showToast('图片加载失败');
  };
  img.onload = () => {
    const WIDTH = 300;
    const HEIGHT = 400; // 3:4

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // cover 原图
    const scaleX = WIDTH / img.width;
    const scaleY = HEIGHT / img.height;
    const scale = Math.max(scaleX, scaleY);
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const dx = (WIDTH - scaledW) / 2;
    const dy = (HEIGHT - scaledH) / 2;
    ctx.drawImage(img, dx, dy, scaledW, scaledH);

    // 底部半透明白条 —— 👇 修改这里
    const CAPTION_HEIGHT = 32; // ←←← 改为 32px（或你想要的值）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(0, HEIGHT - CAPTION_HEIGHT, WIDTH, CAPTION_HEIGHT);

    // 文字（自动垂直居中）
    ctx.fillStyle = '#000000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      avatarCaption || '学生照片',
      WIDTH / 2,
      HEIGHT - CAPTION_HEIGHT / 2 // ✅ 自动适配
    );

    formData.value.avatar = canvas.toDataURL('image/jpeg', 0.85);
  };
  img.src = rawAvatar;
};

// 监听 rawAvatar 或 avatarCaption 变化，自动合成
watch(
  () => [formData.value.rawAvatar, formData.value.avatarCaption],
  () => {
    regenerateAvatar();
  },
  { immediate: true }
);

// 表单提交：保存或切换编辑状态
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
.avatar-container {
  position: relative;
  width: 100%;
  max-width: 160px;
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
  height: auto;
  /* 👈 改为 auto，让图片按自身比例显示 */
  object-fit: contain;
  /* 或 cover，看需求 */
  display: block;
}

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
  padding-top: 133.33%;
  /* 3:4 = 4/3 ≈ 1.3333 */
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