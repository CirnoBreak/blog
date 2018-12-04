---
title: node爬虫之尝试puppeteer
tags: [Javascript, 爬虫]
archives_title: Archives
categories: JavaScript
date: 2018-04-12
---
参考
> puppeteer[官方文档](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)
> [译] JavaScript 自动化爬虫入门指北,[link](https://juejin.im/post/5a4e1038f265da3e591e1247)
> 爬虫利器 Puppeteer 实战,[link](https://cnodejs.org/topic/5a4d8d2299d207fa49f5cbbc)


前段时间在看一本叫`《Python编程快速上手》`的书，里面有一节就介绍到了`简单的爬虫`，用`request+BeautifulSoup`实现一个简单的漫画网站爬虫，感觉`python`爬虫挺强大的，然后想到以前看`node.js`的时候也有相关的用`cheerio`实现的`爬虫`，但是太久没接触就忘了。然后最近无聊逛掘金的时候发现了一个叫`puppeteer`的库，简单了解了之后就跟着一些文章的案例尝试做了几个简单的`demo`，感觉`puppeteer`的功能还是很强大的，不仅可以`爬取信息`，还可以实现`模拟点击、输入，截图、打印pdf`等功能。

在官方文档中，`puppeteer`的初始化代码如下:
``` javascript
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await browser.close();
});
```
其中`launch`可以添加比如`{headless: false}`等参数，`headless`改成`false`之后默认打开`chromium`操作。`launch`后传入的`browser`实例通过`browser.newPage()`来创建一个`新的页面`，然后通过`page.goto(url)`打开对应`url`的标签页，标签页加载完后执行browser.close()关闭浏览器。

下面来说一下一些在练习过程中用到过的`api`:
page.waitForFunction(pageFunction[, options[, ...args]])
`puppeteer`的`延时api`，通过传入指定数值可以实现延时对应`毫秒`效果,比如`page.waitFor(2000)`就是延时`2000毫秒`，通常用于`page.goto()`后面来确保页面完全加载，也可以传入选择器或者函数作为参数。

page.$(selector)
相当于运行`document.querySelector`,选择`单个`元素的选择器，通常搭配比如模拟点击等，参数为空默认返回[]

page.$$(selector)
相当于运行`document.querySelectorAll`,选择`多个`元素的选择器，参数为空返回[]

page.click(selector[, options])
`模拟点击`的api，通过传入指定的选择器可以实现对应选择器的`模拟点击`。

page.screenshot([options])
`puppeteer`的页面`截图api`，可以通过传入对应的options对象来实现对应的效果，比如`page.screenshot({path: './test.jpg'})`就是截图保存到当前目录，截图名字为test.jpg,除此之外还有以下options属性:
`type`: 指定截图类型，比如`jpg`或者`png`，默认是`png`
`quality`: 截图质量，`0-100`之间
`fullpage`: 设置为`true`则截取所有可滚动范围，也就是`整个页面`
`clip`: 用于设置截图范围，对应的属性有`x、y、width、height`
`omitBackground`: 去掉默认白背景，并且允许透明背景截图

page.pdf(options)
把页面保存为`pdf的api`，传入比如`{path: 'xxx'}`就是保存当对应路径，详细参数参考[puppeteer官方文档](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)

page.frames()
获取所有`frames`对象比如`iframe`，这个api是看cnode一个爬取网易云音乐歌词评论的爬虫demo了解到的，因为网易云用的是`iframe`所以可以通过这个api去爬取对应的`iframe`。通过`page.frames().then(f => f.name() === 'xx')`可以定位到对应的`name`为xxx的`iframe`。

page.evaluate(pageFunction, ...args)
用于计算对应选择器里面的相对应的数据，其中第二个参数作为第一个参数的函数所传入的参数。puppeteer官方文档的例子如下:
``` javascript
const bodyHandle = await page.$('body');
const html = await page.evaluate(body => body.innerHTML, bodyHandle);
```
如果单纯用pageFunction的话，可以写成:
``` javascript
const html = await page.evaluate(() => {
  const bodyEle = document.querySelector('body');
  return bodyEle.map(v => v.innerHTML);
});
```
也可以写成:
``` javascript
const html = await page.evaluate(() => {
  let data = [];
  const bodyEle = document.querySelector('body');
  for (ele of eles) {
    let text = ele.innerHTML;
    data.push(text)
  }
  return data;
});
```

page.$eval(selector, pageFunction[, ...args])
用于计算单个元素的选择器对应的数据，相当于`evaluate`传入第二个参数为单选择器。下面用爬取网易云音乐demo中的片段作为例子:
使用evaluate的写法:
``` javascript
const LYRIC_SELECTOR = await iframe.$('#lyric-content');
const lyricCtn = await iframe.evaluate(e => {
  return e.innerText;
}, LYRIC_SELECTOR);
```
使用page.$eval:
``` javascript
const lyricCtn = await iframe.$eval('#lyric-content', e => {
  return e.innerText;
});
```
两种写法等价

page.$$eval(selector, pageFunction[, ...args])
与$eval的区别是他选择的是`多个`元素的选择器,同样举爬取网易云demo的例子:
``` javascript
const commentList = await iframe.$$eval('.itm', elements => {
  const ctn = elements.map(v => {
    return v.innerText.replace(/\s/g, '');
  });
  return ctn;
});
```
page.close()
`关闭`当前标签页