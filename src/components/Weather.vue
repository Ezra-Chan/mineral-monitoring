<template>
  <div class="weather min-w-22 min-h-12.5 flex justify-between items-center">
    <template v-if="!isError">
      <img :src="weatherInfo.icon" alt="icon" />
      <div class="flex flex-col">
        <el-text class="color-white fs-1">{{ weatherInfo.description }}</el-text>
        <el-text class="color-white fs-1">{{ weatherInfo.temp }}℃</el-text>
      </div>
    </template>
    <el-text v-else class="color-white fs-1">暂无天气信息</el-text>
  </div>
</template>

<script setup>
const props = defineProps({
  duration: {
    type: Number,
    default: 60,
  },
  city: {
    type: String,
    default: 'Nanjing',
  },
});

const weatherInfo = reactive({
  icon: null,
  temp: null,
  description: null,
});
let isError = $ref(true);

const getWeather = async () => {
  const { error, data } = await useFetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${props.city},cn&APPID=dafd5b04233280103dcd8a78bf7e6843&lang=zh_cn&units=metric`,
  );
  if (error.value) {
    isError = true;
    return;
  }
  try {
    const { main = {}, weather = [] } = JSON.parse(data.value);
    weatherInfo.icon = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
    weatherInfo.temp = main.temp.toFixed(0);
    weatherInfo.description = weather[0].description;
    isError = false;
  } catch (error) {
    isError = true;
  }
};

const { pause } = useIntervalFn(() => getWeather(), props.duration * 1000 * 60, {
  immediateCallback: true,
});

onBeforeUnmount(() => pause());
</script>

<style lang="less" scoped></style>
