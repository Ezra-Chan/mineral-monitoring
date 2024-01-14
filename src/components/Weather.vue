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
  useLocation: {
    type: Boolean,
    default: false,
  },
});

const weatherInfo = reactive({
  icon: null,
  temp: null,
  description: null,
});
let isError = $ref(true);

const getWeather = async location => {
  const param = location
    ? `lat=${location.latitude}&lon=${location.longitude}`
    : `q=${props.city},cn`;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?APPID=dafd5b04233280103dcd8a78bf7e6843&lang=zh_cn&units=metric&${param}`;
  const { error, data } = await useFetch(weatherUrl);
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

const getLocation = () => {
  const location = localStorage.getItem('geoLocation');
  if (location) {
    getWeather(JSON.parse(location));
  } else {
    getWeather();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          getWeather({ latitude, longitude });
          localStorage.setItem('geoLocation', JSON.stringify({ latitude, longitude }));
        },
        err => {
          console.log(err);
        },
      );
    }
  }
};

const { pause } = useIntervalFn(
  () => (props.useLocation ? getLocation() : getWeather()),
  props.duration * 1000 * 60,
  {
    immediateCallback: true,
  },
);

onBeforeUnmount(() => pause());
</script>
