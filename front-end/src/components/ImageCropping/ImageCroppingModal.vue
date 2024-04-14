<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    :modal-class="modalClass + ' image-cropping-modal'"
    :close-on-click-modal="false"
    destroy-on-close
    append-to-body
    :before-close="closeDialog"
  >
    <image-cropping :img-src="imgSrc" :output-type="outputType" @upload="upload" />
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modalClass: String,
  title: {
    type: String,
    default: '图片裁剪',
  },
  visible: {
    type: Boolean,
    default: false,
  },
  imgSrc: [String, Blob, File],
  outputType: String,
});

const emit = defineEmits(['close', 'upload']);

let dialogVisible = $ref(false);

const closeDialog = () => {
  emit('close');
};

const upload = data => {
  emit('upload', data);
};

watchEffect(() => {
  dialogVisible = props.visible;
});
</script>
