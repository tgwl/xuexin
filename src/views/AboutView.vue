<template>
  <div class="about-guide-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="关于与使用" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <!-- 应用信息（始终显示） -->
      <div class="card app-card">
        <div class="app-header">
          <div class="app-icon">🎓</div>
          <div>
            <h1 class="app-name">学生信息助手</h1>
            <p class="app-version">v1.3.0</p>
          </div>
        </div>
      </div>

      <div class="card intro-card">
        <h2 class="section-title">📖 项目简介</h2>
        <p class="intro-text">
          「学生信息助手」是一款轻量级的个人学业信息管理工具，专为在校学生或毕业生设计。支持记录学籍、学历、学位等关键信息，并可在多设备间通过手动同步（如截图或笔记）进行备份。
        </p>
      </div>

      <!-- 可折叠内容 -->
      <van-collapse v-model="activeName" accordion>
        <!-- 使用说明 -->
        <van-collapse-item name="usage" title="🚀 使用说明">
          <div class="steps">
            <div class="step" v-for="(step, i) in steps" :key="i">
              <span class="step-num">{{ i + 1 }}</span>
              <span class="step-text">{{ step }}</span>
            </div>
          </div>
        </van-collapse-item>

        <!-- 注意事项 -->
        <van-collapse-item name="notes" title="⚠️ 注意事项">
          <ul class="note-list">
            <li>数据通过 <code>localStorage</code> 保存，刷新页面不会丢失。</li>
            <li>请勿在公共或共享设备上使用，避免他人查看您的信息。</li>
            <li>不同部署站点（Netlify / Vercel / Cloudflare Pages）数据<strong>不互通</strong>，建议固定使用一个域名。</li>
            <li>如需清除所有数据，请在浏览器中手动清除该站点的本地存储。</li>
            <li><strong>访问限制说明</strong>：
              <ul class="sub-list">
                <li><strong>Netlify</strong>：有流量配额限制，高峰期可能无法访问；</li>
                <li><strong>Vercel</strong>：主要面向境外网络，国内访问可能不稳定；</li>
                <li><strong>Cloudflare Pages</strong>：国内访问更稳定，推荐优先使用。</li>
              </ul>
            </li>
          </ul>
        </van-collapse-item>

        <!-- 常见问题 -->
        <van-collapse-item name="faq" title="❓ 常见问题">
          <van-cell v-for="(faq, i) in faqs" :key="i" :title="faq.q" :value="faq.a" />
        </van-collapse-item>

        <!-- 当前站点 -->
        <van-collapse-item name="sites" title="🌐 当前可用站点">
          <div class="domain-grid">
            <a v-for="site in sites" :key="site.url" :href="site.url.trim()" target="_blank" class="domain-card">
              {{ site.name }}
              <van-icon name="arrow" size="14" class="domain-arrow" />
            </a>
          </div>
        </van-collapse-item>

        <!-- 更新日志 -->
        <van-collapse-item name="changelog" title="📈 最近更新">
          <div class="log-entry" v-for="log in recentLogs" :key="log.version">
            <div class="log-header">
              <span class="log-version">v{{ log.version }}</span>
              <span class="log-date">{{ formatDate(log.date) }}</span>
            </div>
            <ul class="log-list">
              <li v-for="(item, idx) in log.changes" :key="idx">
                <van-tag :type="getTagType(item.type)" size="mini" round>
                  {{ getTagText(item.type) }}
                </van-tag>
                {{ item.desc }}
              </li>
            </ul>
          </div>
        </van-collapse-item>
      </van-collapse>

      <!-- 联系与反馈（始终显示） -->
      <div class="card feedback-card">
        <h2 class="section-title">📬 联系与反馈</h2>
        <div class="feedback-actions">
          <van-button type="primary" block @click="openFeedbackForm">📝 填写反馈表单</van-button>
          <van-button plain type="info" block @click="showConfirmDialog" style="margin-top: 12px">
            💬 联系开发者（微信）
          </van-button>
        </div>
      </div>

      <div class="footer">© {{ new Date().getFullYear() }} 学生信息助手</div>
    </div>

    <!-- 联系确认对话框 -->
    <van-dialog v-model:show="showDialog" title="联系开发者" show-cancel-button confirm-button-text="显示二维码"
      cancel-button-text="取消" @confirm="showQRCode" @cancel="showDialog = false">
      <p class="dialog-text">是否查看微信联系二维码？</p>
    </van-dialog>

    <!-- 二维码弹层 -->
    <van-overlay :show="showQR" @click="showQR = false">
      <div class="qr-container" @click.stop>
        <van-image :src="wechatQRCode" width="220" height="220" fit="contain" radius="12" />
        <div class="qr-tip">长按保存二维码，微信扫码联系</div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const FEEDBACK_FORM_URL = 'https://www.wjx.cn/vm/YxTypie.aspx#'
