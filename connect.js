#!/usr/bin/env node
'use strict';
import axios from 'axios';

const connect = async () => {
  try {
    console.log('connecting...');
    const response = await axios.get('http://10.1.1.215/camera/list', {
      headers: {
        Authorization: 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
connect();

setInterval(
  () => {
    connect();
  },
  1 * 60 * 1000,
);
