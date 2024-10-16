import { EMAIL_SUFFIX } from './constant';

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide === true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList) {
  let newMenuList = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList) {
  let newMenuList = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [
    item,
    ...(item.children ? getFlatMenuList(item.children) : []),
  ]);
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList, parent = [], result = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 使用递归处理路由菜单 path，生成一维数组 (第一版本地路由鉴权会用到，该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @returns {Array}
 */
export function getMenuListPath(menuList, menuPathArr = []) {
  for (const item of menuList) {
    if (typeof item === 'object' && item.path) menuPathArr.push(item.path);
    if (item.children?.length) getMenuListPath(item.children, menuPathArr);
  }
  return menuPathArr;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop) {
  const propArr = prop.split('.');
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue, enumData, fieldNames, type) {
  const value = fieldNames?.value ?? 'value';
  const label = fieldNames?.label ?? 'label';
  const children = fieldNames?.children ?? 'children';
  let filterData = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == 'tag') {
    return filterData?.tagType ? filterData.tagType : '';
  } else {
    return filterData ? filterData[label] : '--';
  }
}

/**
 * @description:  是否为数组
 */
export function isArray(val) {
  return val && Array.isArray(val);
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData, callValue, value, children) {
  return enumData.reduce((accumulator, current) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
  return callValue ?? '--';
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row, prop) {
  if (!prop.includes('.')) return row[prop] ?? '--';
  prop.split('.').forEach(item => (row = row[item] ?? '--'));
  return row;
}

/**
 * 从obj中拿出keys里的所有属性，返回一个新对象
 * @param {Object} obj 原始对象
 * @param {Array} keys 需要取出的key值集合
 * @returns Object 新对象
 */
export const objPick = (obj = {}, keys = []) => {
  return keys.reduce((acc, cur) => {
    if (obj && obj.hasOwnProperty(cur)) {
      acc[cur] = obj[cur];
    }
    return acc;
  }, {});
};

// 从obj中剔除掉keys数组里的元素对应的属性,返回一个新对象
export const objOmit = (obj = {}, keys = []) => {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((acc, cur) => {
      acc[cur] = obj[cur];
      return acc;
    }, {});
};

/**
 * 判断queryStr内是否含有@符号，且@后有任意字符，如果有则返回[]，否则返回EMAIL_SUFFIX中符合的邮箱后缀
 * @param queryStr
 * @param cb
 */
export const querySearch = (queryStr, cb) => {
  const reg = /@.+/;
  if (reg.test(queryStr)) {
    cb([]);
  } else {
    if (queryStr.endsWith('@')) {
      queryStr = queryStr.slice(0, -1);
    }
    const results = EMAIL_SUFFIX.map(item => ({
      value: queryStr + item,
    }));
    cb(results);
  }
};

// 获取权限树勾选的节点，将未勾选的按钮剔除
export const getCheckedNodes = (selectedNodes = []) => {
  const nodes = JSON.parse(JSON.stringify(selectedNodes));
  nodes.forEach(node => {
    if (node.path && node.buttons) {
      node.buttons = node.buttons.filter(button => nodes.find(n => n.id === button.id));
    }
  });
  return nodes.filter(node => node.path);
};

// 将保存的权限回显到树
export const setCheckedNodes = (selectedNodes = []) => {
  const selectedKeys = [];
  selectedNodes.forEach(node => {
    if (node.buttons) {
      node.buttons.forEach(button => {
        selectedKeys.push(button.id);
      });
    } else {
      selectedKeys.push(node.id);
    }
  });
  return selectedKeys;
};

// 将保存的权限格式化成按钮和菜单
export const formatMenuAndButton = (menus = []) => {
  const buttons = {};
  menus.forEach(node => {
    if (node.buttons) {
      buttons[node.name] = node.buttons.map(button => button.name);
      delete node.buttons;
    }
  });
  return { buttons, menus };
};

export const handleCameraPath = path => path.replace('hosts', '').replace(/0$/, '1');

export const handleCameraPath1 = path => path.replace('hosts', '').replace(/1$/, '0');
