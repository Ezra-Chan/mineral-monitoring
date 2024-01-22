<template>
  <video ref="videoRef" class="video-js" poster="" />
</template>

<script setup>
import videojs from 'video.js';
import lang_zhcn from 'video.js/dist/lang/zh-CN.json';
import { getM3u8Url } from '@/api/camera';
import 'video.js/dist/video-js.min.css';

videojs.addLanguage('zh-CN', lang_zhcn);

// videojs.Vhs.xhr.beforeRequest = function (options) {
//   const headers = options.headers || {};
//   headers['Authorization'] = 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=';
//   console.log(headers);
//   options.headers = headers;
//   return options;
// };

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  header: Object,
});

const apiContextPath = import.meta.env.DEV ? '/api2' : 'http://root:Hhszcy@12345@10.1.1.215';

const videoRef = $ref();
const videoInst = shallowRef();

const initVideo = () => {
  videoInst.value = videojs(videoRef, {
    autoplay: true,
    muted: true,
    language: 'zh-CN',
    controls: true,
    preload: 'auto',
    liveui: true,
    playbackRates: [1.0],
    sources: [
      {
        src: apiContextPath + '/live/media' + props.src + '?format=mp4',
        type: 'video/mp4',
      },
    ],
  });
};
// const playerOptions = reactive({
//   playbackRates: [1.0],
//   autoplay: true,
//   muted: true,
//   loop: false,
//   preload: 'auto',
//   poster: '',
//   volume: 0,
//   language: 'zh-CN',
//   fluid: true,
//   hls: true,
//   sources: [
//     {
//       type: 'application/x-mpegURL',
//       src: apiContextPath + '/live/media' + props.src + '?format=mp4',
//     },
//   ],
//   controlBar: {
//     timeDivider: true,
//     durationDisplay: true,
//     remainingTimeDisplay: false,
//     fullscreenToggle: true,
//   },
//   crossorigin: 'use-credentials',
// });

onMounted(() => {
  initVideo();
});

onBeforeUnmount(() => {});
</script>

<style lang="less" scoped>
:deep(.vjs-big-play-button) {
  display: none !important;
}
</style>
