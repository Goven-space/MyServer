// 定义一个对象
const obj = {
    // 默认请求成功
    DEFAULT_SUCCESS: {
      code: 10000,
      msg: ''
    },
    // 默认请求失败
    DEFAULT_ERROR: {
      code: 188,
      msg: '系统错误'
    },
    // 定义错误返回-缺少必要参数
    LACK: {
      code: 199,
      msg: '缺少必要参数'
    },
    // 定义错误返回-Token验证失败
    TOKEN_ERROR: {
      code: 401,
      msg: 'Token验证失败'
    },
    // 定义错误返回-用户名或密码错误
    LOGIN_ERROR: {
      code: 101,
      msg: '用户名或密码错误'
    },
    // 定义错误返回-许愿信息不存在
    FILE_NOT_EXSIT: {
      code: 102,
      msg: '作业文件不存在'
    },
    //上传文件失败
    SAVE_FILE_ERROR:{
      code:103,
      msg:'文件上传失败'
    },
    DELETE_FILE_ERROR:{
      code:103,
      msg:"文件删除失败"
    }
  };
  // 导出对象，给其他方法调用
  module.exports = obj;