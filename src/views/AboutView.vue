<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="关于" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <!-- 应用信息区 -->
      <div class="app-info-card">
        <div class="app-icon">🎓</div>
        <div class="app-text">
          <h2 class="app-name">学生信息助手</h2>
          <p class="app-version">v1.3.0</p>
        </div>
      </div>

      <!-- 功能列表 -->
      <div class="section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="label">简介</span>
            <span class="value">一个轻量级的学生信息管理工具，支持表单填写、本地保存与编辑。</span>
          </div>
          <div class="info-item">
            <span class="label">联系开发者</span>
            <span class="value clickable" @click="showConfirmDialog">煜</span>
          </div>
          <div class="info-item">
            <span class="label">部署平台</span>
            <span class="value">Netlify + Vercel + CloudPage</span>
          </div>
          <div class="info-item">
            <span class="label">技术栈</span>
            <span class="value">Vue 3 + Vant 4</span>
          </div>
        </div>
      </div>

      <!-- 当前站点 -->
      <div class="section">
        <h3 class="section-title">当前站点</h3>
        <div class="domain-cards">
          <a
            v-for="domain in domains"
            :key="domain.url"
            :href="domain.url"
            target="_blank"
            class="domain-card"
          >
            <span class="domain-icon">🌐</span>
            <span class="domain-text">{{ domain.name }}</span>
          </a>
        </div>
      </div>

      <!-- 反馈入口 -->
      <div class="section">
        <h3 class="section-title">帮助与反馈</h3>
        <div class="feedback-btn" @click="openFeedbackForm">
          <span>📝 填写在线反馈表单</span>
          <van-icon name="arrow" size="16" />
        </div>
      </div>

      <!-- 更新日志 -->
      <div class="section">
        <h3 class="section-title">更新日志</h3>
        <div class="changelog">
          <div
            v-for="entry in changelog"
            :key="entry.version"
            class="changelog-entry"
          >
            <div class="version-header">
              <span class="version">v{{ entry.version }}</span>
              <span class="date">{{ formatDate(entry.date) }}</span>
            </div>
            <ul class="changes-list">
              <li
                v-for="(change, index) in entry.changes"
                :key="index"
                class="change-item"
              >
                <van-tag :type="getTagType(change.type)" size="mini" round>
                  {{ getTagText(change.type) }}
                </van-tag>
                <span>{{ change.desc }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer">
        © {{ new Date().getFullYear() }} 学生信息助手
      </div>
    </div>

    <!-- 联系确认对话框 -->
    <van-dialog
      v-model:show="showDialog"
      title="联系开发者"
      show-cancel-button
      confirm-button-text="确定"
      cancel-button-text="取消"
      @confirm="showQRCode"
      @cancel="showDialog = false"
    >
      <p class="dialog-content">是否联系开发者？</p>
    </van-dialog>

    <!-- 二维码弹层 -->
    <van-overlay :show="showQR" @click="showQR = false">
      <div class="qr-container" @click.stop>
        <van-image :src="wechatQRCode" width="240" height="240" fit="contain" radius="12" />
        <div class="qr-tip">长按保存二维码，微信扫码联系</div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Dialog } from 'vant'

const router = useRouter()

const FEEDBACK_FORM_URL = 'https://www.wjx.cn/vm/YxTypie.aspx#'

const openFeedbackForm = () => {
  window.open(FEEDBACK_FORM_URL, '_blank')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const wechatQRCode = '/wechat-qr.png'

const showDialog = ref(false)
const showQR = ref(false)

const showConfirmDialog = () => {
  showDialog.value = true
}

const showQRCode = () => {
  showDialog.value = false
  showQR.value = true
}

// 域名列表（可自定义）
const domains = [
  { name: 'Netlify 部署', url: 'https://xuexin.netlify.app/' },
  { name: 'Vercel 部署', url: 'https://xuexin-dusky.vercel.app/' },
  { name: 'CloudPage 部署', url: 'https://xuexin.pages.dev/#/' }
]

// 更新日志
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const getTagText = (type) => {
  const map = {
    feature: '新增',
    improvement: '优化',
    fix: '修复',
    perf: '性能'
  }
  return map[type] || '更新'
}

const getTagType = (type) => {
  const map = {
    feature: 'success',
    improvement: 'primary',
    fix: 'danger',
    perf: 'warning'
  }
  return map[type] || 'default'
}
</script>

<style scoped>
.about-page {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.content {
  padding: 20px 16px 32px;
}

/* 应用信息卡 */
.app-info-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.app-icon {
  font-size: 32px;
  color: #1890ff;
  margin-right: 16px;
}

.app-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.app-version {
  font-size: 14px;
  color: #999;
  margin: 4px 0 0;
}

/* 区块标题 */
.section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.value {
  flex: 1;
  text-align: right;
  color: #333;
  font-size: 14px;
}

.clickable {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}

/* 域名卡片 */
.domain-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.domain-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  text-align: center;
  line-height: 1.4;
}

.domain-card:hover {
  background: #bae7ff;
  transform: translateY(-2px);
}

.domain-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 反馈按钮 */
.feedback-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.feedback-btn:hover {
  background: #f5f5f5;
}

.feedback-btn span {
  font-size: 14px;
  color: #333;
}

/* 更新日志 */
.changelog-entry {
  margin-bottom: 24px;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.version {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.date {
  font-size: 12px;
  color: #999;
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.change-item .van-tag {
  margin-top: 2px;
}

/* 对话框 & 二维码 */
.dialog-content {
  text-align: center;
  padding: 16px;
  font-size: 16px;
  color: #333;
}

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
  padding: 24px;
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

/* 底部版权 */
.footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>