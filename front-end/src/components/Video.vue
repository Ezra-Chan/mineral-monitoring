<template>
  <video ref="videoRef" class="video-js" poster="" />
</template>

<script setup>
import dayjs from 'dayjs';
import videojs from 'video.js';
import lang_zhcn from 'video.js/dist/lang/zh-CN.json';
import 'video.js/dist/video-js.min.css';
import { useUserStore } from '@/store/user';
import { handleCameraPath1 } from '@/utils';

videojs.addLanguage('zh-CN', lang_zhcn);

// videojs.Vhs.xhr.beforeRequest = function (options) {
//   const headers = options.headers || {};
//   headers['Authorization'] = 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=';
//   console.log('headers', headers);
//   options.headers = headers;
//   return options;
// };

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(['update']);

const videoRef = $ref();
const videoInst = shallowRef();
const visibility = useDocumentVisibility();
const time = $ref(dayjs().valueOf());
const userStore = useUserStore();
const { companyInfo = {}, monitorInfo: { domain, token } = {} } = userStore;
const ip = domain ? 'https:' + domain : companyInfo.monitor_ip + '/';

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
        src: ip + 'live/media' + props.src + '?format=mp4' + (token ? `&authToken=${token}` : ''),
        type: 'video/mp4',
      },
    ],
  });
  videoInst.value.on('error', e => {
    if (videoInst.value.cache_.src.includes(props.src)) {
      videoInst.value.src({
        src:
          ip +
          'live/media' +
          handleCameraPath1(props.src) +
          '?format=mp4' +
          (token ? `&authToken=${token}` : ''),
        type: 'video/mp4',
      });
      videoInst.value.load();
    }
  });
  videoInst.value.on('timeupdate', () => {
    const videoPlayTime = videoInst.value.currentTime();
    const current = dayjs().valueOf();
    if ((current - time) / 1000 - videoPlayTime > 5 * 60) {
      emits('update', props.src);
    }
  });
};

watch(visibility, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    emits('update', props.src);
  }
});

onMounted(() => {
  initVideo();
});

onBeforeUnmount(() => {
  videoInst.value?.dispose();
});
</script>

<style lang="less">
.video-js {
  .vjs-big-play-button,
  .vjs-control-bar,
  .vjs-poster {
    display: none !important;
  }
}
</style>
