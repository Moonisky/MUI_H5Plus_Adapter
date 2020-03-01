# MUI_H5Plus_Adapter

基于 [MUI](https://dev.dcloud.net.cn/mui/) 框架实现的 [HTML5+](http://www.html5plus.org/#home) 兼容方案，通过 JavaScript 和 HTML DOM 的基础能力来模拟 HTML5+ 的各类 API，从而能够：

* 在 Web 运行 5+App（当然肯定存在兼容性问题）；
* 在编写 5+App 时，不必*特别*考虑原生系统和 Web 之间的差异；

## 目录

* [项目缘由](#项目缘由)
* [使用方法](#使用方法)
* [注意事项](#注意事项)
* [实现进度](#实现进度)
    * [Key](#Key)
    * [Storage](#Storage)
* [常见问题](#常见问题)

## 项目缘由

原先，我行的主移动应用是基于 5+App 框架而编写的，这也是当年大部分同行所采用的技术。项目组在此框架的基础上，实现了海量的功能和服务（截止目前，已经有超 100+ 页面和功能模块，累计代码超 30W+ 行）。多年来，该应用稳定有 10+ 以上的开发人员进行编码开发。随着微信小程序和公众号的发展，我们在小程序和公众号上进行了发力，推出了多个小程序，深受好评。因此，在此基础上，负责该移动应用的业务部门也期望将应用迁移到微信小程序和服务号 Web 上，拓宽渠道，增强营销。因此，任务便安排到我们组，在经过技术分析后，我们提出了几种技术方案：

* 使用目前我们已经熟练并大量运用的跨端开发框架 [Taro](https://taro.jd.com/)，参照已有的 API 和页面，完整重新开发一套多端适配的应用；
* 使用 DCloud 一脉相承的 [Uni-App](https://uniapp.dcloud.io/)，通过 Vue 与 HTML 高度亲密性，简单通过适配和修改实现多端适配的应用；
* 基于现有的 5+App，对其进行改写使得能在 Web 端运行，然后使用 [kbone](https://developers.weixin.qq.com/miniprogram/dev/extended/kbone/) 或者 `web-view` 之类的技术让 Web 能够在小程序端运行。

原本我们有四名开发人员来进行这个新项目的编写，并且业务部门要求的迁移功能并不复杂，我们基于「创新业务」的理念，选择方案一进行开发。然而随着其他项目的急迫上马，其余几位开发人员被调去开发别的项目，致使该项目只剩笔者一人（无奈...），经过三个月左右的开发，我们基本实现了初期功能（占应用完整功能的 10%），并进行了大量的技术积累（并未原模原样的照搬，只借用了 API，来了一个 Rebuild 和 Redesign）。然而年后回来发现，原先的 5+App 仍然还在同步开发新功能，并且进行了几次破坏性更新（包括新的加密机制、新的密码键盘、新的反欺诈模型、新的用户体系等等），很多工作被迫推倒重来。

考虑到由于本项目人手实在不足（我也有别的项目要完成），因此是没有办法完全重写这个庞然大物的，更何况原项目组也不愿意更换技术架构，因此，原先第一种方案只能腰斩，所幸积累了不少技术组件，可以运用到新的项目当中，也不能算是无用功（反正一点不慌，不影响绩效，![狗头](https://tse3-mm.cn.bing.net/th/id/OIP.qj16y_7fiRp1g7R3SCdhugHaHa?w=96&h=96&c=7&o=5&dpr=2&pid=1.7)）。因此，经过重复的技术论证之后，决定使用第三种方案，这样工作量大大减小，也能够合并到原项目的代码当中，由对方项目组进行维护，同时也能满足业务部门的需求。

在互联网上进行大量的搜索后，我们开始进行本项目的开发。考虑到可能会有人存在我们同样的需求和痛点（肯定有，项目组服务了不知道多少家同行了），因此经过申请批准后，将这个关键的 MUI H5Plus Adapter（MUI 5+ 适配器）模块开源出来，希望能够帮助大家。当然，里面的实现也会存在不合适的地方，如果有更好的想法，欢迎 PR！

## 使用方法

1. 将 `js/mui.plus.adapter.js` 或者 `dist/js/mui.plus.adapter.min.js` 拷贝至您项目中的合适位置，建议与 `mui.min.js` 同级；
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

1. 请确保页面正确完成了 `mui(.min).css` 和 `mui(.min).js` 的引入，本项目完全基于 MUI 进行的扩展，如果这两个基础文件没有正常引入，那么会导致扩展失效。
2. 如果您使用了 `nativeUI` 的 `pickDate` 等相关方法，那么也请确保页面正确完成了 `mui.picker.css`、`mui.picker.js`、`mui.poppicker.css` 和 `mui.poppicker.js` 的引入，因为这几个方法使用了 MUI 的 `picker` 组件，需要这几个文件的支持。
3. 同样，如果您使用了 `nativeUI` 的 `showWaiting` 等相关方法，那么请将本项目当中的 `dist/css/mui.waiting.css` 引入。

## 实现进度

> 注：已标记 (checked) 的项目表示代码已经实现，项目后面的符号表示 API 的适配程度：
> * ✅表示 JS 实现基本与 `plus` 一致，可能存在部分功能无法**完美**实现
> * ⚠️表示 JS 实现存在部分不一致的地方，部分传参或者功能无法实现
> * ❗️表示 JS 无法实现或者实现完全不一致或者没有效果

### Key

> Key管理设备按键事件

实现思路：`plus.key` 基本上是对「按键」进行的控制，这个操作在 Web 上有类似实现，但是表现大为不同。

方法：

- [x] [addEventListener](http://www.html5plus.org/doc/zh_cn/key.html#plus.key.addEventListener)：✅添加按键事件监听器。
- [x] [hideSoftKeybord](http://www.html5plus.org/doc/zh_cn/key.html#plus.key.hideSoftKeybord)：✅隐藏软键盘。
- [x] [setAssistantType](http://www.html5plus.org/doc/zh_cn/key.html#plus.key.setAssistantType)：⚠️设置辅助输入类型。
  > 这里使用了 `<input>` 标签的 `autocomplete` 属性来模拟实现，但是实际表现仍与原 API 不同，仅能借助浏览器的填充提示来完成软键盘上的辅助输入，但是内容无法控制。
- [x] [showSoftKeybord](http://www.html5plus.org/doc/zh_cn/key.html#plus.key.showSoftKeybord)：❗️显示软键盘。
  > 原实现中，iOS 需获取 DOM 中的 `<input>` 元素并调用其 `focus` 方法获取焦点才能主动弹出系统软键盘，而 Web 也是如此实现，因此参照 iOS，直接标记为不支持。
- [x] [removeEventListener](http://www.html5plus.org/doc/zh_cn/key.html#plus.key.removeEventListener)：✅移除按键事件监听器。

### Storage

> 管理应用本地数据，用于应用数据的保存和读取

实现思路：`plus.storage` 是基于持久化建立的数据存取模块，因此，我们使用 `localStorage` 来代替。`localStorage` 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。

方法：

- [x] [getLength](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getLength)：✅获取应用存储区中保存的键值对的个数。
- [x] [getItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getItem)：✅通过键(key)检索获取应用存储的值。
- [x] [setItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.setItem)：✅修改或添加键值(key-value)对数据到应用数据存储中。
- [x] [removeItem](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.removeItem)：✅通过key值删除键值对存储的数据。
- [x] [clear](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.clear)：✅清除应用所有的键值对存储数据。
- [x] [key](http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.key)：✅获取键值对中指定索引值的key值。

## 常见问题

***Q:** 还有很多 API 没有实现呢，能否加快点速度！*

**A:** 这个项目说实话也才刚启动，各个 API 需要经过严格测试才能够对外公开，我们内部实现的模块只有几个，其他需要补充和实现，希望理解~

***Q:** 这里面有很多实现不正确，有更好或者更合适的办法！*

**A:** 这个项目是基于我们的 5+App 运行的，很多地方也是只考虑了我们自己项目的适配，可能不适用于所有人，欢迎提 PR 共同改进~

***Q:** Could you please provide the English version?*

**A:** No. 因为使用 5+App 这个技术的，估计也只有国内玩家了吧……
