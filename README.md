# MUI_H5Plus_Adapter

基于 [MUI](https://dev.dcloud.net.cn/mui/) 框架实现的 [HTML5+](http://www.html5plus.org/#home) 兼容，通过 JavaScript 和 HTML DOM 的基础能力来模拟 HTML5+ 的各类 API，从而能够：

* 使 5+App 能够在 Web 运行（当然肯定存在兼容性问题）；
* 在写 5+App 时，不必特别考虑原生系统和 Web 的差异；

## 项目缘由

原先企业的移动 App 是基于 5+App 来进行编写的，并在此基础上实现了海量的功能和服务（超 100+ 页面和功能模块），基本上有 10+ 的开发人员参与编写。随着微信小程序和公众号的发展，以及其他业务部门在小程序和公众号上的发力（真实原因...笑），该 App 的负责部门期望将应用迁移到微信小程序和公众号 Web 上，拓宽业务范围，因此，任务安排到我们创新业务组来，致使我们面临着以下几个选择：

* 使用目前我们已经熟练并大量运用的跨端开发框架 [Taro](https://taro.jd.com/)，参照已有的 API 和页面，完整重新开发一套多端适配的应用；
* 使用 DCloud 一脉相承的 [Uni-App](https://uniapp.dcloud.io/)，通过适配和修改实现多端适配的应用；
* 基于现有的 5+App，对其进行改写使得能在 Web 端运行，然后使用 [kbone](https://developers.weixin.qq.com/miniprogram/dev/extended/kbone/) 或者 `web-view` 之类的技术让 Web 能够在小程序端运行。

由于本项目的人员只有四个人（另外三位不久前还调去鼓捣别的项目了，无奈...），我们使用方案一，经过三个月的紧张编写后，实现了大概 10% 的功能点。然而年后发现，原先的 5+App 仍然还在同步开发新功能，并且进行了几次破坏性更新（包括新的加密机制、新的密码键盘、新的反欺诈模型、新的用户体系等等），很多工作被迫推到重来。展望未来，发现仅凭几个人（更何况现在就我一个了），是没有办法完全重写这个庞然大物的，更何况那边的项目组也不愿意更换（人微言轻等因素），因此经过多番技术论证之后，决定使用第三个方案，这样各方都比较开心和满意。

在互联网上进行大量的搜索后，考虑到可能也会有人存在我们同样的需求和痛点（肯定有，5+App 的这个外包项目组所在的公司，服务了不知道多少家企业了），因此经过向公司申请批准后，将这个关键的 MUI H5Plus Adapter（MUI 5+ 适配器）模块开源出来，希望能够帮助大家。当然，里面的实现也会存在不合适的地方，如果有更好的想法，欢迎 pr！

## 使用办法

1. 将 `js/mui.plus.adapter.js` 或者 `js/mui.plus.adapter.min.js` 拷贝至您项目中的合适位置，建议与 `mui.min.js` 同级；
2. 在引入 `mui.min.js` 的 HTML 页面当中，将这个 JS 文件也引入到 HTML 页面当中，注意，引入顺序需要位于 `mui.min.js` 之后，例如：
```html
<script src="../js/common/mui.min.js" type="text/javascript" charset="UTF-8"></script> 
<script src="../js/common/mui.plus.adapter.js" type="text/javascript" charset="UTF-8"></script>
```
3. 如果您依赖于 `runtime` 的各项功能，那么建议您在主页面的 JS 文件中增加以下方法：
```js
mui.ready(function() {
  mui.adapterReady(); // 通知适配器初始化完毕
});
```

## 注意事项

1. 请确保页面正确完成了 `mui.min.css` 和 `mui.min.js` 的引入，本项目完全基于 MUI 进行的扩展，如果这两个基础文件没有正常引入，那么会导致扩展失效。
2. 如果您使用了 `nativeUI` 的 `pickDate` 等相关方法，那么也请确保页面正确完成了 `mui.picker.css`、`mui.picker.js`、`mui.poppicker.css` 和 `mui.poppicker.js` 的引入，因为这几个方法使用了 MUI 的 `picker` 组件，需要这几个文件的支持。
3. 同样，如果您使用了 `nativeUI` 的 `showWaiting` 等相关方法，那么请将本项目当中的 `css/mui.waiting.css` 引入。

## 实现进度

> 注：已标记 (checked) 的项目表示代码已经实现，项目后面的符号表示 API 的适配程度：
> * ✅表示 JS 实现基本与 `plus` 一致，可能存在部分功能无法**完美**实现
> * ⚠️表示 JS 实现存在部分不一致的地方，部分传参或者功能无法实现
> * ❗️表示 JS 无法实现或者实现完全不一致或者没有效果
> 具体的实现规则、逻辑和说明可以点击项目后面的「查看详情」查看。

### Storage

> 管理应用本地数据，用于应用数据的保存和读取

实现思路：`plus.storage` 是基于持久化建立的数据存取模块，因此，我们使用 `localStorage` 来代替。`localStorage` 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。

方法：

- [x] [getLength](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getLength)：✅获取应用存储区中保存的键值对的个数，[查看详情]()。
- [x] [getItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getItem)：✅通过键(key)检索获取应用存储的值，[查看详情]()。
- [x] [setItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.setItem)：✅修改或添加键值(key-value)对数据到应用数据存储中，[查看详情]()。
- [x] [removeItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.removeItem)：✅通过key值删除键值对存储的数据，[查看详情]()。
- [x] [clear](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.clear)：✅清除应用所有的键值对存储数据，[查看详情]()。
- [x] [key](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.key)：✅获取键值对中指定索引值的key值，[查看详情]()。

## 常见问题

***Q:** 这里面有很多实现不正确，有更好或者更合适的办法！*

**A:** 这个项目是基于我们的 5+App 运行的，很多地方也是只考虑了我们自己项目的适配，可能不适用于所有人，欢迎提 PR 共同改进~

***Q:** Could you please provide the English version?*

**A:** No. 因为使用 5+App 这个技术的，估计也只有国内玩家了吧……
