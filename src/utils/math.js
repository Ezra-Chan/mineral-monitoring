// 保留两位小数
export const toFixed2 = (num, defaultValue = 0) => Math.round((num || defaultValue) * 100) / 100;
