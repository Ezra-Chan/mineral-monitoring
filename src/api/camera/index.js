import request from './request';

export const getCameraList = () => request.get('/camera/list');

export const getEvents = () => request.get('/archive/events/detectors/future/past');
