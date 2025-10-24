<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <van-nav-bar title="学信网" />

    <!-- 动态区块渲染 -->
    <div v-for="block in orderedBlocks" :key="block.id" class="section">
      <!-- Banner 横幅：在线考试系统 -->
      <template v-if="block.id === '6'">
        <div class="banner-wrapper">
          <van-image :src="block.icon?.trim()" fit="contain" width="100%" height="100%" />
        </div>
      </template>

      <!-- 功能区：学籍学历 / 出国服务 -->
      <template v-else>
        <h2 class="section-title">{{ block.name }}</h2>
        <van-grid :column-num="block.name.includes('出国') ? 3 : 4" :gutter="10">
          <van-grid-item v-for="(item, idx) in block.subData || []" :key="idx" :text="item.name" @click="goToPage(item)">
            <template #icon>
              <div class="grid-icon" :style="{ backgroundColor: item.bgHexStr || '#f0f9ff' }">
                <img :src="(item.icon || '').trim()" alt="" />
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </template>
    </div>

    <van-button type="warning"  @click="save()">警告按钮</van-button>
  <van-button type="default" @click="clear()">默认按钮</van-button>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted, onUpdated } from 'vue'

const router = useRouter()
const activeTab = ref(0)

onMounted(() => {
  console.log('组件挂载完成')
})

const xjList= [
      {
        id: 'abc123',
        schoolName: 'xl学',
        educationLevel: '本科',
        major: '计算机科学与技术',
        studyForm: '普通全日制',
      },
      {
        id: 'abc124',
        schoolName: '河北',
        educationLevel: '本科',
        major: '计算机科学与技术',
        studyForm: '普通全日制',
      },
      {
        id: 'abc125',
        schoolName: '河南科技大学',
        educationLevel: '本科',
        major: '工程造价',
        studyForm: '普通全日制',
      },
      {
        id: 'abc126',
        schoolName: '奥里给',
        educationLevel: '本科',
        major: '计算机科学与技术',
        studyForm: '普通全日制',
      },
    ]
const rawData = {
  code: '200',
  msg: '',
  result: [
    {
      deployDate: 1676602861000,
      desc: '修改“高等教育成绩单”的入口，修改“学位查询”入口',
      data: [
        {
          name: '学籍学历学位',
          icon: '',
          id: '5',
          subData: [
            {
              name: '学籍查询',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xjcx-2.0.0.png  ',
              type: 'h5',
              data: 'https://my.chsi.com.cn/archive/index.action  ',
              bgHexStr: '#6AFFE4',
              route: '/xjcx'
            },
            {
              name: '学籍验证',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xjyz-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/report/search.jsp  ',
              bgHexStr: '#6AFFE4',
              route: '/xjyz'
            },
            {
              name: '学历查询',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xlcx-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/xlcx/lscx/query.do  ',
              bgHexStr: '#97E6FF',
              route: '/xlcx'
            },
            {
              name: '学历验证',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xlyz-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/report/search.jsp  ',
              bgHexStr: '#97E6FF',
              route: '/xlyz'
            },
            {
              name: '学历认证',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xlrz-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_gdjyxl.jsp  ',
              bgHexStr: '#97E6FF',
              route: '/xlrz'
            },
            {
              name: '学位查询',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xwcx-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/xwcx/lscx/query.do  ',
              bgHexStr: '#95D6FF',
              route: '/xwcx'
            },
            {
              name: '学位验证',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/xwyz-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/report/search.jsp  ',
              bgHexStr: '#95D6FF',
              route: '/xwyz'
            }
          ]
        },
        {
          name: '在线考试系统',
          icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/zxks-banner-2.0.0.jpg  ',
          id: '6',
          subData: []
        },
        {
          name: '出国教育背景信息服务',
          icon: '',
          id: '7',
          subData: [
            {
              name: '中等教育学历',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/zdjyxl-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_zdjyxl.jsp  ',
              bgHexStr: '#97E6FF',
              route: '/zdjyxl'
            },
            {
              name: '高等教育成绩单',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/gdjycjd-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_gdjycjd.jsp  ',
              bgHexStr: '#95D6FF',
              route: '/gdjycjd'
            },
            {
              name: '高考成绩单',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/gkcjd-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_gkcj.jsp  ',
              bgHexStr: '#97E6FF',
              route: '/gkcjd'
            },
            {
              name: '中学成绩单',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/zxcjd-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_zxcj.jsp  ',
              bgHexStr: '#6AFFE4',
              route: '/zxcjd'
            },
            {
              name: '会考成绩单',
              icon: 'https://t1.chei.com.cn/chsi/push/images/conf/home/202302/hkcjd-2.0.0.png  ',
              type: 'h5',
              data: 'https://www.chsi.com.cn/wap/xlrz/report/report_hkcj.jsp  ',
              bgHexStr: '#FFD9A9',
              route: '/hkcjd'
            }
          ]
        }
      ]
    }
  ]
}

