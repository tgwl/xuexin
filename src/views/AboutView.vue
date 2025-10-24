<template>
    <div class="about-page">
      <!-- 顶部导航 -->
      <van-nav-bar
        title="关于"
        left-arrow
        @click-left="goBack"
        fixed
      />
  
      <div class="content">
        <!-- 关于信息 -->
        <van-cell-group class="about-section">
          <van-cell center>
            <template #icon>
              <div class="app-icon">🎓</div>
            </template>
            <template #title>
              <div class="app-name">学生信息助手</div>
              <div class="app-version">v1.2.0</div>
            </template>
          </van-cell>
  
          <van-cell
            title="简介"
            label="一个轻量级的学生信息管理工具，支持表单填写、本地保存与编辑。"
            readonly
          />
          <van-cell
            title="开发者"
            value="煜"
            readonly
          />
          <van-cell
            title="部署平台"
            value="Netlify + Vercel"
            readonly
          />
          <van-cell
            title="技术栈"
            value="Vue 3 + Vant 4 "
            readonly
          />
        </van-cell-group>
  
        <van-divider :style="{ margin: '16px 0' }" />
  
        <!-- 更新日志 -->
        <van-cell-group class="changelog-section">
          <van-cell title="更新日志" readonly />
          
          <div class="changelog-entries">
            <div
              v-for="entry in changelog"
              :key="entry.version"
              class="changelog-entry"
            >
              <div class="version-header">
                <span class="version">v{{ entry.version }}</span>
                <span class="date">{{ formatDate(entry.date) }}</span>
              </div>
              <van-cell
                v-for="(change, index) in entry.changes"
                :key="index"
                :title="change.desc"
                readonly
                class="change-item"
              >
                <template #right-icon>
                  <van-tag
                    :type="getTagType(change.type)"
                    size="mini"
                    round
                  >
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
  
  const router = useRouter()
  
  const goBack = () => {
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      router.push('/')
    }
  }
  
  // 模拟更新日志数据
  const changelog = [

{
  version: '1.2.0',
  date: '2025-10-24',
  changes: [
    { type: 'feature', desc: '补充剩下页面' },
    { type: 'improvement', desc: '增加修改信息功能' }
  ]
},
{
  version: '1.1.0',
  date: '2025-10-23',
  changes: [
    { type: 'feature', desc: '新增加修改功能' },
    { type: 'fix', desc: '修复页面错乱' }
  ]
}
]
  
  // 工具函数
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  const getTagText = (type) => {
    const map = { feature: '新增', improvement: '优化', fix: '修复' }
    return map[type] || '更新'
  }
  
  const getTagType = (type) => {
    const map = { feature: 'success', improvement: 'primary', fix: 'danger' }
    return map[type] || 'default'
  }
  </script>
  
  <style scoped>
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
  
  .changelog-entry + .changelog-entry {
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