<template>
  <div v-if="columns.length" class="card table-search">
    <el-form ref="formRef" :model="searchParam">
      <SearchGrid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <SearchGridItem
          v-for="(item, index) in columns"
          :key="item.prop"
          v-bind="getResponsive(item)"
          :index="index"
        >
          <el-form-item :label-width="150">
            <template #label>
              <el-space :size="4">
                <span>{{ `${item.search?.label ?? item.label}` }}</span>
                <el-tooltip
                  v-if="item.search?.tooltip"
                  effect="dark"
                  :content="item.search?.tooltip"
                  placement="top"
                >
                  <i :class="'iconfont icon-yiwen'"></i>
                </el-tooltip>
              </el-space>
              <span>&nbsp;:</span>
            </template>
            <SearchFormItem :column="item" :search-param="searchParam" />
          </el-form-item>
        </SearchGridItem>
        <SearchGridItem suffix>
          <div class="operation">
            <el-button type="primary" :icon="Search" @click="search"> 搜索 </el-button>
            <el-button :icon="Delete" @click="reset"> 重置 </el-button>
            <el-button
              v-if="showCollapse"
              type="primary"
              link
              class="search-isOpen"
              @click="collapsed = !collapsed"
            >
              {{ collapsed ? '展开' : '合并' }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
              </el-icon>
            </el-button>
          </div>
        </SearchGridItem>
      </SearchGrid>
    </el-form>
  </div>
</template>
<script setup name="SearchForm">
import { Delete, Search, ArrowDown, ArrowUp } from '@element-plus/icons-vue';

const props = defineProps({
  // 搜索配置列
  columns: {
    type: Array,
    default: () => [],
  },
  // 搜索参数
  searchParam: {
    type: Object,
    default: () => ({}),
  },
  searchCol: {
    type: [Number, Object],
    default: 3,
  },
  // 搜索方法
  search: {
    type: Function,
    default: () => {},
  },
  // 重置方法
  reset: {
    type: Function,
    default: () => {},
  },
});

// 获取响应式设置
const getResponsive = item => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl,
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search[breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search[breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== 'number') {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
</script>
