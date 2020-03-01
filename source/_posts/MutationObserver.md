---
title: 从B站弹幕列表加载来了解DOM观察者-MutationObserver
tags: [Javascript]
archives_title: Archives
categories: Javascript
date: 2019-01-20
---

最近在用哔哩哔哩新版播放器的时候感觉十分别扭，侧边有广告，弹幕列表，由于习惯了旧版的默认展开个人不太习惯新版的，就开始打算写一个隐藏侧边广告+默认展开弹幕列表的小脚本，但在编写过程中并不顺利。因为 B 站他们使用的是 SSR 做首屏渲染，首次加载的是骨架屏，服务端渲染的弹幕列表只是一个占位的 div，并没有任何内容，随着后续的客户端渲染才慢慢加载 DOM 元素，但是这到底要怎么做才能去监听它 DOM 变化到渲染出弹幕列表 div 的时候呢？随后我习惯性地使用了 google 去搜索相关的方案，然后找到了一个监听 DOM 树更改的 API - MutationObserver。

MutationObserver 这个 API 是用来监听 DOM 变动的，DOM 发生的任何变动，比如结点的增减、属性的变动、文本内容的变动都可以从这个 API 上得到通知。它跟事件很接近，但是它跟事件有一个本质的不同点是:事件是同步触发的，即 DOM 变动立马触发相应事件，而 MutationObserver 是异步触发的，DOM 变动不会立马触发，而要等到所有 DOM 操作结束后才触发，这样的设计可以应付 DOM 频繁的变动。

MutationObserver API 的特点:

1. 异步触发，等所有 DOM 操作结束后才触发。
2. 把 DOM 变动记录封装成一个数组处理，而不是一条条个别处理 DOM 变动。
3. 它可以观察 DOM 的所有类型的变动，也可以指定只观察某一类变动。

下面用 MDN 文档下 MutationObserver 的示例代码来展示一下这个 API 的实际效果，首先我们尝试监听哔哩哔哩新版播放器的 `div.danmaku-wrap` ，暂时先移除`observer.disconnect()`方法，然后在 tampermonkey 下添加脚本，代码如下:

```js
(function() {
  "use strict";
  // 被观察的目标节点
  const targetNode = document.querySelector(".danmaku-wrap");

  // observer选项
  const config = { attributes: true, childList: true, subtree: true };

  // 目标dom发生变动时执行的回调函数
  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type == "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type == "attributes") {
        console.log(
          "The " + mutation.attributeName + " attribute was modified."
        );
      }
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

此时，随意在 b 站打开一个视频，并确保播放器切换到新版的情况下，用`cmd/ctrl + shift + j` 打开控制台，等待`div.damaku-wrap`渲染后会看到以下输出:
{% asset_img danmaku1.png danmaku1 %}

由于以上代码设置了监听元素 style 跟 DOM 树元素增删变化，所以会看到关于两者变化的相关输出动作，这些动作都存放在 mutationList 数组里。

但是，又到底怎么样才知道弹幕列表里面的内容 div 被渲染呢？

接下来我们修改下代码，只监听元素节点变动：

```js
(function() {
  "use strict";
  // 被观察的目标节点
  const targetNode = document.querySelector(".danmaku-wrap");

  // observer选项
  const config = { childList: true, subtree: true };

  // 目标dom发生变动时执行的回调函数
  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      console.log("mutation", mutation);
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

继续刷新页面，等待输出。输出结果如下:
{% asset_img danmaku2.png danmaku2 %}

此时我们可以看到每次 DOM 结点变动的详细信息，但是我们又该怎么知道到底什么时候才渲染出弹幕列表(-\_-)ゞ？

此时我们使用了`Chrome Dev Tools` 的 `Inspector` 找到了弹幕列表 body 的相应元素`div.bui-collapse-body`。
{% asset_img danmaku3.png danmaku3 %}
好了，现在找到了主要目标，但是接下来又该怎么做？

我们再次修改代码，此时我们主要是看在这个变动列表里面，何时才会渲染出`div.player-auxiliary`。

```js
(function() {
  "use strict";
  // 被观察的目标节点
  const targetNode = document.querySelector(".danmaku-wrap");

  // observer选项
  const config = { childList: true, subtree: true };

  // 实例化观察者
  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      console.log("mutation", mutation);
      console.log(document.querySelector(".player-auxiliary"));
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

再次刷新，我们从控制台可以看出来，在第二次 dom 变动的时候渲染出了`div.player-auxiliary`。
{% asset_img danmaku4.png danmaku4 %}
但并不是永远是第二次，在我调试的时候，有视频选集的页面可能并不会是第二次，所以我们继续寻找线索。

展开第二次输出的信息，我们把`player-auxiliary`字符串以及它是`class`作为线索，轻易的找到了它所在的位置：
{% asset_img danmaku5.png danmaku5 %}
它就在`mutation.target.classList`里，此时使用 value 属性做判断条件比较简单，再次修改下代码：

```js
(function() {
  "use strict";
  // 被观察的目标节点
  const targetNode = document.querySelector(".danmaku-wrap");

  // observer选项
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      console.log("mutation", mutation);
      console.log(
        "find dom",
        mutation.target.classList.value.includes("player-auxiliary")
      );
      console.log(document.querySelector(".player-auxiliary"));
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

我们再回来看看 console ，发现自从找到它之后，每次都会输出 true。
{% asset_img danmaku6.png danmaku6 %}
该如何避免频繁的判断?

此时借助 flag，当 flag 为 true 后就不再输出 found。来让它找到之后就不再执行。

```js
(function() {
  "use strict";
  // 被观察的目标节点
  const targetNode = document.querySelector(".danmaku-wrap");

  // observer选项
  const config = { childList: true, subtree: true };

  // 目标dom发生变动时执行的回调函数
  const callback = function(mutationsList) {
    let flag;
    for (let mutation of mutationsList) {
      console.log("mutation", mutation);
      if (
        !flag &&
        mutation.target.classList.value.includes("player-auxiliary")
      ) {
        console.log(
          "find dom",
          mutation.target.classList.value.includes("player-auxiliary")
        );
        flag = true;
      }
      console.log(document.querySelector(".player-auxiliary"));
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

从输出结果可以看出 found 现在找到之后就不再执行了。
{% asset_img danmaku7.png danmaku7 %}

最后，实现弹幕列表自动展开这功能就很简单了，只需要在 if 判断里面执行 弹幕列表 header 的 click 事件即可。代码整理一下，最终的函数如下。

```js
(function() {
  "use strict";
  // 简单地抽离一下querySelector函数
  const selector = selector => document.querySelector(selector);

  // 被观察的目标节点
  const targetNode = selector(".danmaku-wrap");

  // 目标dom发生变动时执行的回调函数
  const config = { childList: true, subtree: true };

  // 判断是否找到弹幕列表(是否加载出来)
  const findDom = target => {
    return target.classList.value.includes("player-auxiliary");
  };

  // 实例化观察者
  const callback = function(mutationsList) {
    let flag;
    for (let mutation of mutationsList) {
      const target = mutation.target;
      if (!flag && findDom(target)) {
        // 找到后触发弹幕列表标题点击事件
        selector(".bui-collapse-header").click();
        flag = true;
        // 停止观察
        observer.disconnect();
      }
    }
  };

  // 实例化观察者
  const observer = new MutationObserver(callback);

  // 开始观察
  observer.observe(targetNode, config);
})();
```

参考:

> [MDN 文档 MutationObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) > [Javascript 标准参考教程 - Mutation Observer API](http://javascript.ruanyifeng.com/dom/mutationobserver.html)
