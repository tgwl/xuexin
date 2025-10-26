<template>
    <div class="page-container">
      <!-- 顶部导航栏 -->
      <van-nav-bar
        :left-arrow="false"
        :border="false"
        :fixed="true"
        style="background-color: #27ae60; color: white;"
      >
        <template #left>
          <van-icon name="home-o" size="24" color="white" @click="goBack" />
        </template>
        <template #right>
          <div class="nav-right">
            <van-icon name="chat-o" size="24" color="white" />
            <div class="divider"></div>
            <van-icon name="close" size="24" color="white" />
          </div>
        </template>
      </van-nav-bar>
  
      <!-- 主体内容 -->
      <div class="content-wrapper">
        <div class="icon-circle">
          <span class="exclamation-mark">!</span>
        </div>
  
        <!-- 文字容器：居中对齐 -->
        <div class="message-container">
          <div class="message-line">您登录的账号不在报考单位的准考名单中，</div>
          <div class="message-line">请先确认账号信息，若有疑问，请联系报考单位。</div>
        </div>
  
        <van-button
          type="primary"
          block
          round
          style="
            background-color: #27ae60;
            border-color: #27ae60;
            color: white;
            font-size: 18px;
            height: 50px;
            margin-top: 40px;
            font-weight: bold;
          "
          @click="goHome"
        >
          返回首页
        </van-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goBack = () => {
    router.back()
  }
  
  const goHome = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  .page-container {
    background-color: #fff;
    min-height: 100vh;
    padding-top: 50px;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .divider {
    width: 1px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 0;
    text-align: center;
  }
  
  .icon-circle {
    width: 80px;
    height: 80px;
    background-color: #dfe6e9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .exclamation-mark {
    font-size: 40px;
    color: #bdc3c7;
    font-weight: bold;
    line-height: 1;
  }
  
  .message-container {
    text-align: center;
    margin-bottom: 40px;
    max-width: 90%;
  }
  
  .message-line {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    white-space: nowrap; /* 禁止自动换行 */
    display: block;       /* 每行独占一行 */
    text-align: center;   /* 关键：让每行文字自身居中 */
  }
  </style>