/**
 *
 * @param {*} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns
 */
export const cameraLoginParams = params => [
  '/api/v3/ac-backend/users/login',
  { ...params, clientId: '5' },
];

export const cameraDomians = '/api/v3/ac-backend/domains';
