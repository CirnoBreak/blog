---
title: Vue坑之style设置为scoped后样式无法修改
tags: [Vue, 踩坑]
archives_title: Archives
categories: JavaScript
date: 2018-03-30
---

参考:

> 知乎专栏下的文章,[link](https://zhuanlan.zhihu.com/p/29266022)

这几天在尝试写一个`vue`的应用，用到了`element-ui`这个`ui`组件库，但是在开发过程中使用`element-ui`看到一些样式感觉需要修改，手动修改后才发现，改了之后完全没变化，后来才发现是`scoped`的问题。
原本打算修改`element-ui`下的带验证的`el-input`在输入后有内容的情况下`blur`后外边框变成绿色的样式，然后看了下审查元素，找到了`.el-form-item.is-success .el-input__inner`这个样式，但是，经过简单的修改比如：

```css
.el-form-item.is-success .el-input__inner {
  border-color: #dcdfe6;
}
```

完全不起作用，甚至加了`!important`都无效，后来参考了下知乎专栏下的一篇文章后，改成

```css
.el-form-item.is-success /deep/ .el-input__inner {
  border-color: #dcdfe6;
}
```

后就起作用了,还有一种改写方法是把`/deep/`改成`>>>`
