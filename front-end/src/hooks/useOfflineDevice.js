import { onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { getDevicesByWarehouseId, getDeviceConnectStatus } from '@/api/radar';
import { getDeviceList } from '@/api/platform';
import { getCameraList } from '@/api/camera';
import { defaultPage } from '@/utils/constant';

const onlineStatus = ['已连接', '在线'];

const getLidarApi = async warehouse => {
  try {
    const { data = [] } = await getDevicesByWarehouseId(warehouse.kx_warehouse_id);
    const status = await Promise.all(data.map(item => getDeviceConnectStatus(item.devId)));
    return data.map((item, index) => ({
      ...item,
      name: warehouse.name,
      alias: item.alias || item.devId,
      status: status[index]?.data?.connectStatusDesc,
    }));
  } catch (error) {
    console.error(name, error);
    return [];
  }
};

const getCameraApi = async warehouse => {
  try {
    const [
      {
        data: { results = [] },
      },
      {
        data: { cameras = [] },
      },
    ] = await Promise.all([
      getDeviceList(defaultPage, {
        company_id: warehouse.company_id,
      }),
      getCameraList(),
    ]);

    const cameraMap = cameras.reduce((acc, cur) => {
      acc[cur.displayId] = cur;
      return acc;
    }, {});

    return results
      .filter(item => item.warehouse_id === warehouse.id)
      .map(item => {
        const camera = cameraMap[item.monitor_device_id];
        return {
          ...item,
          name: warehouse.name,
          alias: item.monitor_device_name,
          status: camera?.isActivated,
        };
      });
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * 获取离线设备
 */
export const useOfflineDevice = () => {
  const userStore = useUserStore();
  const { warehouses } = $(userStore);
  let offline = $ref([]);
  let num = $ref(0);

  const getDeviceByWarehouse = async warehouse => {
    const [lidar, camera] = await Promise.all([getLidarApi(warehouse), getCameraApi(warehouse)]);
    return [...lidar, ...camera];
  };

  const getOfflineDevices = async () => {
    const devices = await Promise.all(warehouses.map(item => getDeviceByWarehouse(item)));
    const dev = [];
    devices.forEach(item => dev.push(...item));
    const off = [];
    dev.forEach(item => {
      if (!onlineStatus.includes(item.status)) {
        off.push({
          warehouse: item.name,
          name: item.alias,
          status: '离线',
        });
      }
    });
    offline = off;
    num += 1;
  };

  onMounted(() => {
    getOfflineDevices();
  });

  return {
    offline,
    run: getOfflineDevices,
    num,
  };
};
