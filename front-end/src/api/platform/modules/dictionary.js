import request from '../request';
import { defaultPage } from '@/utils/constant';

// 获取字典列表
export const getDictionaryListApi = (params, data) =>
  request.post('/api/v1/dictlist', data, { params });

// 根据字典类别获取字典列表
export const getDictByTypeApi = type =>
  request.post('/api/v1/dictlist', { name_en: type }, { params: defaultPage });

// 创建字典
export const createDictionaryApi = data => request.post('/api/v1/dict', data);

// 删除字典
export const deleteDictionaryApi = id => request.delete(`/api/v1/dict/${id}`);

// 更新字典
export const updateDictionaryApi = (id, data) => request.put(`/api/v1/dict/${id}`, data);

// 获取字典详情
export const getDictionaryApi = id => request.get(`/api/v1/dict/${id}`);

//获取字典类别
export const getDictTypeApi = () => request.get('/api/v1/dict/type');

// 添加字典类别
export const createDictTypeApi = data => request.post('/api/v1/dict/type', data);

// 删除字典类别
export const deleteDictTypeApi = id => request.delete(`/api/v1/dict_type/${id}`);

// 更新字典类别
export const updateDictTypeApi = (id, data) => request.put(`/api/v1/dict_type/${id}`, data);
