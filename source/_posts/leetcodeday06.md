---
title: leetcode day06 - 和为s的连续正数序列
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-06
---

# 题目地址

[https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/](https://leetcode-cn.com/problems/
he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

# 题目描述

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。
 

示例 1：

```
输入：target = 9
输出：[[2,3,4],[4,5]]
```

示例 2：

```
输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```

# 解题思路

## 暴力枚举

暴力枚举的思路比较简单，注意遍历索引上限为target / 2向下取整即可。

**代码：**
```javascript
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  let arr = [];
  let sum = 0;
  for (let i = 0; i < target / 2; i++) {
    for (let j = i + 1; j < target; j++) {
      sum += j;
      if (sum > target) {
        sum = 0;
        break;
      } else if (sum === target) {
        sum = 0;
        const newArr = (new Array(j - i)).fill(0).map((v, index) => i + index + 1);
        arr.push(newArr);
        break;
      }
    }
  }
  return arr;
};
```

## 滑动窗口

滑动窗口简单来说就是两个指针所围成的区域，而两个指针通过移动会引起这个范围变动，从而引起这个范围(窗口)滑动，即滑动窗口。
引用一下 leetcode 上一个题解的图 [link](https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/solution/xiang-jie-hua-dong-chuang-kou-fa-qiu-gen-fa-jian-g/):

![](https://pic.leetcode-cn.com/b7bbf8306beaf1f05af3f46d33846a9f54543d74894ddcf81bf3e1e712dbabce-image.png)
![](https://pic.leetcode-cn.com/652fac6fe71a55076fad3550487de0574616521e0e7ea93d96e0694f0afda358-image.png)

首先声明两个指针 i j 分别负责左右边界，sum 记录 i 到 j 之间的和，arr 用于存储符合条件的数组集。
1. 当 sum < target时，右边界指针向右移动，并且 sum 加上有边界指针右移一位的值。 
2. 当 sum > target时，左边界指针向右移动，并且 sum 减去当前左边界指针的值。
3. 当 sum === target，把符合的结果集存到arr，并且 sum 减去左边界指针的值，左边界指针向右移动。

**代码：**
```javascript
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  // 左边界指针从1开始，右边界指针为2，所以初始 sum 值为3
  let i = 1,
    j = 2,
    sum = 3,
    arr = [];
  // 从头开始遍历，因为 (target / 2) + (target / 2 + 1)必然是大于 target的，所以 i 不超过 target / 2
  while (i <= (target / 2)) {
    if (sum < target) {
      // 右边界指针右移
      sum += (j + 1);
      j++
    } else if (sum > target) {
      // 左边界指针右移
      sum -= i;
      i++;
    } else {
      // 存放结果集，左边界指针右移
      const res = (new Array((j + 1) - i)).fill(0).map((v, index) => i + index);
      arr.push(res)
      sum -= i;
      i++;
    }
  }
  return arr;
};
```