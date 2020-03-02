/**
 * MUI H5+ 适配插件 - Runtime
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  var startUpTime = new Date().getTime();
  var initEndTime = new Date().getTime();

  $.initPlusRuntime = function(jsonUrl) {
    initUrlLocation = window.location;
    window.addEventListener("load", function() {
      initEndTime = new Date().getTime();
    }())
    if (jsonUrl) {
      if (typeof jsonUrl === "string") {
        $.ajax(jsonUrl, {
          dataType: "text",
          success: function(data) {
            if (data) {
              manifest = JSON.parse(data);
            }
          }
        });
      } else {
        manifest = $.extend(manifest, jsonUrl);
      }
    }
  };

  // 初始的 URL Location
  var initUrlLocation;
  // 模拟的 Manifest.json 文件内容（这里的值是使用 HBuilder 精简后的初始化内容）
  var manifest = {
    "@platforms": ["android", "iPhone", "iPad"],
    id: "HBuilder",
    /*应用的标识*/
    name: "test",
    /*应用名称，程序桌面图标名称*/
    version: {
      name: "1.0",
      /*应用版本名称*/
      code: ""
    },
    description: "",
    /*应用描述信息*/
    icons: {
      "72": "icon.png"
    },
    launch_path: "index.html",
    /*应用的入口页面，默认为根目录下的index.html；支持网络地址，必须以http://或https://开头*/
    developer: {
      name: "",
      /*开发者名称*/
      email: "",
      /*开发者邮箱地址*/
      url: "" /*开发者个人主页地址*/
    },
    permissions: {}
  };

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者

  /**
   * Runtime模块管理运行环境，可用于获取当前运行环境信息、与其它程序进行通讯等。
   */
  window.plus.runtime = {
    /**
     * 当前应用的APPID
     * @description 读取 manifest.json 文件中的定义
     */
    appid: manifest.id || "",
    /**
     * 第三方程序调用时传递给程序的参数
     * @description 在 Web 中，将获取初始化时的页面地址，提取其 `queryString`，作为本属性的返回值
     */
    arguments: initUrlLocation ? initUrlLocation.search.replace("?", "") : "",
    /**
     * 应用的渠道标识
     * @description Web 不存在渠道分发的区别
     */
    channel: "",
    /**
     * 应用启动来源
     * @description Web 的启动来源必然是从浏览器启动
     */
    launcher: "browser",
    /**
     * 应用安装来源
     * @description Web 不存在应用安装步骤，但是其启动方式类似于流应用的 URL Scheme 方式触发
     */
    origin: "scheme",
    /**
     * 客户端的版本名称
     * @description 读取 manifest.json 文件中的定义
     */
    version: (manifest.version && manifest.version.name) || "",
    /**
     * 客户端的版本号
     * @description 读取 manifest.json 文件中的定义
     */
    versionCode: (manifest.version && manifest.version.code) || "",
    /**
     * 客户端5+运行环境的内部版本号
     * @description Web 不存在 5+ 运行环境
     */
    innerVersion: "",
    /**
     * 客户端uni-app运行环境的版本号
     * @description Web 未使用 Uni-App，因此返回空字符串
     */
    uniVersion: "",
    /**
     * 获取当前应用首页加载的时间
     * @description 当本脚本执行时，当前应用首页基本已经加载完毕了，所以设置为 0
     */
    launchLoadedTime: initEndTime - startUpTime,
    /**
     * 获取当前应用的进程标识
     * @description Web 不存在进程，因此设置为未知
     */
    processId: "unknown",
    /**
     * 获取当前应用的启动时间戳
     */
    startupTime: startUpTime,
    /**
     * 应用是否由于内核崩溃自动恢复
     * @description Web 使用的浏览器内核一旦崩溃则是在系统层面上的崩溃，无法捕获
     */
    isRecovery: false,
    /**
     * 用户同意隐私政策
     */
    agreePrivacy: function() {
      localStorage.setItem($.adapterId + "_privacy", "true");
    },
    /**
     * 用户不同意隐私政策
     */
    disagreePrivacy: function() {
      localStorage.setItem($.adapterId + "_privacy", "false");
    },
    /**
     * 查询用户是否同意隐私政策
     */
    isAgreePrivacy: function() {
      return localStorage.getItem($.adapterId + "_privacy") == "true";
    },
    /**
     * 获取指定APPID对应的应用信息
     * @param {String} appid 应用的Appid
     * @param {Object} getPropertyCB 获得应用信息成功回调函数
     */
    getProperty: function(appid, getPropertyCB) {
      if (getPropertyCB) {
        getPropertyCB({
          appid: manifest.id || "",
          version: (manifest.version && manifest.version.name) || "",
          versionCode: (manifest.version && manifest.version.code) || "",
          name: manifest.name || "",
          description: manifest.description || "",
          author: (manifest.developer && manifest.developer.name) || "",
          email: (manifest.developer && manifest.developer.email) || "",
          features: manifest.permissions && Object.keys(manifest.permissions)
        });
      }
    },
    /**
     * 安装应用
     * @param {Object} filePath 要安装的文件路径
     * @param {Object} options 应用安装设置的参数
     * @param {Object} installSuccessCB 正确安装后的回调
     * @param {Object} installErrorCB 安装失败的回调
     * @description Web 不支持安装应用，因此直接失败
     * @todo 不过后续可以考虑执行 apk 的下载和跳转
     */
    install: function(filePath, options, installSuccessCB, installErrorCB) {
      console.warn("Web 不支持安装应用");
      if (installErrorCB) {
        installErrorCB("Web 不支持安装应用");
      }
    },
    /**
     * 退出应用
     * @description Web 的退出是直接设置为空白页
     */
    quit: function() {
      window.location.href = "about:blank";
    },
    /**
     * 重启当前的应用
     * @description 重启当前的 Web 是跳转到 Adapter 初始化时候的地址
     */
    restart: function() {
      window.location.href = initUrlLocation ?
        initUrlLocation.href :
        window.location.href;
    },
    /**
     * 设置程序快捷方式图标上显示的角标数字
     * @param {Object} number 要显示的角标数字值
     * @param {Object} options 通知
     * @description Web 不存在快捷方式图标，因此无法显示角标数字
     */
    setBadgeNumber: function(number, options) {
      console.warn("Web 不存在快捷方式图标，因此无法显示角标数字");
    },
    /**
     * 调用第三方程序打开指定的URL
     * @param {String} url 要打开的URL地址
     * @param {Object} errorCB 打开URL地址失败的回调
     * @param {Object} identity 指定打开URL地址的程序名称
     * @description Web 上无法调用第三方程序，因此将直接打开新的 URL
     */
    openURL: function(url, errorCB, identity) {
      window.open(url);
    },
    /**
     * 使用内置Webview窗口打开URL
     * @param {String} url
     */
    openWeb: function(url) {
      window.open(url);
    },
    /**
     * 调用第三方程序打开指定的文件
     * @param {Object} filepath 打开文件的路径
     * @param {Object} options 打开文件参数
     * @param {Object} errorCB 打开文件失败的回调
     * @description 由于 Web 不能主动打开文件，这里模拟了 input 点击事件来完成文件选择，并将文件转换成 TEXT 格式用新窗口打开
     */
    openFile: function(filepath, options, errorCB) {
      window.open(filepath);
    },
    /**
     * 处理直达页面链接参数
     */
    processDirectPage: function() {
      var args = initUrlLocation.search.replace("?", "");

      // 将 QueryString 转换为 Object
      var pairs = args.split("&");
      var result = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        result[pair[0]] = decodeURIComponent(pair[1] || "");
      }

      var direct = result["__direct_page"];
      if (direct) {
        result["__direct_page"] = "";
        var newSearch = "?";
        var keys = Object.keys(result);
        for (var j = 0; j < keys.length; j++) {
          newSearch += keys[j] + "=" + result[keys[j]] + "&";
        }
        newSearch.slice(0, -1);
        initUrlLocation.search = newSearch;
        return direct;
      }
      return "";
    },
    /**
     * 调用第三方程序
     * @param {Object} appInf 要启动第三方程序的描述信息
     * @param {Object} errorCB 启动第三方程序操作失败的回调函数
     * @description Web 调用第三方程序是通过 URL 拉起的，因此主要使用 action 字段（参照 URL Scheme）
     */
    launchApplication: function(appInf, errorCB) {
      if (appInf && appInf.action) {
        var start = new Date();
        var ifr = document.createElement('iframe');
        ifr.src = appInf.action;
        document.body.appendChild(ifr);
        ifr.onload = function() {
          ifr.style.display = 'none';
        };
        setTimeout(function() {
          document.body.removeChild(ifr);
          var end = new Date();
          if (end - start - 500 <= 30) {
            // 0.6s 加载不出来说明 App 没打开
            if (errorCB) {
              errorCB({
                code: "999999",
                message: "调用第三方程序失败失败"
              })
            }
          }
        }, 500);
      } else if (errorCB) {
        errorCB({
          code: "999999",
          message: "调用第三方程序失败失败"
        });
      }
    },
    /**
     * 判断第三方程序是否已存在
     * @param {Object} appInf 要判断第三方程序的描述信息
     * @description 由于 Web 无法读取系统应用列表，因此全部模拟读取成功的情况
     */
    isApplicationExist: function(appInf) {
      console.warn("Web 无法读取系统应用列表，无法判断应用是否安装");
      return true;
    },
    /**
     * 判断是否自定义应用启动页面加载地址
     */
    isCustomLaunchPath: function() {
      var args = initUrlLocation.search.replace("?", "");

      // 将 QueryString 转换为 Object
      var pairs = args.split("&");
      var result = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        result[pair[0]] = decodeURIComponent(pair[1] || "");
      }

      var launchPath = result["__launch_path"];
      return window.location.href == launchPath;
    }
  };
})(mui, document, window);
