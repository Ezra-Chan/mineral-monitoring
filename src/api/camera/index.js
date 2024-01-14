import request from './request';

export const getCameraList = () => request.get('/camera/list');

export const getEvents = () => request.get('/archive/events/detectors/future/past');

export const getM3u8Url = id => request.get(`/live/media/${id}?format=hls&keep_alive=60`);
