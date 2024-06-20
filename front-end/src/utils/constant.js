export const radarChartTypes = [
  {
    label: '货物堆形',
    value: 'findWarehouseGoodsPointCloudHistogram',
  },
  {
    label: '货物点云',
    value: 'findHandlePointCloudDataHistory',
  },
  {
    label: '仓内全景',
    value: 'findPointCloudDataHistory',
  },
];

export const colors = ['rgb(101,214,251)', 'rgb(30, 200, 90)', 'rgb(50,117,246)'];

export const barColors = ['rgb(217,207,152)', 'rgb(10, 240, 60, 0.5)', 'rgb(50,117,246)'];

export const gradientColors = [
  ['rgba(14,188,225,0.7)', 'rgba(14,108,105,0.2)'],
  ['rgba(128, 255, 165, 0.8)', 'rgba(128, 255, 165, 0.1)'],
  ['rgba(55, 162, 255, 0.8)', 'rgba(55, 162, 255, 0.1)'],
  ['rgba(30, 200, 90, 0.8)', 'rgba(30, 200, 90, 0.2)'],
];
export const barGradientColors = [
  ['rgba(20,239,209, 1)', 'rgb(41,149,248, 1)'],
  ['rgba(14,188,225,0.7)', 'rgba(14,108,105,0.5)'],
  ['rgba(128, 255, 165, 0.8)', 'rgba(128, 255, 165, 0.1)'],
  ['rgba(55, 162, 255, 0.8)', 'rgba(55, 162, 255, 0.1)'],
  ['rgba(30, 200, 90, 0.8)', 'rgba(30, 200, 90, 0.2)'],
];

export const CompanyStatus = [
  {
    label: '营业中',
    value: 1,
    tagType: 'success',
  },
  {
    label: '已注销',
    value: 0,
    tagType: 'danger',
  },
];

export const CameraStatus = [
  {
    label: '在线',
    value: true,
    tagType: 'success',
  },
  {
    label: '离线',
    value: false,
    tagType: 'danger',
  },
];

export const WarehouseStatus = [
  {
    label: '未启用',
    value: '301',
    tagType: 'info',
  },
  {
    label: '使用中',
    value: '302',
    tagType: 'success',
  },
  {
    label: '已停用',
    value: '303',
    tagType: 'danger',
  },
];

export const Gender = [
  {
    label: '男',
    value: 1,
    tagType: 'success',
  },
  {
    label: '女',
    value: 0,
    tagType: 'danger',
  },
];

export const IE_TYPE = [
  {
    label: '入库',
    value: 'I',
    tagType: 'success',
  },
  {
    label: '出库',
    value: 'E',
    tagType: 'danger',
  },
];

export const ALERT_STATUS = [
  {
    label: '已读',
    value: true,
    tagType: 'success',
  },
  {
    label: '未读',
    value: false,
    tagType: 'danger',
  },
];

export const EMAIL_SUFFIX = [
  '@qq.com',
  '@163.com',
  '@gmail.com',
  '@126.com',
  '@sina.com',
  '@foxmail.com',
];

