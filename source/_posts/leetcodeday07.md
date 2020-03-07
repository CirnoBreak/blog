---
title: leetcode day07 - 队列的最大值
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-07
---

# 题目地址

[https://leetcode-cn.com/problems/dui-lie-de-zui-da-zhi-lcof/](https://leetcode-cn.com/problems/dui-lie-de-zui-da-zhi-lcof/)

# 题目描述

请定义一个队列并实现函数 **max_value** 得到队列里的最大值，要求函数**max_value**、**push_back** 和 **pop_front** 的均摊时间复杂度都是O(1)。

若队列为空，**pop_front** 和 **max_value** 需要返回 -1

示例 1：

```
输入: 
["MaxQueue","push_back","push_back","max_value","pop_front","max_value"]
[[],[1],[2],[],[],[]]
输出: [null,null,null,2,1,2]
```

示例 2：

```
输入: 
["MaxQueue","pop_front","max_value"]
[[],[],[]]
输出: [null,-1,-1]
```

# 解题思路

## 双端队列

初始化两个队列，原始队列 queue ，就是正常的进队出队，另一个是辅助数组 deque ，存放最大值和小于最大值的值(降序排序)。
1. 进队(push_back)时，当前值 push 进原始队列 queue，同时拿当前值与辅助队列最后一个值进行对比，如果比最后一个值大，删掉最后一个值，继续上述操作直到数组为空或者找到比当前值大的值，push进辅助队列；如果开始就比当前值大或者开始 deque就为空，push 进deque。辅助队列主要是为了方便取最大值和pop_front的时候假如删除最大值可以保证取到下一轮的最大值。
2. 出队(pop_front)时，直接删除原始队列 queue的第一个值即可，同事确保第一个值是否与 辅助队列 deque第一个值相等，如果相等，同时删掉 deque 的第一个值。
3. 取最大值 max_value，根据上述可以知道直接取辅助队列 deque 第一个值即可，辅助队列为空时返回-1。

参考 leetcode其中一个题解的动图 [link](https://leetcode-cn.com/problems/dui-lie-de-zui-da-zhi-lcof/solution/ru-he-jie-jue-o1-fu-za-du-de-api-she-ji-ti-by-z1m/)

![](https://pic.leetcode-cn.com/9d038fc9bca6db656f81853d49caccae358a5630589df304fc24d8999777df98-fig3.gif)

```javascript
var MaxQueue = function() {
  // 原始队列，只处理进队出队
  this.queue = [];
  // 辅助队列，存放最大值和较大值(降序排序)
  this.deque = [];
};

/**
 * @return {number}
 */
MaxQueue.prototype.max_value = function() {
  if (this.deque.length) {
    return this.deque[0];
  }
  return -1;
};

/** 
 * @param {number} value
 * @return {void}
 */
MaxQueue.prototype.push_back = function(value) {
  // 直接向原始队列存值
  this.queue.push(value);
  // 从辅助队列末尾开始对比，删掉比当前值小的值
  while (this.deque.length && this.deque[this.deque.length - 1] < value) {
    this.deque.pop();
  }
  // 往辅助队列存值
  this.deque.push(value);
};

/**
 * @return {number}
 */
MaxQueue.prototype.pop_front = function() {
  if (this.queue.length) {
    // 删掉原始队列第一个值
    const val = this.queue.shift();
    // 如果辅助队列第一个值跟当前值相等，删掉辅助队列第一个值
    if (val === this.deque[0]) {
      this.deque.shift();
    }
    return val;
  }
  return -1;
};

/**
 * Your MaxQueue object will be instantiated and called as such:
 * var obj = new MaxQueue()
 * var param_1 = obj.max_value()
 * obj.push_back(value)
 * var param_3 = obj.pop_front()
 */
```