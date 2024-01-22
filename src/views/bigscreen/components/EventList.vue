<template>
  <div
    class="event-list p-l-3 flex flex-col gap-2"
    v-loading="loading"
    element-loading-background="#0004"
  >
    <el-text class="w-full flex justify-around" v-for="event in eventList" :key="event.timestamp">
      <el-text>{{ event.time }}</el-text>
      <el-text>{{ event.type }}</el-text>
    </el-text>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { getEvents } from '@/api/camera';

const eventList = ref([]);
let loading = $ref(false);
const eventTypes = ['车辆越线', '非机动车', '人员越线'];

const getEventsList = async () => {
  loading = true;
  try {
    const { data = {} } = await getEvents();
    eventList.value = (data.events || []).map(ev => ({
      time: dayjs(ev.timestamp).format('YYYY-MM-DD hh:mm:ss'),
      type: eventTypes[Math.floor(Math.random() * 3)],
    }));
  } catch (error) {
  } finally {
    loading = false;
  }
};

onMounted(() => {
  getEventsList();
  setInterval(() => {
    eventList.value.unshift({
      time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      type: eventTypes[Math.floor(Math.random() * 3)],
    });
  }, 60 * 1000);
});
</script>
