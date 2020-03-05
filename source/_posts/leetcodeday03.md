---
title: leetcode day03 - 合并排序的数组
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-03
---

# 题目地址

[https://leetcode-cn.com/problems/sorted-merge-lcci/](https://leetcode-cn.com/problems/rotting-oranges/)

# 题目描述

给定两个排序后的数组 A 和 B，其中 A 的末端有足够的缓冲空间容纳 B。 编写一个方法，将 B 合并入 A 并排序。

初始化  A 和 B 的元素数量分别为  m 和 n。

示例:

输入:

```
A = [1,2,3,0,0,0], m = 3
B = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]
```

# 解题思路

## api 法

api 法比较简单，就是直接把 A 数组删掉从下标 m - 1 开始的所有元素，然后 B 数组截取前 n 个元素后插入 A 数组，最后对 A 数组进行一次排序。

**代码：**

```javascript
/**
 * @param {number[]} A
 * @param {number} m
 * @param {number[]} B
 * @param {number} n
 * @return {void} Do not return anything, modify A in-place instead.
 */
var merge = function(A, m, B, n) {
  A.splice(m, A.length - m, ...B.slice(0, n));
  A.sort((a, b) => a - b);
};
```

## 双指针法

题目给出的条件是，A 的末端有足够的缓冲空间容纳 B，由此可以初始化两个指针，位置分别指向第 m n 位置，也就是下标为 m - 1 和 n - 1，从数组 A 末端开始填充数据，即一直给数组 A 下标为 m + n - 1 赋值两个指针对应下标的最大值。

举例:

A = [1,2,3,0,0,0], m = 3
B = [2,5,6], n = 3 时

第一轮， A[3 - 1] 与 B[3 - 1] 比较，此时 A[3 - 1] < B[3 - 1]，把 B[3 - 1]的值赋值到 A[3 + 3 - 1]，B 指针对应下标 - 1
第二轮, A[3 - 1] 与 B[2 - 1] 比较，此时 A[3 - 1] < B[2 - 1]，把 B[3 - 1]的值赋值到 A[3 + 2 - 1]，B 指针对应下标 - 1
第三轮, A[3 - 1] 与 B[1 - 1] 比较，此时 A[3 - 1] > B[1 - 1]，把 A[3 - 1]的值赋值到 A[3 + 1 - 1]，A 指针对应下标 - 1
...

**代码：**

```javascript
var merge = function(A, m, B, n) {
  // 初始化 A 和 B 数组指针的下标和赋值位置下标
  let mIndex = m - 1,
    nIndex = n - 1,
    cur = m + n - 1;
  while (mIndex >= 0 || nIndex >= 0) {
    if (mIndex === -1) {
      // 此时 A 数组已经挪完，B数组继续往前挪
      A[cur] = B[nIndex];
      nIndex--;
    } else if (nIndex === -1) {
      // 此时 B 数组已经挪完，A数组继续往前挪
      A[cur] = A[mIndex];
      mIndex--;
    } else if (A[mIndex] > B[nIndex]) {
      // 此时 A 数组指针对应的值比 B 数组指针的值大，赋值后 A 指针往前挪
      A[cur] = A[mIndex];
      mIndex--;
    } else {
      // 此时 B 数组指针对应的值大于或者等于 A 数组指针的值，赋值后 B 指针往前挪
      A[cur] = B[nIndex];
      nIndex--;
    }
    // 一轮结束后赋值的下标往前挪
    cur--;
  }
};
```
