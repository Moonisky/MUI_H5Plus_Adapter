/**
 * MUI H5+ 适配插件 - Webview
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window, wv_factory) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  // 如果是iframe内,不执行操作
  if (window.top !== self) {
    return;
  }

  $.ready(function() {
    // 定义 iframe 样式
    var styleElement = document.createElement("style");
    styleElement.innerHTML =
      ".mui-iframe-wrapper iframe{display: block;}.mui-iframe-wrapper{top: 45px; bottom: 50px;z-index:500;overflow: scroll;}";
    styleElement.type = "text/css";
    document.head.appendChild(styleElement);
  });
  // 修改/获取property或者attribute封装
  $.prop_attr = (function _attr() {
    return function() {
      var args = $.slice.call(arguments),
        s = args.length == 1 ? this : args.pop(); // 逻辑待修改
      if (args.length == 1) {
        if (typeof args[0] == "object") {
          var a = args[0],
            _self = _attr.call();
          for (var i in a) {
            a.hasOwnProperty(i) && _self.call(s, i, a[i], s);
          }
        } else {
          var prop = s[args[0]];
          return prop !== undefined
            ? prop
            : s.getAttribute && s.getAttribute(args[0]);
        }
      } else {
        if (s[args[0]] !== undefined) {
          s[args[0]] = args[1];
        } else {
          s.setAttribute && s.setAttribute(args[0], args[1]);
        }
      }
      return s;
    };
  })();

  // 截取url地址，获取窗口的id
  // 考虑到实际使用情况比较复杂,
  // 比如不同路径下相同文件名
  // user/index.html
  // shop/index.html
  // 都返回index
  // 会把webview_cache搞乱
  // 所以暂时返回url本身
  // 还是建议使用时传入webview的id
  function url_2_id(url) {
    return url;
    url = url.split(/#|\?/g);
    var res = /.+[^\.]\b(\w+)\b/g.exec(url[0]);
    if (res) {
      return res[1];
    } else {
      return url;
    }
  }

  // remove方法兼容
  var has_remove = false;
  // 获取iframe对象
  function get_iframe() {
    // 创建iframe&容器
    var iframe_wrapper = document.createElement("DIV"),
      iframe = document.createElement("IFRAME");
    iframe_wrapper.className = "mui-iframe-wrapper mui-hidden";
    if (!has_remove) {
      iframe_wrapper.remove = iframe_wrapper.remove
        ? ((has_remove = true), iframe_wrapper.remove)
        : function() {
            var s = this,
              parent = s.parentNode;
            if (parent) {
              return parent.removeChild(s);
            } else {
              return this;
            }
          };
    }
    iframe_wrapper.appendChild(iframe);
    return {
      wrapper: iframe_wrapper,
      iframe: iframe
    };
  }

  // webview缓存
  var launch_id = url_2_id(location.href),
    webview_cache = (function(obj) {
      var iframe_obj = get_iframe();
      Object.defineProperty(iframe_obj.iframe, "contentWindow", {
        get: function() {
          return window;
        }
      });
      Object.defineProperty(iframe_obj.iframe, "contentDocument", {
        get: function() {
          return window;
        }
      });
      Object.defineProperty(iframe_obj.iframe, "src", {
        get: function() {
          return location.href;
        },
        set: function(src) {
          location.href = src;
        }
      });
      $.prop_attr(
        {
          "data-loaded": 0,
          id: launch_id,
          name: launch_id
        },
        iframe_obj.iframe
      );
      $.ready(function() {
        $.trigger(iframe_obj.iframe, "load");
      });
      obj[launch_id] = new wv_factory(
        iframe_obj.wrapper,
        iframe_obj.iframe,
        null,
        obj,
        "",
        $,
        window
      );
      return obj;
    })({});

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者
  
  /**
   * Webview模块管理应用窗口界面，实现多窗口的逻辑控制管理操作
   * @description 这里使用 Web 的 iframe 来模拟 Webview
   */
  window.plus.webview = {
    /**
     * 当前Webview窗口是否由于内核崩溃自动恢复
     * @description 原属性仅在 iOS WKWebview 内核生效，因此这里将设置为固定的模拟值 false，标记为不支持
     */
    isRecovery: false,
    /**
     * 获取所有Webview窗口
     */
    all: function() {
      var cache = webview_cache,
        res = [];
      for (var i in cache) {
        res.push(cache[i]);
      }
      return res;
    },
    /**
     * 关闭Webview窗口
     * @param {String|Object} id_wvobj 要关闭Webview窗口id或窗口对象
     * @param {Object} aniClose 关闭Webview窗口的动画效果
     * @param {Number} duration 关闭Webview窗口动画的持续时间
     * @param {Object} extras 关闭Webview窗口扩展参数
     */
    close: function(id_wvobj, aniClose, duration, extras) {
      if ($.type(id_wvobj) == "string") {
        id_wvobj = webview_cache[id_wvobj];
        if (!id_wvobj) {
          return;
        }
      }
      id_wvobj.close();
    },
    /**
     * 创建新的Webview窗口
     * @param {*} url 新窗口加载的HTML页面地址
     * @param {*} id 新窗口的标识
     * @param {*} styles 创建Webview窗口的样式（如窗口宽、高、位置等信息）
     * @param {*} extras 创建Webview窗口的额外扩展参数
     */
    create: function(url, id, styles, extras) {
      url = url && url.trim();
      if (!url) {
        return null;
      }

      // 防止iframe缓存(仅在调试时打开,生产环境需要注释掉)
      // url += (url.indexOf('?')!=-1?'&':'?')+('t='+Number(new Date()));

      // 得到iframe&容器
      var iframe_obj = get_iframe();

      // webview的id
      id = url_2_id(id || url);

      //设置iframe&容器属性
      $.prop_attr(
        {
          "data-loaded": 0,
          src: url,
          id: id,
          name: id,
          height: "100%",
          allowTransparency:
            styles && styles.background
              ? styles.background.trim() == "transparent"
              : false
        },
        iframe_obj.iframe
      );

      // zIndex兼容
      styles && styles.zindex && (styles.zIndex = ~~styles.zindex + 500);
      styles && $.prop_attr(styles, iframe_obj.wrapper.style);
      // 将iframe对象appendChild到dom中
      document.body.appendChild(iframe_obj.wrapper);

      // 缓存并返回webview对象
      return (webview_cache[id] = new wv_factory(
        iframe_obj.wrapper,
        iframe_obj.iframe,
        extras,
        webview_cache,
        this.currentWebview().id,
        $,
        window
      ));
    },
    /**
     * 获取当前窗口的WebviewObject对象
     */
    currentWebview: function() {
      return webview_cache[launch_id];
    },
    /**
     * 查找指定标识的WebviewObject窗口
     * @param {Object} id 要查找的Webview窗口标识
     */
    getWebviewById: function(id) {
      id = id.toString().trim();
        if (id == "") {
          return null;
        }
        return webview_cache[id];
    },
    /**
     * 获取应用首页WebviewObject窗口对象
     */
    getLaunchWebview: function() {
      return webview_cache[launch_id];
    },
    /**
     * 隐藏Webview窗口
     * @param {*} id_wvobj 要隐藏的Webview窗口id或窗口对象
     * @param {*} aniHide 隐藏Webview窗口的动画效果
     * @param {*} duration 隐藏Webview窗口动画的持续时间
     * @param {*} extras 隐藏Webview窗口扩展参数
     */
    hide: function(id_wvobj, aniHide, duration, extras) {
      if ($.type(id_wvobj) == "string") {
        id_wvobj = webview_cache[id_wvobj];
        if (!id_wvobj) {
          return;
        }
      }
      id_wvobj.hide(aniHide, duration, extras);
    },
    /**
     * 创建并打开Webview窗口
     * @param {*} url 打开窗口加载的HTML页面地址
     * @param {*} id 打开窗口的标识
     * @param {*} styles 创建Webview窗口的样式（如窗口宽、高、位置等信息）
     * @param {*} aniShow 显示Webview窗口的动画效果
     * @param {*} duration 显示Webview窗口动画的持续时间
     * @param {*} showedCB Webview窗口显示完成的回调函数
     */
    open: function(url, id, styles, aniShow, duration, showedCB) {
      var wv = this.create(url, id, styles);
      wv.show(aniShow, duration, showedCB);
      return wv;
    },
    /**
     * 显示Webview窗口
     * @param {*} id_wvobj 要显示Webview窗口id或窗口对象
     * @param {*} aniShow 显示Webview窗口的动画效果
     * @param {*} duration 显示Webview窗口动画的持续时间
     * @param {*} showedCB Webview窗口显示完成的回调函数
     * @param {*} extras 显示Webview窗口扩展参数
     */
    show: function(id_wvobj, aniShow, duration, showedCB, extras) {
      if ($.type(id_wvobj) == "string") {
        id_wvobj = webview_cache[id_wvobj];
        if (!id_wvobj) {
          return;
        }
      }
      id_wvobj.show(aniShow, duration, showedCB, extras);
      return id_wvobj;
    },
    /**
     * 获取Webview默认是否开启硬件加速
     */
    defaultHardwareAccelerated: function() {
      return true;
    }
  };
})(mui, document, window, function(
  wrapper,
  iframe,
  extras,
  webview_cache,
  opener_id,
  $,
  win
) {
  // webview对象
  function webview(iframe, extras) {
    //传参目的->减少作用域链深度
    // webview的id
    this.id = iframe.id;

    // 传参实现
    $.type(extras) == "object" &&
      !$.isEmptyObject(extras) &&
      $.extend(this, extras);
  }

  var wv_prop = webview.prototype,
    is_loaded = ~~iframe.getAttribute("data-loaded"),
    after_load = function(callback) {
      // 加载完成后执行的一些操作
      if (is_loaded) {
        callback.call(iframe);
      } else {
        iframe.addEventListener("load", function iframe_load() {
          // 移除事件
          this.removeEventListener("load", iframe_load);

          // 加载完成标志
          this.setAttribute("data-loaded", 1);
          is_loaded = 1;

          // 执行回调
          callback.call(this);
        });
      }
    };

  // 监听load事件,触发为plusready
  after_load(function() {
    // iframe的window
    var iframe_win = this.contentWindow,
      win_plus = win.top.plus;

    // 如果是启动页已经有了plus
    if (iframe_win.plus) {
      return;
    }

    // 给iframe的window添加plus对象
    iframe_win.plus = $.extend(true, {}, win_plus);

    // 定义net(让xhr在本iframe中进行)
    iframe_win.plus.net.XMLHttpRequest = function() {
      return new iframe_win.XMLHttpRequest();
    };

    // 重定义currentWebview方法
    iframe_win.plus.webview.currentWebview = function() {
      return webview_cache[iframe.id];
    };

    var fixed_height = function(height) {
      var iframe_doc = this.contentDocument;
      iframe_doc.head.appendChild(
        $.prop_attr(
          {
            innerHTML:
              "html{height: " +
              (height ? height + "px" : "100%") +
              ";width: 100%;overflow: hidden;}body,body>.mui-content{height: 100%;width: 100%;overflow: auto;}",
            type: "text/css"
          },
          iframe_doc.createElement("style")
        )
      );
    }.bind(this);

    // iframe的高度
    if ($.os.ios) {
      fixed_height();
    } else {
      setTimeout(
        function() {
          iframe.offsetHeight != wrapper.offsetHeight &&
            fixed_height(wrapper.offsetHeight);
        }.bind(this),
        0
      );
    }

    // 触发iframe里document的plusReady事件
    $.trigger(this.contentDocument, "plusready");
  });

  // 监听error事件,触发checkRenderedContent的error(待完成)
  iframe.addEventListener("error", function iframe_error() {
    // 移除事件
    this.removeEventListener("error", iframe_error);
  });

  // 事件监听(有些事件可能需在wrapper上监听,待完成)
  wv_prop.addEventListener = function() {
    var args = $.slice.call(arguments);
    after_load(function() {
      this.contentWindow.addEventListener.apply(this.contentWindow, args);
    });
  };

  // 移除事件监听(有些事件可能需在wrapper上移除监听,待完成)
  wv_prop.removeEventListener = function() {
    var args = $.slice.call(arguments);
    after_load(function() {
      this.contentWindow.removeEventListener.apply(this.contentWindow, args);
    });
  };

  var children_wv = [],
    parent = null;

  wv_prop.append = function(webview) {
    // 检查是否已经是其他webview的子webview
    var parent = webview.parent();
    if (parent && parent.id) {
      return;
    }
    //修改parent变量的"桥梁"
    webview.parent.prototype.parent = this.id;
    children_wv.push(webview);
  };

  wv_prop.parent = function() {
    return parent ? webview_cache[parent] : null;
  };

  //修改parent变量的"桥梁"
  Object.defineProperty(wv_prop.parent.prototype, "parent", {
    set: function(value) {
      parent = value;
    },
    get: function() {
      return parent;
    }
  });

  wv_prop.appendJsFile = function() {
    // 待完成
    // 目前思路
    // 用ajax进行向服务器请求文件
  };

  wv_prop.animate = function() {
    // 待完成
  };

  wv_prop.back = function() {
    after_load(
      function() {
        this.evalJS("history.go(-1);");
      }.bind(this)
    );
  };

  wv_prop.beginPullToRefresh = function() {
    // 待完成
    // 给wrapper加方法?
  };

  wv_prop.setPullToRefresh = function() {
    // 暂无解决方案
  };

  wv_prop.endPullToRefresh = function() {
    // 待完成
    // 给wrapper加方法?
  };

  wv_prop.canBack = function(queryCallback) {
    queryCallback({ canBack: iframe.contentWindow.history.length > 1 });
  };

  wv_prop.canForward = function(queryCallback) {
    // 无解决方案
  };

  // 待完成
  wv_prop.checkRenderedContent = function(
    options,
    successCallback,
    errorCallback
  ) {};

  wv_prop.children = function() {
    return children_wv;
  };

  wv_prop.clear = function() {
    iframe.contentWindow.location.replace("about:blank");
  };

  wv_prop.close = function(aniClose, duration, extras) {
    // 动画部分待完成
    wrapper.classList.add("mui-hidden");
    wrapper.remove();
    // 子webview的关闭
    children_wv.forEach(function(child) {
      child.close();
    });
    delete webview_cache[this.id];
  };

  wv_prop.drag = function(options, otherView, callback) {};

  wv_prop.draw = function(bitmap, successCallback, errorCallback, options) {};

  wv_prop.evalJS = function(js) {
    after_load(function() {
      this.contentWindow.location.href = "javascript:" + js + ";";
    });
  };

  wv_prop.forward = function() {
    this.evalJS("history.forward()");
  };

  wv_prop.getFavoriteOptions = function() {
    // 待完成,没用过,没有思路实现
  };

  wv_prop.getShareOptions = function() {
    // 待完成,没用过,没有思路实现
  };

  wv_prop.getStyle = function() {
    var style_str = wrapper.getAttribute("style");
    if (style_str) {
      var style_obj = {};
      style_str.split(";").forEach(function(sub_str) {
        sub_str = sub_str
          .trim()
          .split(":")
          .map(function(str) {
            return str.trim();
          });
        if (!sub_str[0]) {
          return;
        }
        if (sub_str[0] == "z-index") {
          this.zindex = sub_str[1] - 500;
        } else {
          style_obj[sub_str[0]] = sub_str[1];
        }
      }, style_obj);
      return style_obj;
    } else {
      return {};
    }
  };

  wv_prop.getSubNViews = function() {
    // 待完成,没用过,没有思路实现
  };

  wv_prop.getTitle = function() {
    return iframe.contentDocument.title;
  };

  wv_prop.getTitleNView = function() {
    // 待完成
    return "";
  };

  wv_prop.getURL = function() {
    // 待完成
    return iframe.src;
  };

  wv_prop.hide = function(aniHide, duration, extras) {
    after_load(function() {
      wrapper.classList.add("mui-hidden");
      this.contentDocument.activeElement.blur();
      $.trigger(this.contentDocument, "hide");
    });
  };

  wv_prop.interceptTouchEvent = function(intercept) {
    // 待完成
  };

  wv_prop.isHardwareAccelerated = function(intercept) {
    return false;
  };

  wv_prop.isVisible = function(intercept) {
    return !wrapper.classList.contains("mui-hidden");
  };

  wv_prop.listenResourceLoading = function(options, callback) {
    // 无解决方案
  };

  wv_prop.loadData = function(options, callback) {
    // 待完成
    // 有意向使用如下方法
    // http://www.zhangxinxu.com/wordpress/2017/08/iframe-html5-blob-code-view/
  };

  wv_prop.loadURL = function(options, callback) {
    // 待完成
    // 修改iframe的src
    // 修改后再次监听load和error事件
  };

  wv_prop.opened = function() {
    var id = this.id,
      res = [];
    for (var wv_id in webview_cache) {
      var opener = webview_cache[wv_id].opener();
      opener && id == opener.id && res.push(webview_cache[wv_id]);
    }
    return res;
  };

  wv_prop.opener = function() {
    return webview_cache[opener_id];
  };

  wv_prop.overrideResourceRequest = function(options) {
    // 无解决方案
  };

  wv_prop.overrideUrlLoading = function(options, callback) {
    // 无解决方案
  };

  wv_prop.reload = function(force) {
    // force参数无效
    after_load(function() {
      this.contentWindow.location.reload();
      // 刷新后重置plus?,待完成
    });
  };

  wv_prop.resetBounce = function() {
    // 无解决方案
  };

  wv_prop.restore = function() {
    // 待完成
  };

  wv_prop.remove = function(webview) {
    for (
      var i = children_wv.length - 1, id = webview.id, index = 0;
      i >= 0;
      i--
    ) {
      if (children_wv[i].id == id) {
        var wv = children_wv.splice(i, 1);
        wv[0].parent.prototype.parent = null;
        break;
      }
    }
  };

  wv_prop.removeFromParent = function() {
    parent && webview_cache[parent].remove(this);
  };

  wv_prop.setBounce = function() {
    // 无解决方案
  };

  wv_prop.setBlockNetworkImage = function() {
    // 无解决方案
  };

  wv_prop.setContentVisible = function(visible) {
    iframe.classList[visible ? "remove" : "add"]("mui-hidden");
  };

  wv_prop.setFavoriteOptions = function() {
    // 暂无解决方案
  };

  wv_prop.setRenderedEventOptions = function() {
    // 暂无解决方案
  };

  wv_prop.setStyle = function(styles) {
    // zIndex兼容
    styles && styles.zindex && (styles.zIndex = ~~styles.zindex + 500);
    styles && $.prop_attr(styles, wrapper.style);
    styles &&
      styles.background &&
      $.prop_attr(
        {
          allowTransparency: styles.background.trim() == "transparent"
        },
        iframe
      );
  };

  wv_prop.setShareOptions = function(options) {
    // 暂无解决方案
  };

  wv_prop.setJsFile = function(path) {
    // 待完成
  };

  wv_prop.setCssFile = function(path) {
    // 待完成
  };

  wv_prop.setCssText = function(path) {
    // 待完成
  };

  wv_prop.setVisible = function(visible) {
    // 待完成
    wrapper.style.visibility = visible ? "visible" : "hidden";
  };

  wv_prop.setFixBottom = function(height) {
    // 暂无解决方案
  };

  wv_prop.show = function(aniShow, duration, showedCB, extras) {
    after_load(function() {
      wrapper.classList.remove("mui-hidden");
      // 所有iframe里的activeElement失去焦点
      // 主要为了解决切换iframe时,键盘不收起的问题
      $.slice.call(win.top.frames).forEach(
        $.os.ios
          ? function(frames) {
              // 待解决
            }
          : function(frames) {
              var active = frames.document.activeElement;
              active && active.blur();
            }
      );
      $.trigger(this.contentDocument, "show");
      //显示webview,触发show事件
      if (showedCB && $.type(showedCB) == "function") {
        wrapper.classList.remove("mui-hidden");
        showedCB.call(win);
      }
    });
  };

  wv_prop.showBehind = function() {
    // 暂无解决方案
  };

  wv_prop.stop = function() {
    // 暂无解决方案
  };

  wv_prop.updateSubNViews = function() {
    // 暂无解决方案
  };

  var event = [
    {
      name: "onclose",
      callback: $.noop,
      event_name: "close"
    },
    {
      name: "onerror",
      callback: $.noop,
      event_name: "error"
    },
    {
      name: "onloaded",
      callback: $.noop,
      event_name: "load"
    },
    {
      name: "onloading",
      callback: $.noop,
      event_name: "loading"
    }
  ];

  //待完成
  event.forEach(function(obj, index) {
    Object.defineProperty(wv_prop, obj.name, {
      set: function(value) {
        // 待完成
        event[index].callback = value;
      },
      get: function() {
        return event[index].callback;
      }
    });
  });

  // 返回webview对象
  return new webview(iframe, extras);
});
