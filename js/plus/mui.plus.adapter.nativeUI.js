/**
 * MUI H5+ 适配插件 - NativeUI
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  $.ready(function() {
    // 定义 Mask 样式
    var styleElement = document.createElement("style");
    var maskHTML =
      ".mui-show-loading { position: fixed; padding: 5px; width: 120px;  min-height: 120px;  top: 45%;  left: 50%;  margin-left: -60px;  background: rgba(0, 0, 0, 0.6);  text-align: center;  border-radius: 5px;  color: #FFFFFF;  visibility: hidden;  margin: 0;  z-index: 2000;  -webkit-transition-duration: .2s;  transition-duration: .2s;  opacity: 0;  -webkit-transform: scale(0.9) translate(-50%, -50%);  transform: scale(0.9) translate(-50%, -50%);  -webkit-transform-origin: 0 0;  transform-origin: 0 0;  font-size: 14px;  }  ";
    maskHTML +=
      ".mui-show-loading.loading-visible {  opacity: 1;  visibility: visible;  -webkit-transform: scale(1) translate(-50%, -50%);  transform: scale(1) translate(-50%, -50%);  } ";
    maskHTML +=
      ".mui-show-loading .mui-spinner{  margin-top: 24px;  width: 36px;  height: 36px;  }  ";
    maskHTML +=
      ".mui-show-loading .text {  line-height: 1.6;  font-family: -apple-system-font,'Helvetica Neue',sans-serif; margin: 10px 0 0;}  ";
    maskHTML +=
      ".mui-show-loading-mask {    position: fixed;    z-index: 1000;    top: 0;    right: 0;    left: 0;    bottom: 0;  }  .mui-show-loading-mask-hidden{  display: none !important;  }";
    styleElement.innerHTML = maskHTML;
    styleElement.type = "text/css";
    document.head.appendChild(styleElement);
  });

  /**
   * 展示遮罩层
   */
  function showMask() {
    var mask = document.getElementsByClassName("mui-show-loading-mask");
    if (mask.length == 0) {
      mask = document.createElement("div");
      mask.classList.add("mui-show-loading-mask");
      document.body.appendChild(mask);
      mask.addEventListener("touchmove", function(e) {
        e.stopPropagation();
        e.preventDefault();
      });
    } else {
      mask[0].classList.remove("mui-show-loading-mask-hidden");
    }
  }

  /**
   * 隐藏遮罩层
   */
  function hideMask() {
    var mask = document.getElementsByClassName("mui-show-loading-mask");
    if (mask.length != 0) {
      mask[0].classList.add("mui-show-loading-mask-hidden");
    }
  }

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者

  /**
   * nativeUI管理系统原生界面，可用于弹出系统原生提示对话框窗口、时间日期选择对话框、等待对话框等。
   */
  window.plus.nativeUI = {
    /**
     * 弹出系统选择按钮框
     * @param {Object} actionsheetStyle 选择按钮框显示的样式
     * @param {Object} actionsheetCallback 选择按钮框关闭后的回调函数
     */
    actionSheet: function(actionsheetStyle, actionsheetCallback) {
      var html = "";
      if (actionsheetStyle) {
        // 标题
        var title = actionsheetStyle.title;
        if (title) {
          html +=
            '<ul class="mui-table-view"><li class="mui-table-view-cell"><a><b>' +
            title +
            "</b></a></li></ul>";
        }
        // 可选择菜单
        var buttons = actionsheetStyle.buttons;
        if (buttons && buttons.length > 0) {
          html += '<ul class="mui-table-view">';
          for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var color = button.color || "#000000";
            if (button.style == "destructive") {
              color = "#FF0000";
            }
            html +=
              '<li class="mui-table-view-cell" style="color:' +
                color +
                ';" id="' +
                $.adapterId +
                "_action_sheet_" +
                (i + 1) +
                '"><a>' +
                button.title || "" + "</a></li>";
          }
          html += "</ul>";
        }
        // 取消菜单
        var cancel = actionsheetStyle.cancel;
        if (cancel) {
          html +=
            '<ul class="mui-table-view"><li class="mui-table-view-cell" id="' +
            $.adapterId +
            '_action_sheet_0"><a>' +
            cancel +
            "</a></li></ul>";
        }
      }

      // 遮罩层
      showMask();
      // ActionSheet
      var actionSheet = document.getElementsByClassName("mui-popover-action");
      if (actionSheet.length == 0) {
        actionSheet = document.createElement("div");
        actionSheet.classList.add("mui-popover");
        actionSheet.classList.add("mui-popover-bottom");
        actionSheet.classList.add("mui-popover-action");
        document.body.appendChild(actionSheet);
        actionSheet.innerHTML = html;
      } else {
        actionSheet[0].innerHTML = html;
      }

      mui(".mui-popover-action").popover("show");
      mui(".mui-popover-action").on("tap", ".mui-table-view", function() {
        console.log("123");
        var id = this.getAttribute("id");
        if (id) {
          mui(".mui-popover-action").popover("hide");
          id = id.replace("p1Us_@dAptEr_action_sheet_", "");
          if (actionsheetCallback) {
            actionsheetCallback({
              index: parseInt(id)
            });
          }
        }
      });
    },
    /**
     * 弹出系统提示对话框
     * @param {Object} message 提示对话框上显示的内容
     * @param {Object} alertCB 提示对话框上关闭后的回调函数
     * @param {Object} title 提示对话框上显示的标题
     * @param {Object} buttonCapture 提示对话框上按钮显示的内容
     */
    alert: function(message, alertCB, title, buttonCapture) {
      mui.alert(message, title, buttonCapture, alertCB);
    },
    /**
     * 弹出系统确认对话框
     * @param {Object} message 确认对话框上显示的内容
     * @param {Object} confirmCB 确认对话框关闭后的回调函数
     * @param {Object} styles 确认对话框的参数/对话框的标题
     * @param {Object} buttons 确认对话框上显示的按钮（不推荐使用）
     */
    confirm: function(message, confirmCB, styles, buttons) {
      if (typeof styles == "string") {
        mui.confirm(message, styles, buttons, confirmCB);
      } else {
        mui.confirm(message, styles.title || "", styles.buttons, confirmCB);
      }
    },
    /**
     * 关闭系统等待对话框
     */
    closeWaiting: function() {
      hideMask();
      var toast = document.getElementsByClassName("mui-show-loading");
      if (toast.length > 0) {
        toast[0].classList.remove("loading-visible");
      }
    },
    /**
     * 关闭自动消失的提示消息
     */
    closeToast: function() {
      mui.closePopups();
    },
    /**
     * 预览图片
     * @param {Object} urls 需要预览的图片地址列表
     * @param {Object} styles 预览的显示参数
     */
    previewImage: function(urls, styles) {
      console.warn("暂未实现 plus.nativeUI.previewImage");
    },
    /**
     * 显示系统等待对话框
     * @param {Object} title 等待对话框上显示的提示标题内容
     * @param {Object} styles 等待对话框的显示参数
     * @todo 目前暂不支持对等待框 loading 样式进行更改，后续增加
     * @description 该代码片段主要参考 https://ask.dcloud.net.cn/article/id-12856__page-3 实现
     */
    showWaiting: function(title, styles) {
      var html = "";
      var spinnerStyle = "mui-spinner-white";
      if (styles && styles.style == "black") {
        spinnerStyle = "mui-spinner-black";
      }
      html += '<i class="mui-spinner ' + spinnerStyle + '"></i>';
      if (title) {
        html += '<p class="text">' + title + "</p>";
      }

      //遮罩层
      showMask();
      //加载框
      var toast = document.getElementsByClassName("mui-show-loading");
      if (toast.length == 0) {
        toast = document.createElement("div");
        toast.classList.add("mui-show-loading");
        toast.classList.add("loading-visible");
        if (styles) {
          // 等待框背景区域的宽度
          if (styles.width) {
            toast.style.width = styles.width;
          }
          // 等待框背景区域的高度
          if (styles.height) {
            toast.style.height = styles.height;
          }
          // 等待框中文字的颜色
          if (styles.color) {
            toast.style.color = styles.color;
          }
          // 等待框中文字的字体大小
          if (styles.size) {
            toast.style.fontSize = styles.size;
          }
          // 等待对话框中标题文字的水平对齐方式
          if (styles.textalign) {
            toast.style.textAlign = styles.textalign;
          }
          // 等待对话框的内边距
          if (styles.padding) {
            toast.style.padding = styles.padding;
          }
          // 等待对话框显示区域的背景色
          if (styles.background) {
            toast.style.backgroundColor = styles.background;
          }
          // 等待框显示区域的圆角
          if (styles.round) {
            toast.style.borderRadius = styles.round;
          }
          if (styles.back) {
            console.warn("由于 Web 无法响应和捕获返回键事件，因此该设置无效");
          }
          if (styles.loading) {
            console.warn("目前暂未实现 Loading 图标自定义");
          }
        }
        document.body.appendChild(toast);
        toast.innerHTML = html;
        toast.addEventListener("touchmove", function(e) {
          if (styles && styles.modal === false) {
            return;
          }
          e.stopPropagation();
          e.preventDefault();
        });
        toast.addEventListener("tap", function() {
          if (styles && styles.padlock) {
            plus.nativeUI.closeWaiting();
          }
        });
      } else {
        toast[0].innerHTML = html;
        toast[0].classList.add("loading-visible");
      }
    },
    /**
     * 弹出系统日期选择对话框
     * @param {Object} successCB 日期选择操作成功的回调函数
     * @param {Object} errorCB 日期选择操作取消或失败的回调函数
     * @param {Object} styles 日期选择操作的参数
     */
    pickDate: function(successCB, errorCB, styles) {
      var options = {
        type: "date"
      };
      if (styles) {
        if (styles.title) {
          console.warn("mui 不支持设置日期选择器的标题");
        }
        if (styles.date) {
          console.warn("mui 不支持设置日期选择器的当前日期");
        }
        if (styles.minDate) {
          options.beginDate = styles.minDate;
        }
        if (styles.maxDate) {
          options.endDate = styles.maxDate;
        }
        if (styles.popover) {
          console.warn("mui 不支持设置日期选择器的弹出指示区域");
        }
      }
      if (mui.DtPicker) {
        var dtPicker = new mui.DtPicker(options);
        dtPicker.show(function(items) {
          if (successCB) {
            successCB({
              date: items.value
            });
          }
        });
      }
    },
    /**
     * 弹出系统时间选择对话框
     * @param {Object} successCB 时间选择操作成功的回调函数
     * @param {Object} errorCB 时间选择操作取消或失败的回调函数
     * @param {Object} styles 时间选择操作的参数
     */
    pickTime: function(successCB, errorCB, styles) {
      var options = {
        type: "time"
      };
      if (styles) {
        if (styles.title) {
          console.warn("mui 不支持设置事件选择器的标题");
        }
        if (styles.time) {
          console.warn("mui 不支持设置时间选择器的当前时间");
        }
        if (styles.popover) {
          console.warn("mui 不支持设置日期选择器的弹出指示区域");
        }
        if (styles.is24Hour) {
          console.warn("mui 不支持设置时间选择器的24小时制模式");
        }
      }
      if (mui.DtPicker) {
        var dtPicker = new mui.DtPicker(options);
        dtPicker.show(function(items) {
          if (successCB) {
            successCB({
              date: items.value
            });
          }
        });
      }
    },
    /**
     * 弹出系统输入对话框
     * @param {Object} message 输入对话框上显示的内容
     * @param {Object} promptCB 关闭输入对话框的回调函���
     * @param {Object} title 输入对话框上显示的标题
     * @param {Object} tip 输入对话框上编辑框显示的提示文字
     * @param {Object} buttons 输入对话框上显示的按钮数组
     */
    prompt: function(message, promptCB, title, tip, buttons) {
      mui.prompt(message, tip, title, buttons, promptCB);
    },
    /**
     * 显示自动消失的提示消息
     * @param {Object} message 提示消息上显示的文字内容
     * @param {Object} styles 提示消息的参数
     */
    toast: function(message, styles) {
      mui.toast(message, styles);
    },
    /**
     * 设置原生界面样式（暗黑模式）
     * @param {Object} style 原生界面样式
     */
    setUiStyle: function(style) {
      console.warn("Web 不支持设置暗黑模式");
    }
  };
})(mui, document, window);
