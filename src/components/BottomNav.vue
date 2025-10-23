<template>

            <!-- 底部导航 -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item" active-class="active">
        <Icon icon="mdi:home-outline" class="nav-icon" />
        <span>首页</span>
      </router-link>
      <router-link to="/new" class="nav-item" active-class="active">
        <Icon icon="mdi:newspaper-variant-outline" class="nav-icon" />
        <span>新闻</span>
      </router-link>
      <router-link to="/me" class="nav-item" active-class="active">
        <Icon icon="mdi:account-outline" class="nav-icon" />
        <span>我的</span>
      </router-link>
    </nav>
  </template>
  
  <script setup>
  // 无需逻辑，路由自动激活
  
import { Icon } from '@iconify/vue';
  </script>
  
  <style scoped>
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    background: #fff;
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 33.33%;
    height: 100%;
    text-decoration: none;
    color: #888;
    font-size: 12px;
    transition: color 0.2s;
  }
  
  .nav-item.active {
    color: #00bfa5; /* 学信网绿色 */
  }
  
  .nav-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
  </style>