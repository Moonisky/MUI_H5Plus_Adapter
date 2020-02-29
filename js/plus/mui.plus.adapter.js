/**
 * MUI H5+ 适配插件
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  // 当 mui 的 ready 事件触发时，手动触发 plusReady 方法
  $.ready(function() {
    $.trigger(document, 'plusready');
  });

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者
  window.plus = {
    
  }
})(mui, document, window);
