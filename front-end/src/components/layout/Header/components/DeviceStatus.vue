<template>
  <div
    class="inline-flex border-rdp-50 items-center justify-center cursor-pointer w-10 h-10"
    ref="iconRef"
    title="设备状态"
    @click="visible = !visible"
  >
    <el-badge :value="offline.length" :show-zero="false" class="!inline-flex">
      <svg-icon icon-class="icon-radar" :size="size" :color="color" :needHover="false" />
    </el-badge>
    <el-popover
      width="16rem"
      popper-class="device-status-popover"
      virtual-triggering
      :virtual-ref="iconRef"
      :visible="visible"
    >
      <div class="w-full flex flex-col gap-2" ref="popoverRef">
        <el-text class="self-start! text-5! font-bold">设备状态</el-text>
        <div v-if="offline.length > 0" class="flex flex-col gap-1">
          <div v-for="(item, i) in offline.slice(0, 10)" :key="i">
            <div class="flex items-center justify-between">
              <div class="font-500">{{ item.name }}({{ item.warehouse }})</div>
              <div class="text-red">{{ item.status }}</div>
            </div>
            <el-divider v-if="i < offline.slice(0, 10).length - 1" />
          </div>
        </div>
        <el-empty
          v-else
          description="暂无离线设备"
          :image-size="80"
          style="--el-empty-padding: 5px 0"
        />
        <el-divider />
        <el-text type="primary" @click="toAlert" class="cursor-pointer"> 查看全部 </el-text>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { useOfflineDevice } from '@/hooks/useOfflineDevice';

const props = defineProps({
  size: {
    type: String,
    default: '30px',
  },
  color: {
    type: String,
    default: '#fff',
  },
});

const router = useRouter();
const iconRef = ref();
const popoverRef = ref();
let visible = $ref(false);

const { offline, run, num } = useOfflineDevice();

const toAlert = () => {
  visible = false;
  router.push('/device');
};

useIntervalFn(() => run(), 60 * 1000, { immediateCallback: true });

watch(offline, (newMes, oldMes) => {
  if (newMes.length > oldMes.length && num > 1) {
    ElNotification({
      title: '通知',
      message: `有设备下线，请查看`,
      type: 'warning',
      duration: 0,
    });
  }
});

onClickOutside(
  iconRef,
  () => {
    visible = false;
  },
  {
    ignore: [popoverRef],
  },
);
</script>

<style lang="less">
.device-status-popover {
  .el-divider--horizontal {
    margin: 8px 0;
  }
}
</style>
