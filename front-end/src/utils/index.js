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
