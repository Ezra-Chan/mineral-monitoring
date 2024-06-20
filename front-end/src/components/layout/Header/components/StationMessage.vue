<template>
  <div
    id="stationMessage"
    class="inline-flex border-rdp-50 items-center justify-center cursor-pointer w-10 h-10"
    ref="iconRef"
    title="告警"
    @click="visible = !visible"
  >
    <el-badge :value="messages.length" :show-zero="false" class="!inline-flex">
      <el-icon :size="size" class="text-light">
        <Bell />
      </el-icon>
    </el-badge>
    <el-popover
      width="20rem"
      popper-class="station-message-popover"
      virtual-triggering
      :virtual-ref="iconRef"
      :visible="visible"
    >
      <div class="w-full flex flex-col gap-2" ref="popoverRef">
        <el-text class="self-start! text-5! font-bold">通知</el-text>
        <div v-if="messages.length > 0" class="flex flex-col gap-1">
          <div v-for="(item, i) in messages.slice(0, 5)" :key="i" class="">
            <div class="font-500 m-b-1">{{ item.title }}</div>
            <el-text type="info" line-clamp="2" class="text-3.25! p-x-2!">{{
              item.content
            }}</el-text>
            <el-divider v-if="i < messages.slice(0, 5).length - 1" />
          </div>
        </div>
        <el-empty
          v-else
          description="暂无通知"
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
import { getAlertListApi } from '@/api/platform';
import { defaultPage } from '@/utils/constant';
import { useUserStore } from '@/store/user';

const props = defineProps({
  size: {
    type: String,
    default: '22px',
  },
});

const router = useRouter();
const userStore = useUserStore();
const bus = useEventBus('station-message');
const { warehouses } = $(userStore);
const iconRef = ref();
const popoverRef = ref();
const messages = ref([]);
let visible = $ref(false);
let flag = 0;

bus.on(() => {
  getUnreadAlert();
});

const getUnreadAlert = async () => {
  const { data: { results = [] } = {} } = await getAlertListApi(defaultPage, {
    active: false,
    warehouse_id: warehouses.map(w => w.id),
  });
  messages.value = results.map(item => ({
    ...item,
    title: `【${item.warehouse_name}】【${item.goods_name}】存量异常`,
  }));
  flag += 1;
};

const toAlert = () => {
  visible = false;
  router.push('/alert');
};

useIntervalFn(() => getUnreadAlert(), 30 * 1000, { immediateCallback: true });

watch(messages, (newMes, oldMes) => {
  if (newMes.length > oldMes.length && flag > 1) {
    ElNotification({
      title: '通知',
      message: `有新的异常记录，请查看`,
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
.station-message-popover {
  .el-divider--horizontal {
    margin: 8px 0;
  }
}
</style>
