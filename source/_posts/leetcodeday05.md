---
title: leetcode day05 - 分糖果 II
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-05
---

## 题目地址

[https://leetcode-cn.com/problems/distribute-candies-to-people/](https://leetcode-cn.com/problems/distribute-candies-to-people/)

# 题目描述

排排坐，分糖果。

我们买了一些糖果 **candies**，打算把它们分给排好队的 **n = num_people** 个小朋友。

给第一个小朋友 1 颗糖果，第二个小朋友 2 颗，依此类推，直到给最后一个小朋友 **n** 颗糖果。

然后，我们再回到队伍的起点，给第一个小朋友 **n + 1** 颗糖果，第二个小朋友 **n + 2** 颗，依此类推，直到给最后一个小朋友 **2 * n** 颗糖果。

重复上述过程（每次都比上一次多给出一颗糖果，当到达队伍终点后再次从队伍起点开始），直到我们分完所有的糖果。注意，就算我们手中的剩下糖果数不够（不比前一次发出的糖果多），这些糖果也会全部发给当前的小朋友。

返回一个长度为 **num_people**、元素之和为 **candies** 的数组，以表示糖果的最终分发情况（即 **ans[i]** 表示第 i 个小朋友分到的糖果数）。

示例 1：

```
输入：candies = 7, num_people = 4
输出：[1,2,3,1]
解释：
第一次，ans[0] += 1，数组变为 [1,0,0,0]。
第二次，ans[1] += 2，数组变为 [1,2,0,0]。
第三次，ans[2] += 3，数组变为 [1,2,3,0]。
第四次，ans[3] += 1（因为此时只剩下 1 颗糖果），最终数组变为 [1,2,3,1]。
```

示例 2：

```
输入：candies = 10, num_people = 3
输出：[5,2,3]
解释：
第一次，ans[0] += 1，数组变为 [1,0,0]。
第二次，ans[1] += 2，数组变为 [1,2,0]。
第三次，ans[2] += 3，数组变为 [1,2,3]。
第四次，ans[0] += 4，最终数组变为 [5,2,3]。
```

# 解题思路

## 暴力枚举

这道题比较简单，只需要记录好每次要分的糖果数即可，每分一次减一次剩余糖果数。注意分到最后一个小朋友的时候的数量肯定是小于等于剩余糖果数，所以简单的处理方式就是每次分都判断一下当前剩余的糖果数跟要分的糖果数哪个更少就分哪个即可。

**代码**

```javascript
/**
 * @param {number} candies
 * @param {number} num_people
 * @return {number[]}
 */
var distributeCandies = function (candies, num_people) {
  // 初始化数组
  const arr = Array.from({ length: num_people }).fill(0);
  // 每次要分的糖果数
  let i = 1;
  while (candies != 0) {
    // i % num_people 用于获取当前分到的小朋友的下标
    // 由于要判断是否分到最后一个小朋友，所以这里判断要分的糖果数和剩下的糖果数哪个数量更少，就分哪个
    arr[i % num_people] += Math.min(i, candies)
    candies -= Math.min(i, candies)
    // 新一轮分糖果开始，要分的糖果数量 + 1
    i++
  }
  return arr;
};
```