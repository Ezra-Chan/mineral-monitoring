<template>
  <div
    id="stationMessage"
    class="inline-flex border-rdp-50 items-center justify-center cursor-pointer w-10 h-10"
    ref="iconRef"
    title="告警"
  >
    <el-badge :value="5" class="!inline-flex">
      <el-icon size="22px" class="text-light">
        <Bell />
      </el-icon>
    </el-badge>
  </div>
  <el-popover
    width="20rem"
    trigger="click"
    popper-class="station-message-popover"
    virtual-triggering
    ref="popoverRef"
    :virtual-ref="iconRef"
  >
    test
  </el-popover>
</template>

<script setup>
const iconRef = ref();
const popoverRef = ref();

onClickOutside(iconRef, () => {
  unref(popoverRef).popperRef?.delayHide?.();
});
</script>

<style lang="less"></style>