export const ROLE_PERMISSIONS = [
  {
    id: '1',
    path: '/home',
    name: 'home',
    component: '/home/Home',
    title: '首页',
    meta: {
      icon: 'HomeFilled',
      title: '首页',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: true,
      isKeepAlive: true,
    },
  },
  {
    id: '2',
    path: '/bigscreen',
    name: 'bigscreen',
    component: '/bigscreen/Bigscreen',
    title: '大屏',
    meta: {
      icon: 'Histogram',
      title: '大屏',
      isLink: '',
      isHide: false,
      isFull: true,
      isAffix: false,
      isKeepAlive: false,
    },
  },
  {
    id: '3',
    path: '/company',
    name: 'company',
    component: '/company/Company',
    title: '公司管理',
    meta: {
      icon: 'OfficeBuilding',
      title: '公司管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '3-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '3-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '3-3',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '3-4',
        title: '删除',
        name: 'delete',
      },
    ],
  },
  {
    id: '4',
    path: '/company/user',
    name: 'user',
    title: '用户管理',
    component: '/company/User',
    meta: {
      icon: 'User',
      title: '用户管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '4-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '4-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '4-3',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '4-4',
        title: '删除',
        name: 'delete',
      },
      {
        id: '4-5',
        title: '重置密码',
        name: 'resetPwd',
      },
    ],
  },
  {
    id: '5',
    path: '/role',
    name: 'role',
    component: '/role/Role',
    title: '角色管理',
    meta: {
      icon: 'Avatar',
      title: '角色管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '5-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '5-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '5-3',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '5-4',
        title: '删除',
        name: 'delete',
      },
    ],
  },
  {
    id: '6',
    path: '/warehouse',
    name: 'warehouse',
    component: '/warehouse/Warehouse',
    title: '仓库管理',
    meta: {
      icon: 'Shop',
      title: '仓库管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '6-1',
        title: '同步',
        name: 'sync',
      },
      {
        id: '6-2',
        title: '查看',
        name: 'view',
      },
      {
        id: '6-3',
        title: '新增',
        name: 'add',
      },
      {
        id: '6-4',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '6-5',
        title: '删除',
        name: 'delete',
      },
      {
        id: '6-6',
        title: '查看扫描计划',
        name: 'scanView',
      },
      {
        id: '6-7',
        title: '修改扫描计划',
        name: 'scanEdit',
      },
    ],
  },
  {
    id: '7',
    path: '/manifest',
    name: 'manifest',
    component: '/manifest/Manifest',
    title: '货物管理',
    meta: {
      icon: 'List',
      title: '货物管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '7-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '7-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '7-3',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '7-4',
        title: '删除',
        name: 'delete',
      },
    ],
  },
  {
    id: '8',
    path: '/device',
    name: 'device',
    component: '/device/Device',
    title: '设备管理',
    meta: {
      icon: 'Camera',
      title: '设备管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '8-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '8-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '8-3',
        title: '删除',
        name: 'delete',
      },
      {
        id: '8-4',
        title: '查看画面',
        name: 'preview',
      },
    ],
  },
  {
    id: '9',
    path: '/dictionary',
    name: 'dictionary',
    component: '/dictionary/Dictionary',
    title: '字典管理',
    meta: {
      icon: 'Reading',
      title: '字典管理',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '9-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '9-2',
        title: '新增',
        name: 'add',
      },
      {
        id: '9-3',
        title: '编辑',
        name: 'edit',
      },
      {
        id: '9-4',
        title: '删除',
        name: 'delete',
      },
      {
        id: '9-5',
        title: '新增类别',
        name: 'add',
      },
      {
        id: '9-6',
        title: '编辑类别',
        name: 'edit',
      },
      {
        id: '9-7',
        title: '删除类别',
        name: 'delete',
      },
    ],
  },
  {
    id: '10',
    path: '/self',
    name: 'self',
    component: '/self/Self',
    title: '个人中心',
    meta: {
      icon: 'UserFilled',
      title: '个人中心',
      isLink: '',
      isHide: true,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
  },
  {
    id: '11',
    path: '/alert',
    name: 'alert',
    component: '/alert/Alert',
    title: '告警信息',
    meta: {
      icon: 'Bell',
      title: '告警信息',
      isLink: '',
      isHide: true,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    buttons: [
      {
        id: '11-1',
        title: '查看',
        name: 'view',
      },
      {
        id: '11-2',
        title: '已读',
        name: 'read',
      },
    ],
  },
];

export const defaultPwd = '3er4#ER$';

export const SYSTEM_ROLES_MAP = {
  SUPER_ADMIN: 1,
  COMPANY_ADMIN: 2,
  COMPANY_USER: 3,
  WAREHOUSE_ADMIN: 4,
  WAREHOUSE_USER: 5,
  BIGSCREEN_USER: 6,
};

export const SYSTEM_ROLES = Object.values(SYSTEM_ROLES_MAP);

export const defaultPage = {
  page: 1,
  per_page: 999999,
};
