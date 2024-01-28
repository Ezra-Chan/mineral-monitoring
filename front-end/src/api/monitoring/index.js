import request from './request';

export const getAllEvents = () => request.get('/event');
