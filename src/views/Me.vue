<template>
  <div class="my-page">
    <!-- 模拟状态栏 -->

    <!-- 顶部标题栏（缩短高度 + 标题上移） -->
    <div class="header">
      <h1 class="title">我的</h1>
    </div>

    <!-- 用户信息区（左对齐） -->
    <div class="user-info" @click="editaccount()">
    <van-image
  round
  width="60px"
  height="60px"
  :src="avatar"
  fit="cover"
/>
      <div class="user-detail">
        <div class="user-name">{{ name }}</div>
        <div class="user-phone">138****5678</div>
      </div>
    </div>

    <!-- 功能列表 -->
    <van-cell-group inset>
      <van-cell v-for="item in menuList" :key="item.id" :title="item.title" is-link @click="handleClick(item)">
        <template #icon>
          <Icon :icon="item.icon" class="menu-icon" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 退出登录按钮（白底红字） -->
    <div class="logout-button">
      <van-button block type="default" size="large" @click="editview" class="custom-logout-btn">
        退出登录
      </van-button>
    </div>
    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();

// 默认头像
const defaultAvatar = 'https://img01.yzcdn.cn/vant/cat.jpeg';

// 响应式头像 URL
const avatar = ref(defaultAvatar);
const name =ref();

// 从 localStorage 读取 studentInfo
const loadAvatar = () => {
  const raw = localStorage.getItem('studentInfo');
  if (raw) {
    try {
      const obj = JSON.parse(raw); // ✅ 先解析成对象

      console.log(obj);
      avatar.value = obj.avatar || defaultAvatar;
      name.value = obj.xm || "王五五";
    } catch (e) {
      console.error('JSON 解析失败:', e);
    }
  } else {
    console.log('localStorage 中没有 studentInfo');
  }
};


onMounted(() => {
  loadAvatar();
});

// 菜单配置保持不变
const menuList = [
  { id: 'about', title: '关于', icon: 'mdi:information-outline', route: '/about' },
  { id: 'help', title: '帮助中心', icon: 'mdi:help-circle-outline', url: 'https://kl.chsi.com.cn/wap/help/index.action?state=chsiapp&f=wap' },
  { id: 'logout-account', title: '注销账号', icon: 'mdi:account-remove-outline', route: '/logout' }
];

const handleClick = (item) => {
  if (item.route) {
    router.push(item.route).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('路由跳转错误:', err);
      }
    });
  } else if (item.url) {
    window.location.href = item.url;
  }
};

const editview = () => {
  router.push('/edit');
};

const editaccount = () => {
  router.push('/account');
};
</script>



<style scoped>
.my-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: env(safe-area-inset-top);
}

.status-bar {
  height: 20px;
  background-color: #fff;
}

/* 标题栏：进一步缩短高度 + “我的”文字紧贴顶部 */
.header {
  background-color: #fff;
  padding: 2px 16px 8px;
  /* 上边距改为 2px，更贴近状态栏 */
  border-bottom: 1px solid #ebedf0;
  height: 34px;
  /* 可选：固定高度 */
  display: flex;
  align-items: flex-start;
  /* 让内容贴顶 */
}

.title {
  font-size: 18px;
  font-weight: 500;
  margin-top: 15px;
  color: #323233;
  flex: 1;
  text-align: center;
  line-height: 1;
  /* 关键：让文字不被行高撑开 */
  padding-top: 0;
  /* 确保无额外顶部内边距 */
}

/* 用户信息区：左对齐 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 16px;
  background-color: #fff;
  margin: 12px 12px 0;
  border-radius: 8px;
}

.user-detail {
  margin-left: 12px;
  text-align: left;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 14px;
  color: #969799;
}

.menu-icon {
  font-size: 20px;
  color: #646566;
  margin-right: 8px;
}

:deep(.van-cell-group--inset) {
  margin: 12px;
}

.logout-button {
  padding: 0;
  /* 撑满一行 */
  margin-top: 20px;
}

.custom-logout-btn {
  background-color: #fff;
  color: #000;
  border: 1px solid #ebedf0;
  font-weight: 500;
  box-shadow: none;
}

.custom-logout-btn:active {
  background-color: #f5f5f5;
}
</style>