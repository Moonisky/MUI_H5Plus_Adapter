/**
 * MUI H5+ 适配插件 - IO
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者
  
  /**
   * IO模块管理本地文件系统，用于对文件系统的目录浏览、文件的读取、文件的写入等操作。
   */
  window.plus.io = {
    /**
     * 请求本地文件系统对象
     * @param {Object} type 本地文件系统常量
     * @param {Object} succesCB 请求文件系统成功的回调
     * @param {Object} errorCB 请求文件系统失败的回调
     */
     requestFileSystem: function(type, succesCB, errorCB) {
       console.warn("暂不支持 Web 请求本地文件系统对象")
       if (errorCB) {
         errorCB({
           message: "暂不支持 Web 请求本地文件系统对象"
         })
       }
     }
  }
})(mui, document, window);
