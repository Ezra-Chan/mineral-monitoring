<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getCameraApi" :pagination="false">
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="addCamera"> 新增 </el-button>
      </template>
      <template #operation="scope">
        <el-button
          v-auth="'preview'"
          type="primary"
          link
          :icon="View"
          :disabled="!scope.row.status || !scope.row.accessPoint"
          @click="viewCamera(scope.row)"
        >
          查看画面
        </el-button>
        <el-button
          v-auth="'delete'"
          type="danger"
          link
          :icon="Delete"
          @click="unbindCamera(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <el-dialog
      v-model="dialogVisible"
      title="新增设备"
      width="500"
      class="device-dialog"
      :before-close="handleClose"
    >
      <el-select v-model="deviceSelected" filterable multiple>
        <el-option
          v-for="item in leftDevices"
          :key="item.displayId"
          :label="item.displayName"
          :value="item.displayId"
        />
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="bindDevices"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="videoVisible"
      title="查看画面"
      destroy-on-close
      width="800"
      class="video-dialog"
      :before-close="handleCloseVideo"
    >
      <VideoPlayer :src="videoSrc" />
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, View, Delete } from '@element-plus/icons-vue';
import { getDeviceList, addDevice, deleteDevice } from '@/api/platform';
import { getCameraList } from '@/api/camera';
import { CameraStatus } from '@/utils/constant';
import VideoPlayer from '@/components/Video.vue';

const props = defineProps({
  warehouse: {
    type: Object,
    default: () => ({}),
  },
});

const proTable = ref();
let videoVisible = $ref(false);
let videoSrc = $ref();
let dialogVisible = $ref(false);
let deviceSelected = $ref([]);
let bindedDevices = $ref([]);
let allDevices = $ref([]);
let leftDevices = $ref([]);
const columns = reactive([
  {
    prop: 'monitor_device_id',
    label: '设备ID',
    minWidth: 80,
  },
  {
    prop: 'monitor_device_name',
    label: '设备名称',
    minWidth: 150,
  },
  {
    prop: 'status',
    label: '设备状态',
    minWidth: 100,
    enum: CameraStatus,
  },
  {
    prop: 'accessPoint',
    label: '访问路径',
    minWidth: 350,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getCameraApi = async () => {
  try {
    const [
      {
        data: { results = [] },
      },
      {
        data: { cameras = [] },
      },
    ] = await Promise.all([
      getDeviceList(
        {
          page: 1,
          per_page: 999999,
        },
        {
          company_id: props.warehouse.company_id,
        },
      ),
      getCameraList(),
    ]);
    bindedDevices = results;
    allDevices = cameras;

    const cameraMap = cameras.reduce((acc, cur) => {
      acc[cur.displayId] = cur;
      return acc;
    }, {});

    const data = results
      .filter(item => item.warehouse_id === props.warehouse.id)
      .map(item => {
        const camera = cameraMap[item.monitor_device_id];
        return {
          ...item,
          status: camera?.isActivated,
          accessPoint: camera?.accessPoint,
        };
      });

    return { data };
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  }
};

const handleClose = () => {
  dialogVisible = false;
  deviceSelected = [];
};

const addCamera = () => {
  dialogVisible = true;
  leftDevices = allDevices.filter(
    item => !bindedDevices.some(bind => bind.monitor_device_id === item.displayId),
  );
};

const bindDevices = async () => {
  try {
    await addDevice(
      deviceSelected.map(item => ({
        company_id: props.warehouse.company_id,
        warehouse_id: props.warehouse.id,
        warehouse_name: props.warehouse.name,
        monitor_device_id: item,
        monitor_device_name: allDevices.find(d => d.displayId === item)?.displayName,
      })),
    );
    ElMessage.success('绑定成功');
    handleClose();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('绑定失败');
  }
};

const unbindCamera = async ({ id, monitor_device_name }) => {
  ElMessageBox.confirm(`确定要解绑设备【${monitor_device_name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDevice(id);
        ElMessage.success('解绑成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('解绑失败');
      }
    })
    .catch(() => {});
};

const handleCloseVideo = () => {
  videoVisible = false;
  videoSrc = '';
};

const viewCamera = ({ accessPoint }) => {
  videoVisible = true;
  videoSrc = accessPoint.replace('hosts', '').replace(/0$/, '1');
};
</script>

<style lang="less" scoped>
:deep(.video-dialog .el-dialog__body) {
  height: 500px;

  .video-js {
    width: 100%;
    height: 100%;
  }
}

:deep(.device-dialog .el-dialog__body) {
  min-height: 100px;
}
</style>