// 提取最新配置并排序：5 → 6 → 7
const orderedBlocks = computed(() => {
  const latest = rawData.result[0].data
  const xueji = latest.find((b: any) => b.id === '5')
  const banner = latest.find((b: any) => b.id === '6')
  const abroad = latest.find((b: any) => b.id === '7')
  return [xueji, banner, abroad].filter(Boolean)
})

// 路由跳转
const goToPage = (item: any) => {
  if (item.route) {
    router.push(item.route)
  } else {
    console.warn('未配置路由:', item.name)
  }
}

const save =()=>{
  try {
        localStorage.setItem('xjList', JSON.stringify(xjList));
        console.log('✅ 数据已保存到 localStorage');
      } catch (e) {
        console.error('❌ 保存失败:', e);
      }
}

const clear=()=>{
  localStorage.removeItem('xlList');
  localStorage.removeItem('xjList');
}

// 图标 URL 处理（去除空格）
const getIconUrl = (url: string) => {
  return (url || '').trim()
}

// 图片加载失败 fallback（可选）
const handleImageError = (e: Event, item: any) => {
  const target = e.target as HTMLImageElement
  // 可替换为默认图标
  target.src = 'https://via.placeholder.com/22/cccccc/FFFFFF?text=?'
}
</script>

<style scoped>
.home-container {
  padding-bottom: 50px;
  background-color: #f7f8fa;
}

.section {
  margin: 10px 0;
  padding: 0 15px;
  min-height: 80px;
  /* 确保有足够空间显示标题 */
  position: relative;
  /* 防止子元素绝对定位覆盖 */
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 10px;
  padding-left: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 1.4;
}

.banner-wrapper {
  width: 100%;
  padding: 10px 0;
  background: #f0f9ff;
  border-radius: 8px;
  overflow: hidden;
}

.banner-wrapper img {
  max-height: 150px;
  width: auto;
  margin: 0 auto;
}

/* ============ 关键：覆盖 Vant Grid 样式 ============ */
:deep(.van-grid-item__content) {
  padding: 10px 6px !important;
  /* 减少左右 padding，给文字留空间 */
}

:deep(.van-grid-item__icon) {
  margin-bottom: 6px !important;
}

:deep(.van-grid-item__text) {
  font-size: 11px !important;
  color: #333 !important;
  /* 强制单行显示 */
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  text-align: center !important;
  line-height: 1.4 !important;
  padding: 0 2px !important;
  /* 微调内边距 */
}

/* 针对出国服务（3列）进一步优化宽度 */
:deep(.van-grid--3-column) .van-grid-item {
  width: calc(33.333% - 6.67px);
}

/* 替换你原来的 .grid-icon 样式 */
.grid-icon {
  width: 40px;
  /* 原为 36px 或 50px，调整到 40px */
  height: 40px;
  border-radius: 8px;
  /* 与原图一致 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  /* 上下间距 */
  background: #fff;
  /* 确保背景白色，避免和 bgHexStr 冲突 */
}

.grid-icon img {
  width: 24px;
  /* 图标内容缩小到 24px */
  height: 24px;
  object-fit: contain;
  /* 按比例缩放，不拉伸 */
}
</style>