/**
 * MUI H5+ 适配插件 - Storage
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
   * Storage模块管理应用本地数据存储区，用于应用数据的保存和读取。
   * @description 我们使用 localStorage 来代替，localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。
   */
  window.plus.storage = {
    /**
     * 获取应用存储区中保存的键值对的个数
     */
    getLength: function() {
      return localStorage.length;
    },
    /**
     * 通过键(key)检索获取应用存储的值
     * @param {String} key 存储的键值
     */
    getItem: function(key) {
      return localStorage.getItem(key);
    },
    /**
     * 修改或添加键值(key-value)对数据到应用数据存储中
     * @param {String} key 存储的键值
     * @param {String} value 存储的内容
     */
    setItem: function(key, value) {
      localStorage.setItem(key, value);
    },
    /**
     * 通过key值删除键值对存储的数据
     * @param {String} key 存储的键值
     */
    removeItem: function(key) {
      localStorage.removeItem(key);
    },
    /**
     * 清除应用所有的键值对存储数据
     */
    clear: function() {
      localStorage.clear();
    },
    /**
     * 获取键值对中指定索引值的key值
     * @param {Number} index 存储键值的索引
     */
    key: function(index) {
      return localStorage.key(index);
    }
  };
})(mui, document, window);
