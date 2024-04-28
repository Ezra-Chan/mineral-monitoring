export const phoneValidate = (_, value, callback) => {
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

export const emailValidate = (_, value, callback) => {
  if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    callback(new Error('请输入正确的邮箱'));
  } else {
    callback();
  }
};

export const passwordValidate = (_, value, callback) => {
  // 密码长度要求6-20位字符，必须包含数字和字母
  if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(value)) {
    callback(new Error('密码长度要求6-20位字符，必须包含数字和字母'));
  } else {
    callback();
  }
};
