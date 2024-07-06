<template>
  <div class="w-full h-full flex flex-col">
    <el-form :model="info" label-width="10rem" class="'overflow-y-auto p-r-8 w-full'">
      <el-form-item label="开启告警">
        <el-switch v-model="info.isAlert" />
      </el-form-item>
      <template v-if="info.isAlert">
        <el-form-item label="告警方式">
          <el-checkbox-group v-model="info.alertType">
            <el-checkbox value="email" name="type"> 电子邮件 </el-checkbox>
            <el-checkbox value="sms" name="type" disabled> 短信 </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="检查频次">
          <el-select v-model="info.alertFrequency" @change="info.alertTime = []">
            <el-option value="EVERY_DAY_AT" label="每天" />
            <el-option value="MONDAY_TO_FRIDAY_AT" label="工作日" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="info.alertTime" multiple>
            <el-option
              v-for="item in times"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div class="flex items-center justify-center">
      <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/global';
import { updateSystemSettingApi } from '@/api/platform';

const globalStore = useGlobalStore();
const { cloned: info } = useCloned({
  isAlert: globalStore.isAlert,
  alertType: globalStore.alertType,
  alertFrequency: globalStore.alertFrequency,
  alertTime: globalStore.alertTime,
});
let loading = $ref(false);
const times = computed(() => [
  {
    label: '0点',
    value: 'MIDNIGHT',
    disabled: info.value.alertFrequency === 'MONDAY_TO_FRIDAY_AT',
  },
  { label: '1点', value: '1AM' },
  { label: '2点', value: '2AM' },
  { label: '3点', value: '3AM' },
  { label: '4点', value: '4AM' },
  { label: '5点', value: '5AM' },
  { label: '6点', value: '6AM' },
  { label: '7点', value: '7AM' },
  { label: '8点', value: '8AM' },
  { label: '9点', value: '9AM' },
  { label: '10点', value: '10AM' },
  { label: '11点', value: '11AM' },
  { label: '12点', value: 'NOON' },
  { label: '13点', value: '1PM' },
  { label: '14点', value: '2PM' },
  { label: '15点', value: '3PM' },
  { label: '16点', value: '4PM' },
  { label: '17点', value: '5PM' },
  { label: '18点', value: '6PM' },
  { label: '19点', value: '7PM' },
  { label: '20点', value: '8PM' },
  { label: '21点', value: '9PM' },
  { label: '22点', value: '10PM' },
  { label: '23点', value: '11PM' },
]);

const onSubmit = () => {
  ElMessageBox.confirm(`修改告警配置会重启部分服务，确定吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const form = JSON.parse(JSON.stringify(info.value));
      if (form.isAlert) {
        if (!form.alertType.length || !form.alertTime.length) {
          return ElMessage.error('请选择告警方式和检查频次');
        }
        form.alertType = form.alertType.join(',');
        form.alertTime = form.alertTime.join(',');
      } else {
        form.alertType = 'email';
        form.alertTime = '8AM,8PM';
      }
      loading = true;
      try {
        await updateSystemSettingApi(form, 1);
        globalStore.getSystemConfigs();
        ElMessage.success('修改成功');
      } catch (error) {
        console.error(error);
        ElMessage.error('修改失败');
      } finally {
        loading = false;
      }
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped></style>
