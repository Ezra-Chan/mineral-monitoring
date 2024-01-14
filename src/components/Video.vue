<template>
  <video ref="videoRef" muted controls poster="" />
</template>

<script setup>
import Hls from 'hls.js';
import { getM3u8Url } from '@/api/camera';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  header: Object,
});

const apiContextPath = import.meta.env.DEV ? '/api2' : 'http://10.1.1.215';

const videoRef = $ref();
let hlsRef = $ref();
let videoLive = $ref({});

const initMpegts = url => {
  videoLive = videoRef;
  if (Hls.isSupported()) {
    const hls = new Hls({
      xhrSetup: (xhr, url) => {
        xhr.withCredentials = true;
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Authorization', 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=');
      },
    });
    hlsRef = hls;
    hls.loadSource(url);
    hls.attachMedia(videoLive);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoLive.play();
    });
  } else if (videoLive.canPlayType('application/vnd.apple.mpegurl')) {
    videoLive.src = url;
  }
};

const mpegts_destroy = () => {
  hlsRef && hlsRef.destroy();
};

const getM3u8UrlApi = async () => {
  const { data = {} } = await getM3u8Url(props.src);
  initMpegts(apiContextPath + data.stream_url);
};

onMounted(() => {
  getM3u8UrlApi();
});

onBeforeUnmount(() => {
  mpegts_destroy();
});
</script>

<style lang="less" scoped></style>
