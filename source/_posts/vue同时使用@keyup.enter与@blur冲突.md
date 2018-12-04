---
title: Vue同时使用@keyup.enter与@blur冲突
tags: [Vue, 坑]
archives_title: Archives
categories: JavaScript
date: 2018-08-30
---

# vue同时使用@keyup.enter与@blur冲突

参考
> https://www.jianshu.com/p/1d94bb8be9c3

最近在项目开发过程中，要实现一个可编辑标签。在提交修改的时候，需要做到按回车跟失去焦点都可以触发提交请求的操作，但是，在同一个标签上写@keyup.enter与@blur的时候，分别写单独的事件，会发现，按下回车的时候，不仅触发了@keyup.enter的事件，还触发了@blur的事件。

未修改前(冲突)
```html
<span
    class="editTag"
    :id="tag.id"
    :data-id="tag.foodId+'-'+tag.orderNo"
    v-if="editable"
    @click="preventSwitch"
    @keydown.enter="editTagName($event, tag.name)"
    slot="label"
    @blur="editTagName($event, tag.name)"
    contenteditable="true">
    {{tag.name}}
</span>
```
修改后，回车时直接调用了blur，避免冲突
```html
<span
    class="editTag"
    :id="tag.id"
    :data-id="tag.foodId+'-'+tag.orderNo"
    v-if="editable"
    @click="preventSwitch"
    @keydown.enter="$event.target.blur"
    slot="label"
    @blur="editTagName($event, tag.name)"
    contenteditable="true">
    {{tag.name}}
</span>
```