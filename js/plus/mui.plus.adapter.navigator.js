/**
 * MUI H5+ 适配插件 - Navigator
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
   * navigator用于管理浏览器运行环境信息
   */
  window.plus.navigator = {
    /**
     * 关闭应用启动界面
     */
    closeSplashscreen: function() {
      console.warn("Web 不存在应用启动页面，无法关闭");
    },
    /**
     * 设置系统状态栏背景颜色
     * @param {String} color 背景颜色值
     */
    setStatusBarBackground: function(color) {
      console.warn("Web 不支持设置系统状态栏的背景颜色");
    }
  }
})(mui, document, window);
