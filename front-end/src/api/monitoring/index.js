import request from './request';

export const getAllEvents = params => request.post('/event/list', params);
