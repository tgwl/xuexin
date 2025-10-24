<template>
    <div class="cancel-account-page">
      <!-- 导航栏 -->
      <van-nav-bar title="注销账号" left-arrow @click-left="$router.back()" />
  
      <!-- 警告图标与提示 -->
      <div class="warning-section">
        <van-icon name="warning-o" size="60" color="#FF8C2E" />
        <p class="warning-text">
          您申请注销的学信网账号应当是您本人注册并使用的账号，请填写本人信息及短信验证码核实为本人操作。
        </p>
      </div>
  
      <!-- 表单区域 -->
      <van-form @submit="onSubmit">
        <van-field
          v-model="formData.name"
          label="姓名"
          placeholder="输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="formData.idCard"
          label="证件号码"
          placeholder="输入证件号码"
          :rules="[{ required: true, message: '请填写证件号码' }]"
        />
        <van-field
          v-model="formData.phone"
          label="手机号"
          placeholder="输入手机号"
          :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]"
        />
        <van-field
          v-model="formData.code"
          center
          clearable
          label="短信验证码"
          placeholder="输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              plain
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
  
        <!-- 底部须知与按钮 -->
        <div class="footer-section">
          <p class="notice">
            注销具体影响请查看
            <span class="link" @click="showNotice">《学信网账号注销须知》</span>
          </p>
          <van-button
            block
            type="primary"
            native-type="submit"
            class="submit-btn"
          >
            同意须知并注销
          </van-button>
        </div>
      </van-form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { showToast } from 'vant'
  
  // 表单数据
  const formData = reactive({
    name: '',
    idCard: '',
    phone: '',
    code: ''
  })
  
  // 验证码倒计时
  const countdown = ref(0)
  
  // 发送验证码
  const sendCode = () => {
    if (!formData.phone) {
      showToast('请先填写手机号')
      return
    }
    // 模拟发送成功
    showToast('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  // 提交表单
  const onSubmit = () => {
    console.log('提交表单:', formData)
    showToast('注销申请已提交，请等待审核')
    // 这里可调用后端接口
  }
  
  // 查看须知
  const showNotice = () => {
    showToast('跳转至《学信网账号注销须知》页面')
    // router.push('/notice')
  }
  </script>
  
  <style scoped>
  .cancel-account-page {
    background-color: #fff;
    min-height: 100vh;
    padding-top: 10px; /* 适配导航栏高度 */
  }
  
  .warning-section {
    text-align: center;
    padding: 30px 20px;
  }
  
  .warning-text {
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    text-align: left;
    padding: 0 20px;
  }
  
  .footer-section {
    padding: 20px;
  }
  
  .notice {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .link {
    color: #1989fa;
    text-decoration: underline;
  }
  
  .submit-btn {
    background-color: #00bcd4;
    border: none;
    font-size: 16px;
    height: 48px;
    border-radius: 8px;
  }
  </style>