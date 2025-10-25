<template>
  <div class="news-page">
    <van-nav-bar title="新闻" fixed />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 首次加载或刷新时显示加载中 -->
      <div v-if="initialLoading" class="initial-loading">
        <van-loading type="spinner" size="24px" vertical>加载中...</van-loading>
      </div>

      <!-- 数据加载完成后显示列表 -->
      <van-list
        v-else
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
          :arrow="false"
          @click="goToUrl(item.url)"
        />
      </van-list>
    </van-pull-refresh>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from 'vant'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const initialLoading = ref(true) // 控制初始加载状态

const formatTime = (displayOn) => {
  if (!displayOn || displayOn.length !== 14) return ''
  const month = displayOn.slice(4, 6)
  const day = displayOn.slice(6, 8)
  const hh = displayOn.slice(8, 10)
  const mm = displayOn.slice(10, 12)
  const ss = displayOn.slice(12, 14)
  return `${month}-${day} ${hh}:${mm}:${ss}`
}

const goToUrl = (url) => {
  if (url) window.open(url, '_blank')
}

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

// 加载数据（通用函数）
const fetchData = async (onParam) => {
  const res = await fetch(`/.netlify/functions/news?ope=old&size=10&on=${onParam}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('返回数据不是数组')
  return data
}

// 首次加载 & 刷新
const loadInitialData = async () => {
  try {
    const onParam = getCurrentOn()
    const data = await fetchData(onParam)
    list.value = data
    finished.value = false
  } catch (error) {
    console.error('加载失败:', error)
    Toast('加载失败')
    finished.value = true
  } finally {
    initialLoading.value = false
  }
}

// 页面初始化时加载
onMounted(() => {
  loadInitialData()
})

// 下拉刷新
const onRefresh = async () => {
  initialLoading.value = true // 重新显示加载中
  try {
    await loadInitialData()
    Toast('刷新成功')
  } catch (error) {
    Toast('刷新失败')
  } finally {
    refreshing.value = false
    // 注意：loadInitialData 的 finally 已经将 initialLoading 设为 false
  }
}

// 上拉加载更多
const onLoad = async () => {
  if (finished.value) return

  const lastItem = list.value[list.value.length - 1]
  if (!lastItem?.displayOn) {
    loading.value = false
    finished.value = true
    return
  }

  try {
    const data = await fetchData(lastItem.displayOn)
    if (data.length > 0) {
      list.value.push(...data)
    } else {
      finished.value = true
      Toast('没有更多数据了')
    }
  } catch (error) {
    console.error('加载更多失败:', error)
    Toast('加载失败')
    finished.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.news-page {
  padding-top: 46px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.initial-loading {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
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