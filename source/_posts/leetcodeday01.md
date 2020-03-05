---
title: leetcode day01 - 用队列实现栈
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-01
---

# 题目地址

[https://leetcode-cn.com/problems/implement-stack-using-queues/](https://leetcode-cn.com/problems/implement-stack-using-queues/)

# 题目描述

使用队列实现栈的下列操作：

push(x) -- 元素 x 入栈
pop() -- 移除栈顶元素
top() -- 获取栈顶元素
empty() -- 返回栈是否为空

注意:

你只能使用队列的基本操作-- 也就是  push to back, peek/pop from front, size, 和  is empty  这些操作是合法的。
你所使用的语言也许不支持队列。  你可以使用 list 或者 deque（双端队列）来模拟一个队列  , 只要是标准的队列操作即可。
你可以假设所有操作都是有效的（例如, 对一个空的栈不会调用 pop 或者 top 操作）。

# 解题思路

## 简单解法(非 api)

用一个数组模拟栈(LIFO)，数组末尾为栈顶，数组头为栈底。

1. 实现 top 只需获取数组末尾元素。
2. 实现 push 只需在数组末尾添加元素。
3. pop 的实现，首先是获取数组最后一个元素，并且需要对数组长度减一来实现数组删除最后一个元素的操作。
4. 实现 empty 只需要判断数组是否为空即可。

**代码：**

```javascript
/**
 * 初始化
 */
var MyStack = function() {
  this.stack = [];
};

/**
 * 把元素 x 压入栈
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
  this.stack[this.stack.length] = x;
};

/**
 * 移出栈顶元素并且返回该元素
 * @return {number}
 */
MyStack.prototype.pop = function() {
  const ele = this.stack[this.stack.length - 1];
  this.stack.length = this.stack.length - 1;
  return ele;
};

/**
 * 直接获取栈顶元素
 * @return {number}
 */
MyStack.prototype.top = function() {
  return this.stack[this.stack.length - 1];
};

/**
 * 返回栈是否为空的布尔值
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
  if (this.stack.length === 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
```