const wechatQRCode = '/wechat-qr.png'

const activeName = ref('usage')
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const openFeedbackForm = () => {
  window.open(FEEDBACK_FORM_URL, '_blank')
}

// 默认展开：仅“使用说明”
const activeNames = ref(['usage'])

// 站点列表
const sites = [
  { name: 'Netlify 部署', url: 'https://xuexin.netlify.app/' },
  { name: 'Vercel 部署', url: 'https://xuexin-dusky.vercel.app/' },
  { name: 'Cloudflare Pages', url: 'https://xuexin.pages.dev/#/' }
]

// 使用步骤
const steps = [
  '在「我的」页面点击头像，编辑个人信息或上传头像',
  '在「我的」→“退出登录”区域，编辑教育相关信息',
  '填写完成后点击“保存”，数据将自动存入浏览器',
  '下次访问同一域名时，信息会自动加载'
]

// 常见问题
const faqs = [
  { q: '数据会上传到服务器吗？', a: '不会。所有数据仅保存在您当前浏览器的 localStorage 中，完全本地化。' },
  { q: '换域名后数据还在吗？', a: '不在。不同域名被视为不同站点，浏览器数据隔离，无法共享。' },
  { q: '如何清除所有信息？', a: '在浏览器设置中清除该站点的 Cookie 与本地存储即可。' },
  { q: '支持手机使用吗？', a: '支持！页面已适配移动端，可在手机浏览器中正常使用。' }
]

// 更新日志
const recentLogs = [
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
  }
]

// 工具函数
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const getTagText = (type) => {
  const map = { feature: '新增', improvement: '优化', fix: '修复', perf: '性能' }
  return map[type] || '更新'
}

const getTagType = (type) => {
  const map = { feature: 'success', improvement: 'primary', fix: 'danger', perf: 'warning' }
  return map[type] || 'default'
}

// 微信联系
const showDialog = ref(false)
const showQR = ref(false)

const showConfirmDialog = () => {
  showDialog.value = true
}

const showQRCode = () => {
  showDialog.value = false
  showQR.value = true
}
</script>

<style scoped>
.intro-card {
  margin-bottom: 16px;
}

.intro-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
}

.about-guide-page {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.content {
  padding: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.app-card {
  margin-bottom: 16px;
}

.feedback-card {
  margin-top: 16px;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-icon {
  font-size: 32px;
  color: #3b82f6;
}

.app-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.app-version {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px;
}

/* 步骤 */
.steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-num {
  flex: 0 0 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
}

.step-text {
  flex: 1;
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}

/* 注意事项 */
.note-list {
  padding-left: 20px;
  margin: 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.7;
}

.note-list li {
  margin-bottom: 10px;
}

.sub-list {
  margin-top: 8px;
  padding-left: 20px;
  font-size: 13px;
  color: #64748b;
}

.sub-list li {
  margin-bottom: 6px;
}

code {
  background: #f1f5f9;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 13px;
}

/* 站点卡片 */
.domain-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.domain-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  color: #1e293b;
  font-size: 14px;
  transition: background 0.2s;
}

.domain-card:hover {
  background: #eef2ff;
}

.domain-arrow {
  color: #94a3b8;
}

/* 更新日志 */
.log-entry {
  margin-bottom: 20px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.log-version {
  font-weight: 600;
  color: #1e293b;
}

.log-date {
  color: #94a3b8;
}

.log-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.log-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}

.log-list li .van-tag {
  margin-top: 2px;
}

/* 反馈按钮 */
.feedback-actions {
  margin-top: 12px;
}

/* 二维码 */
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.qr-tip {
  margin-top: 12px;
  font-size: 14px;
  color: #64748b;
  text-align: center;
  line-height: 1.4;
}

.dialog-text {
  text-align: center;
  padding: 16px;
  color: #334155;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
</style>