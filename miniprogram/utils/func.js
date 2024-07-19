export const getNonFuncProperties = obj => {
  const arr = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] !== "function") {
      arr.push(key);
    }
  }
  return arr;
};

export const updateDictEntry = (dict, name, entryKey, entryValue) => {
  const existingEntry = dict[name][entryKey];
  if (existingEntry === undefined) {
    dict[name][entryKey] = entryValue;
  } else if (Array.isArray(existingEntry)) {
    existingEntry.push(entryValue);
  } else {
    dict[name][entryKey] = [existingEntry, entryValue];
  }
  // 如果dict[name][entryKey]是数组，需要去重
  if (Array.isArray(dict[name][entryKey])) {
    dict[name][entryKey] = [...new Set(dict[name][entryKey])];
    // 如果dict[name][entryKey]长度为1，则将其转换为字符串
    if (dict[name][entryKey].length === 1) {
      dict[name][entryKey] = dict[name][entryKey][0];
    }
  }
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
