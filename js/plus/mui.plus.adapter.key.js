/**
 * MUI H5+ 适配插件 - Key
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
  window.plus = {
    /**
     * Key管理设备按键事件
     */
    key: {
      /**
       * 添加按键事件监听器
       * @param {String} keyevent 要监听的按键事件类型
       * @param {Function} listener 监听按键事件发生时调用的回调函数
       * @param {Boolean} capture 捕获按键事件流顺序
       */
      addEventListener: function(keyevent, listener, capture) {
        window.addEventListener(
          keyevent,
          function(event) {
            if (listener) {
              listener(event);
            }
          },
          capture
        );
      },
      /**
       * 隐藏软键盘
       * @description 此实现参考 Uni-App H5 hide-keyboard.js 的实现
       */
      hideSoftKeybord: function() {
        var activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "INPUT")
        ) {
          activeElement.blur();
        }
      },
      /**
       * 设置辅助输入类型
       * @param {Object} type 辅助输入类型
       * @description 借助 input 控件的 autocomplete 来模拟
       */
      setAssistantType: function(type) {
        // 设置 input 的 list 属性
        var activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "INPUT") {
          var autocomplete = "on";
          switch (type) {
            case "nick":
              autocomplete = "nickname";
              break;
            case "address":
              autocomplete = "street-address";
              break;
            case "tel":
              autocomplete = "tel";
              break;
            case "email":
              autocomplete = "email";
              break;
            case "company":
              break;
            case "tax":
              break;
            case "id":
              break;
            default:
              break;
          }
          activeElement.setAttribute("autocomplete", autocomplete);
        }
      },
      /**
       * 显示软键盘
       * @description 原实现中，iOS 需获取DOM中的input元素并调用其focus方法获取焦点才能主动弹出系统软键盘，而 Web 也是如此实现，因此直接标记为不支持
       */
      showSoftKeybord: function() {
        console.warn("Web 端不支持 plus.key.showSoftKeybord 显示软键盘");
      },
      /**
       * 移除按键事件监听器
       * @param {Object} event 要移除的事件类型
       * @param {Object} listener 要移除回调函数对象
       */
      removeEventListener: function(event, listener) {
        window.removeEventListener(event, listener);
      }
    }
  };
})(mui, document, window);
