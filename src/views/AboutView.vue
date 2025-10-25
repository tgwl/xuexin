<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="关于" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <!-- 关于信息 -->
      <van-cell-group class="about-section">
        <van-cell center>
          <template #icon>
            <div class="app-icon">🎓</div>
          </template>
          <template #title>
            <div class="app-name">学生信息助手</div>
            <div class="app-version">v1.3.0</div>
          </template>
        </van-cell>

        <van-cell title="简介" label="一个轻量级的学生信息管理工具，支持表单填写、本地保存与编辑。" readonly />
        <van-cell title="联系开发者" value="煜" is-link @click="showConfirmDialog" />
        <van-cell title="部署平台" value="Netlify + Vercel" readonly />
        <van-cell title="技术栈" value="Vue 3 + Vant 4 " readonly />
        <!-- 👇 新增反馈入口 -->
        <van-cell title="问题反馈" label="点击填写在线反馈表单" is-link @click="openFeedbackForm" />
      </van-cell-group>

      <van-dialog v-model:show="showDialog" title="联系开发者" show-cancel-button confirm-button-text="确定"
        cancel-button-text="取消" @confirm="showQRCode" @cancel="showDialog = false">
        <p class="dialog-content">是否联系开发者？</p>
      </van-dialog>

      <!-- 二维码弹层 -->
      <van-overlay :show="showQR" @click="showQR = false">
        <div class="qr-container" @click.stop>
          <van-image :src="wechatQRCode" width="240" height="240" fit="contain" radius="12" />
          <div class="qr-tip">长按保存二维码，微信扫码联系</div>
        </div>
      </van-overlay>

      <van-divider :style="{ margin: '16px 0' }" />

      <!-- 更新日志 -->
      <van-cell-group class="changelog-section">
        <van-cell title="更新日志" readonly />

        <div class="changelog-entries">
          <div v-for="entry in changelog" :key="entry.version" class="changelog-entry">
            <div class="version-header">
              <span class="version">v{{ entry.version }}</span>
              <span class="date">{{ formatDate(entry.date) }}</span>
            </div>
            <van-cell v-for="(change, index) in entry.changes" :key="index" :title="change.desc" readonly
              class="change-item">
              <template #right-icon>
                <van-tag :type="getTagType(change.type)" size="mini" round>
                  {{ getTagText(change.type) }}
                </van-tag>
              </template>
            </van-cell>
          </div>
        </div>
      </van-cell-group>

      <div class="footer">
        © {{ new Date().getFullYear() }} 学生信息助手
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue' // 👈 必须导入
import { Dialog } from 'vant'
const router = useRouter()

const FEEDBACK_FORM_URL = 'https://www.wjx.cn/vm/YxTypie.aspx# ' // 👈 替换为你的表单链接
// 表单
const openFeedbackForm = () => {
  window.open(FEEDBACK_FORM_URL, '_blank') // 在新标签页打开
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
// 你的微信二维码图片（建议放在 public 目录）
const wechatQRCode = '/wechat-qr.png' // 👈 替换为你的二维码路径

const showDialog = ref(false)
const showQR = ref(false)

const showConfirmDialog = () => {
  showDialog.value = true
}

const showQRCode = () => {
  showDialog.value = false // 关闭确认框
  showQR.value = true      // 显示二维码
}
// 模拟更新日志数据
// 模拟更新日志数据（已优化内容）
const changelog = [
  {
    version: '1.3.0',
    date: '2025-10-25',
    changes: [
      { type: 'feature', desc: '补充学籍、学历、学位等剩余页面' },
      { type: 'perf', desc: '优化页面加载性能，提升响应速度' },
      { type: 'improvement', desc: '完善表单修改时的排序逻辑与冲突处理' }
    ]
  },
  {
    version: '1.2.0',
    date: '2025-10-24',
    changes: [
      { type: 'feature', desc: '新增信息修改功能入口' },
      { type: 'improvement', desc: '优化表单编辑体验与数据同步机制' }
    ]
  },
  {
    version: '1.1.0',
    date: '2025-10-23',
    changes: [
      { type: 'feature', desc: '实现基础信息修改功能' },
      { type: 'fix', desc: '修复页面布局错乱问题' }
    ]
  }
]

// 工具函数：格式化日期为“X月X日”
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取标签文本
const getTagText = (type) => {
  const map = {
    feature: '新增',
    improvement: '优化',
    fix: '修复',
    perf: '性能'
  }
  return map[type] || '更新'
}

// 获取 Vant Tag 对应的 type（用于颜色）
const getTagType = (type) => {
  const map = {
    feature: 'success',    // 绿色
    improvement: 'primary', // 蓝色
    fix: 'danger',         // 红色
    perf: 'warning'        // 橙色，适合性能类
  }
  return map[type] || 'default'
}
</script>
  
<style scoped>
.dialog-content {
  text-align: center;
  padding: 10px 10px;
  margin: 0;
  font-size: 16px;
  color: #333;
}

/* 二维码弹层样式 */
.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.qr-tip {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

.about-page {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding: 0 12px 24px;
}

.app-icon {
  font-size: 28px;
  margin-right: 12px;
}

.app-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.app-version {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 更新日志样式 */
.changelog-entries {
  padding: 0 12px;
}

.changelog-entry+.changelog-entry {
  margin-top: 20px;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.version {
  font-weight: bold;
  color: #333;
}

.date {
  font-size: 12px;
  color: #999;
}

.change-item {
  padding-left: 8px;
}

.change-item :deep(.van-cell__title) {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>