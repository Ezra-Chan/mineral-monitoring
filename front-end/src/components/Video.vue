<template>
  <video ref="videoRef" class="video-js" poster="" />
</template>

<script setup>
import videojs from 'video.js';
import lang_zhcn from 'video.js/dist/lang/zh-CN.json';
import 'video.js/dist/video-js.min.css';

videojs.addLanguage('zh-CN', lang_zhcn);

videojs.Vhs.xhr.beforeRequest = function (options) {
  const headers = options.headers || {};
  headers['Authorization'] = 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=';
  console.log('headers', headers);
  options.headers = headers;
  return options;
};

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const videoRef = $ref();
const videoInst = shallowRef();

const initVideo = () => {
  videoInst.value = videojs(videoRef, {
    autoplay: 'muted',
    muted: true,
    language: 'zh-CN',
    controls: true,
    preload: 'auto',
    liveui: true,
    playbackRates: [1.0],
    sources: [
      {
        src: '/api2/live/media' + props.src + '?format=mp4',
        type: 'video/mp4',
      },
    ],
  });
};

onMounted(() => {
  initVideo();
});

onBeforeUnmount(() => {
  videoInst.value?.dispose();
});
</script>

<style lang="less" scoped>
:deep(.vjs-big-play-button) {
  display: none !important;
}
:deep(.vjs-control-bar) {
  display: none !important;
}
</style>
