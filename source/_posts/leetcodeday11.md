---
title: leetcode day11 - 将数组分成和相等的三个部分
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-11
---

# 题目地址

[https://leetcode-cn.com/problems/partition-array-into-three-parts-with-equal-sum/](https://leetcode-cn.com/problems/partition-array-into-three-parts-with-equal-sum/)

# 题目描述

给你一个整数数组  A，只有可以将其划分为三个和相等的非空部分时才返回  true，否则返回 false。

形式上，如果可以找出索引  i+1 < j  且满足  (A[0] + A[1] + ... + A[i] == A[i+1] + A[i+2] + ... + A[j-1] == A[j] + A[j-1] + ... + A[A.length - 1])  就可以将数组三等分。

示例 1：

```
输出：[0,2,1,-6,6,-7,9,1,2,0,1]
输出：true
解释：0 + 2 + 1 = -6 + 6 - 7 + 9 + 1 = 2 + 0 + 1
```

示例 2：

```
输入：[0,2,1,-6,6,7,9,-1,2,0,1]
输出：false
```

示例 3：

```
输入：[3,3,6,5,-2,2,5,1,-9,4]
输出：true
解释：3 + 3 = 6 = 5 - 2 + 2 + 5 + 1 - 9 + 4
```

# 解题思路

## 遍历法

由题意可知，要分成和相等的三部分，首先需要需要计算出整个的数组元素之和 sum，除以三得到每一部分的元素之和。有一种特殊情况是，数组之和为 0，可以分成大于或者等于和相等的部分。我们可以用声明一个变量 equalCount 来记录和相等的分组数，用于判断是否符合条件，tmp 用于记录临时的数组部分之和，用于判断是否符合等分条件。因此只需要在遍历的时候，判断当前部分累加之和是否等于 sum / 3，符合就给 equalCount + 1，直到最后，判断 equalCount 是否大于或者等于 3 即可（大于 3 的情况是数组之和 sum 为 0 的情况）。

**代码：**
```javascript
/**
 * @param {number[]} A
 * @return {boolean}
 */
var canThreePartsEqualSum = function(A) {
  // 数组元素之和
  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    sum += A[i];
  }
  // 数组部分和 tmp， 目标 target，符合条件的分组数 equalCount
  let tmp = 0,
    target = sum / 3,
    equalCount = 0;
  for (let j = 0; j < A.length; j++) {
    tmp += A[j];
    // 如果符合条件，equalCount + 1，并清空数组的部分和tmp
    if (tmp === target) {
      tmp = 0;
      equalCount++;
    }
  }
  return equalCount >= 3;
};
```
