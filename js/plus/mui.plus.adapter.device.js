/**
 * MUI H5+ 适配插件 -
 * version 1.0.0
 * by Moonisky
 * guest@swift.gg
 */

(function($, document, window) {
  // plus 环境不进行重定义
  if ($.os.plus) {
    return;
  }

  // 这段获取系统设备信息的代码来源于 Uni-App
  // 参考了 https://github.com/dcloudio/uni-app 中 HTML5 获取系统信息 API 的实现

  const ua = navigator.userAgent;
  // 是否是 Android 设备
  const isAndroid = /android/i.test(ua);
  // 是否是 iOS 设备
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  var safeAreaInsets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };

  function getWindowOffset() {
    const style = document.documentElement.style;
    const top = parseInt(
      (style.getPropertyValue("--window-top").match(/\d+/) || ["0"])[0]
    );
    const bottom = parseInt(
      (style.getPropertyValue("--window-bottom").match(/\d+/) || ["0"])[0]
    );
    return {
      top: top ? top + safeAreaInsets.top : 0,
      bottom: bottom ? bottom + safeAreaInsets.bottom : 0
    };
  }

  /**
   * 获取系统信息
   */
  function getSystemInfoSync() {
    var screen = window.screen;
    var pixelRatio = window.devicePixelRatio;
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    var windowWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth,
      screenWidth
    );
    var windowHeight = window.innerHeight;
    var language = navigator.language;
    var statusBarHeight = safeAreaInsets.top;
    var osname;
    var osversion;
    var model;

    if (isIOS) {
      osname = "iOS";
      let osversionFind = ua.match(/OS\s([\w_]+)\slike/);
      if (osversionFind) {
        osversion = osversionFind[1].replace(/_/g, ".");
      }
      let modelFind = ua.match(/\(([a-zA-Z]+);/);
      if (modelFind) {
        model = modelFind[1];
      }
    } else if (isAndroid) {
      osname = "Android";
      // eslint-disable-next-line no-useless-escape
      let osversionFind = ua.match(/Android[\s/]([\w\.]+)[;\s]/);
      if (osversionFind) {
        osversion = osversionFind[1];
      }
      let infoFind = ua.match(/\((.+?)\)/);
      let infos = infoFind ? infoFind[1].split(";") : ua.split(" ");
      // eslint-disable-next-line no-useless-escape
      const otherInfo = [
        /\bAndroid\b/i,
        /\bLinux\b/i,
        /\bU\b/i,
        /^\s?[a-z][a-z]$/i,
        /^\s?[a-z][a-z]-[a-z][a-z]$/i,
        /\bwv\b/i,
        /\/[\d\.,]+$/,
        /^\s?[\d\.,]+$/,
        /\bBrowser\b/i,
        /\bMobile\b/i
      ];
      for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        if (info.indexOf("Build") > 0) {
          model = info.split("Build")[0].trim();
          break;
        }
        let other;
        for (let o = 0; o < otherInfo.length; o++) {
          if (otherInfo[o].test(info)) {
            other = true;
            break;
          }
        }
        if (!other) {
          model = info.trim();
          break;
        }
      }
    } else {
      osname = "Other";
      osversion = "0";
    }

    var system = `${osname} ${osversion}`;
    var platform = osname.toLocaleLowerCase();
    var safeArea = {
      left: safeAreaInsets.left,
      right: windowWidth - safeAreaInsets.right,
      top: safeAreaInsets.top,
      bottom: windowHeight - safeAreaInsets.bottom,
      width: windowWidth - safeAreaInsets.left - safeAreaInsets.right,
      height: windowHeight - safeAreaInsets.top - safeAreaInsets.bottom
    };

    const { top: windowTop, bottom: windowBottom } = getWindowOffset();

    windowHeight -= windowTop;
    windowHeight -= windowBottom;

    var uuid = localStorage.getItem("p1Us_@dAptEr_uuid");
    if (uuid === null || uuid === undefined || uuid === "") {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      uuid = s.join("");
      localStorage.setItem("p1Us_@dAptEr_uuid", uuid);
    }

    return {
      windowTop,
      windowBottom,
      windowWidth,
      windowHeight,
      pixelRatio,
      screenWidth,
      screenHeight,
      language,
      statusBarHeight,
      system,
      platform,
      model,
      safeArea,
      safeAreaInsets: {
        top: safeAreaInsets.top,
        right: safeAreaInsets.right,
        bottom: safeAreaInsets.bottom,
        left: safeAreaInsets.left
      },
      uuid
    };
  }

  // html5+ 模块重新定义
  // 模块函数的具体定义参照了 http://www.html5plus.org/doc/h5p.html
  // 由于 Web 和 App 的差异，决定了很多模块无法实现，只能够忽略方法实际效果或者返回模拟值
  // 因此，这些无法正常模拟的 API 会输出警告，以便更好地提醒开发者

  /**
   * Device模块管理设备信息，用于获取手机设备的相关信息，如IMEI、IMSI、型号、厂商等。
   */
  window.plus.device = {
    /**
     * 设备的国际移动设备身份码
     * @description 由于 Web 无法获取 imei，因此参考 iOS 的标准，返回空字符串
     */
    imei: "",
    /**
     * 设备的国际移动用户识别码
     * @description 由于 Web 无法获取 imsi，因此参考 iOS 的标准，返回空字符串
     */
    imsi: "",
    /**
     * 设备的型号
     */
    model: getSystemInfoSync().model,
    /**
     * 设备的生产厂商
     * @description Web 很有可能拿不到，一般为空
     */
    vendor: getSystemInfoSync().brand,
    /**
     * 设备的唯一标识
     * @description 由于 Web 没有办法持久化存储 UUID，因此会随机生成一个 UUID 存放到 localStorage 当中，一旦缓存清除，那么会重新生成
     */
    uuid: getSystemInfoSync().uuid,
    /**
     * 发出蜂鸣声
     * @param {number} times 蜂鸣声重复的次数，默认发出一次蜂鸣声
     * @description 由于 Web 没有办法播放系统默认铃声，因此这里使用了一种取巧的办法，也就是使用 HTML5 Web Audio API 实现声音
     * 这里的代码参考了 http://www.zhangxinxu.com/wordpress/?p=6220 利用HTML5 Web Audio API给网页JS交互增加声音
     */
    beep: function(times) {
      if (!times || times < 1) {
        times = 1;
      }
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      // 创建音频上下文
      var audioCtx = new AudioContext();

      for (var i = 0; i < times; i++) {
        // 创建音调控制对象
        var oscillator = audioCtx.createOscillator();
        // 创建音量控制对象
        var gainNode = audioCtx.createGain();
        // 音调音量关联
        oscillator.connect(gainNode);
        // 音量和设备关联
        gainNode.connect(audioCtx.destination);
        // 音调类型指定为三角波
        oscillator.type = "triangle";
        // 当前音量设为 1
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        // 声音走起
        oscillator.start(i);
        // 0.5 秒后停止声音
        oscillator.stop(i + 0.5);
      }
    },
    /**
     * 拨打电话
     * @param {Object} number 要拨打的电话号码
     * @param {Object} confirm 是否需要用户确认后开始拨打电话
     * @description 由于 Web 页面只支持 href 形式的拨打电话，因此 confirm 参数将被忽略
     */
    dial: function(number, confirm) {
      window.location.href = "tel:" + number;
    },
    /**
     * 获取设备信息
     * @param {Object} options 回调
     */
    getInfo: function(options) {
      const info = {
        imei: "",
        imsi: "",
        uuid: getSystemInfoSync().uuid
      };
      if (options) {
        if (options.success) {
          options.success(info);
        }
        if (options.complete) {
          options.complete(info);
        }
      }
    },
    /**
     * 获取匿名设备标识符
     * @param {Object} options 回调
     * @description 由于该 API 仅支持 Android 10+，且仅支持部分厂商，此外 Web 也无法获取这些信息，因此直接全部返回失败
     */
    getOAID: function(options) {
      const error = {
        code: "999999",
        message: "Web 不支持获取匿名设备标识符"
      };
      if (options) {
        if (options.fail) {
          options.fail(error);
        }
        if (options.complete) {
          options.complete(error);
        }
      }
    },
    /**
     * 获取开发者匿名设备标识符
     * @param {Object} options 回调
     * @description 由于该 API 仅支持 Android 10+，且仅支持部分厂商，此外 Web 也无法获取这些信息，因此直接全部返回失败
     */
    getVAID: function(options) {
      const error = {
        code: "999999",
        message: "Web 不支持获取开发者匿名设备标识符"
      };
      if (options) {
        if (options.fail) {
          options.fail(error);
        }
        if (options.complete) {
          options.complete(error);
        }
      }
    },
    /**
     * 获取应用匿名设备标识符
     * @param {Object} options 回调
     * @description 由于该 API 仅支持 Android 10+，且仅支持部分厂商，此外 Web 也无法获取这些信息，因此直接全部返回失败
     */
    getAAID: function(options) {
      const error = {
        code: "999999",
        message: "Web 不支持获取应用匿名设备标识符"
      };
      if (options) {
        if (options.fail) {
          options.fail(error);
        }
        if (options.complete) {
          options.complete(error);
        }
      }
    },
    /**
     * 获取设备的系统音量
     * @description 由于 JS 无法获取系统音量，因此这里使用了取巧的办法，检索页面上的 video/audio 标签，然后读取它们的音量
     */
    getVolume: function() {
      var videoElement = document.querySelector("video");
      if (videoElement) {
        return videoElement.volume;
      }
      var audioElement = document.querySelector("audio");
      if (audioElement) {
        return audioElement.volume;
      }
      // 如果无法读取，默认为最大音量
      return 1;
    },
    /**
     * 获取程序是否一直保持唤醒（屏幕常亮）状态
     * @description JS 无法获取屏幕是否常亮的状态，因此这个值是模拟值
     */
    isWakelock: function() {
      console.warn("Web 无法实现 plus.device.isWakelock 来获取屏幕常亮状态");
      return false;
    },
    /**
     * 设置应用是否保持唤醒（屏幕常亮）状态
     * @param {Object} lock 是否设置程序一直保持唤醒状态
     * @description 目前，仅有 Firefox OS 实现了 requestWakeLock API，因此该功能只支持 Firefox 系统
     */
    setWakelock: function(lock) {
      if (window.navigator.requestWakeLock) {
        window.navigator.requestWakeLock("screen");
      } else {
        console.warn(
          "当前浏览器环境不支持 plus.device.setWakelock 设置屏幕常亮状态"
        );
      }
    },
    /**
     * 设置设备的系统音量
     * @param {Object} volume 设备的系统音量值
     * @description 与 `getVolume` 的思路相同
     */
    setVolume: function(volume) {
      var videoElement = document.querySelector("video");
      if (videoElement) {
        videoElement.volume = volume;
      }
      var audioElement = document.querySelector("audio");
      if (audioElement) {
        audioElement.volume = volume;
      }
    },
    /**
     * 设备振动
     * @param {Object} milliseconds 设备振动持续的时间
     */
    vibrate: function(milliseconds) {
      if (window.navigator.vibrate) {
        milliseconds = milliseconds || 500;
        window.navigator.vibrate(milliseconds);
      } else {
        console.warn("当前浏览器环境不支持 plus.device.vibrate 设备振动");
      }
    }
  };

  /**
   * Screen模块管理设备屏幕信息
   */
  window.plus.screen = {
    /**
     * 设备屏幕水平方向的密度
     * @description 由于获取真实、完整的 DPI 需要进行 DOM 操作，因此这里只是简单的采用 DPI = 96 x DPR 的算法来获取
     */
    dpiX: window.devicePixelRatio * 96,
    /**
     * 设备屏幕垂直方向的密度
     * @description 同上
     */
    dpiY: window.devicePixelRatio * 96,
    /**
     * 屏幕高度物理分辨率
     */
    height: getSystemInfoSync().screenHeight,
    /**
     * 屏幕宽度物理分辨率
     */
    width: getSystemInfoSync().screenWidth,
    /**
     * 屏幕高度逻辑分辨率
     */
    resolutionHeight:
      getSystemInfoSync().screenHeight / window.devicePixelRatio,
    /**
     * 屏幕宽度逻辑分辨率
     */
    resolutionWidth: getSystemInfoSync().screenWidth / window.devicePixelRatio,
    /**
     * 逻辑分辨率与物理分辨率的缩放比例
     */
    scale: window.devicePixelRatio,
    /**
     * 设置屏幕亮度
     * @param {Object} brightness 屏幕的亮度值
     */
    setBrightness: function(brightness) {
      console.warn("Web 不支持设置屏幕亮度 plus.screen.setBrightness");
    },
    /**
     * 获取屏幕亮度值
     */
    getBrightness: function() {
      console.warn("Web 不支持获取屏幕亮度值 plus.screen.getBrightness");
    },
    /**
     * 锁定屏幕方向
     * @param {Object} orientation 要锁定的屏幕方向值
     */
    lockOrientation: function(orientation) {
      var lockOrientation =
        window.screen.lockOrientation ||
        window.screen.msLockOrientation ||
        window.screen.mozLockOrientation;
      if (lockOrientation) {
        lockOrientation(orientation);
        return;
      }
      if (ScreenOrientation.lock) {
        ScreenOrientation.lock(orientation);
      }
    },
    /**
     * 解除锁定屏幕方向
     */
    unlockOrientation: function() {
      var unlockOrientation =
        window.screen.unlockOrientation ||
        window.screen.msUnlockOrientation ||
        window.screen.mozUnlockOrientation;
      if (unlockOrientation) {
        unlockOrientation();
        return;
      }
      if (ScreenOrientation.unlock) {
        ScreenOrientation.unlock();
      }
    }
  };

  window.plus.display = {
    /**
     * 应用可使用的屏幕高度逻辑分辨率
     */
    resolutionHeight: getSystemInfoSync().windowHeight,
    /**
     * 应用可使用的屏幕宽度逻辑分辨率
     */
    resolutionWidth: getSystemInfoSync().windowWidth
  };

  window.plus.networkinfo = {
    /**
     * 网络连接状态未知
     */
    CONNECTION_UNKNOW: 0,
    /**
     * 未连接网络
     */
    CONNECTION_NONE: 1,
    /**
     * 有线网络
     */
    CONNECTION_ETHERNET: 2,
    /**
     * 无线WIFI网络
     */
    CONNECTION_WIFI: 3,
    /**
     * 蜂窝移动2G网络
     */
    CONNECTION_CELL2G: 4,
    /**
     * 蜂窝移动3G网络
     */
    CONNECTION_CELL3G: 5,
    /**
     * 蜂窝移动4G网络
     */
    CONNECTION_CELL4G: 6,
    /**
     * 获取设备当前连接的网络类型
     * @description 因为 Web 基本上不支持离线观看，因此说明肯定是有网络的，所有默认会返回
     */
    getCurrentType: function() {
      const connection =
        window.navigator.connection || window.navigator.webkitConnection;
      var network = 3;
      if (connection) {
        var networkType = connection.type;
        if (networkType === "cellular" && connection.effectiveType) {
          networkType = connection.effectiveType.replace("slow-", "");
          if (networkType == "2g") {
            network = 4;
          } else if (networkType == "3g") {
            network = 5;
          } else if (networkType == "4g") {
            network = 6;
          }
        } else if (!["none", "wifi"].includes(networkType)) {
          network = 0;
        }
      } else if (navigator.onLine === false) {
        network = 1;
      }
      return network;
    }
  };

  window.plus.os = {
    /**
     * 系统语言信息
     */
    language: getSystemInfoSync().language,
    /**
     * 系统的名称
     */
    name: getSystemInfoSync().system,
    /**
     * 系统的供应商信息
     */
    vendor: getSystemInfoSync().platform,
    /**
     * 系统版本信息
     */
    version: getSystemInfoSync().platform
  };
})(mui, document, window);
