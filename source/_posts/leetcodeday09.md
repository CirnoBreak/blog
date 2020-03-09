---
title: leetcode day09 - 买卖股票的最佳时机
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-09
---

# 题目地址

https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/

# 题目描述

给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票），设计一个算法来计算你所能获取的最大利润。

注意你不能在买入股票前卖出股票。

示例 1:

```
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```

示例 2:

```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

# 解题思路

## 暴力枚举

暴力枚举比较简单，就是一直与之前的天数做减法运算，与临时变量 max 做对比，存放更大的值。

**代码：**
```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  // 存放最大值的临时变量
  let max = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i; j < prices.length; j++) {
      // 求差值
      const delta = prices[j] - prices[i];
      // 判断是否为当前最大值
      if (delta > max) {
        max = delta;
      }
    }
  }
  return max;
};
```

## 一次遍历

只需通过一次遍历，每一天记录当天以及之前的买入价最低点和当天为止的最大利润。
使用 minPrice 存放当天及之前的最低点价格，初始为无限大确保能在对比是赋值更小的值。
使用 maxPrice 存放最大利润，如果当天价格没达到最低点，则计算当天与最低点的差值，并且与当前的 maxPrice 作比较，取两者较大值作为下一天的临时最大利润。

参考其中一个题解的动图 [link](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/solution/gu-piao-wen-ti-python3-c-by-z1m/)
![](https://pic.leetcode-cn.com/4eaadab491f2bf88639d66c9d51bb0115e694ae08d637841ac18172b631cb21f-0121.gif)

**代码：**
```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  // 价格最低点和最大利润
  let minPrice = Infinity,
    maxPrice = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      // 如果当天价格比最低点要小，把当天价格赋值给最低点
      minPrice = prices[i];
    } else {
      // 取出当天价格与最低点的差值与临时最大利润做对比，取出两者最大值作为新的临时最大利润
      maxPrice = Math.max(prices[i] - minPrice, maxPrice);
    }
  }
  return maxPrice;
};
```