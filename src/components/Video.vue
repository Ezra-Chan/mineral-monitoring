<template>
  <video ref="video" muted controls poster="" />
</template>

<script setup>
import Hls from 'hls.js';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  header: Object,
});

const video = ref();
let hlsRef = $ref();
let videoLive = $ref({});

const initMpegts = url => {
  videoLive = video.value;
  if (Hls.isSupported()) {
    hlsRef = new Hls();
    hlsRef.loadSource(url);
    hlsRef.attachMedia(videoLive);
    hlsRef.on(Hls.Events.MANIFEST_PARSED, () => {
      hlsRef.config.xhrSetup = (xhr, url) => {
        xhr.open('GET', url, true);
        Object.keys(props.header).forEach(key => {
          xhr.setRequestHeader(key, props.header[key]);
        });
      };
      videoLive.play();
    });
  } else if (videoLive.canPlayType('application/vnd.apple.mpegurl')) {
    videoLive.src = url;
  }
};

const mpegts_destroy = () => {
  hlsRef && hlsRef.destroy();
};

onMounted(() => {
  initMpegts(props.src);
});

onBeforeUnmount(() => {
  mpegts_destroy();
});
</script>

<style lang="less" scoped></style>
