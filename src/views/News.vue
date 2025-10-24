<template>
  <div class="news-page">
    <van-nav-bar title="新闻" fixed />

    <!-- 下拉刷新容器 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 上拉加载列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item.id"
          :title="item.title"
          :label="formatTime(item.displayOn)"
          is-link
          @click="goToUrl(item.url)"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Toast } from 'vant'

const list = ref([])
const loading = ref(false) // 上拉加载状态
const finished = ref(false)
const refreshing = ref(false) // 下拉刷新状态

// 格式化时间显示
const formatTime = (displayOn) => {
  if (!displayOn || displayOn.length !== 14) return ''
  const month = displayOn.slice(4, 6)
  const day = displayOn.slice(6, 8)
  const hh = displayOn.slice(8, 10)
  const mm = displayOn.slice(10, 12)
  const ss = displayOn.slice(12, 14)
  return `${month}-${day} ${hh}:${mm}:${ss}`
}

// 跳转外部链接
const goToUrl = (url) => {
  if (url) window.open(url, '_blank')
}

// 生成当前时间字符串（YYYYMMDDHHmmss）
const getCurrentOn = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${y}${m}${d}${h}${min}${s}`
}

// 【新增】下拉刷新：获取最新数据
const onRefresh = async () => {
  try {
    const onParam = getCurrentOn()
    const res = await fetch(`/.netlify/functions/news?ope=old&size=10&on=${onParam}`)
    const data = await res.json()

    if (Array.isArray(data)) {
      list.value = data // 替换为最新数据
      finished.value = false // 重置“加载完成”状态，允许继续上拉
      Toast.success('刷新成功')
    }
  } catch (error) {
    console.error('刷新失败:', error)
    Toast.fail('刷新失败')
  } finally {
    refreshing.value = false // 必须手动关闭刷新状态
  }
}

// 上拉加载更多
const onLoad = async () => {
  if (list.value.length === 0) {
    // 如果列表为空（比如刚刷新后又触发 onLoad），先加载最新数据
    await onRefresh()
    loading.value = false
    return
  }

  const lastItem = list.value[list.value.length - 1]
  const onParam = lastItem?.displayOn

  if (!onParam) {
    loading.value = false
    return
  }

  try {
    const res = await fetch(`/.netlify/functions/news?ope=old&size=10&on=${onParam}`)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      list.value.push(...data)
    } else {
      finished.value = true
    }
  } catch (error) {
    console.error('加载更多失败:', error)
    Toast('加载失败')
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.news-page {
  padding-top: 46px;
  background-color: #f7f8fa;
}

.van-cell__label {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.van-cell__title {
  word-break: break-all;
  line-height: 1.5;
}
</style>