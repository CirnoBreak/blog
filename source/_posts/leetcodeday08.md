---
title: leetcode day08 - 零钱兑换
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-08
---

# 题目地址

https://leetcode-cn.com/problems/coin-change/

# 题目描述

给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

示例 1:

```
输入: coins = [1, 2, 5], amount = 11
输出: 3 
解释: 11 = 5 + 5 + 1
```

示例 2:

```
输入: coins = [2], amount = 3
输出: -1
```

# 解题思路

这道题涉及到动态规划，由于本人没接触过动态规划相关的，理解起来比较困难，等学习相关知识后再补充，下面简单说下代码思路，主要是参考 [link](https://leetcode-cn.com/problems/coin-change/solution/dong-tai-gui-hua-tao-lu-xiang-jie-by-wei-lai-bu-ke/) 的迭代解法。

思路参考下图：
![](https://pic.leetcode-cn.com/b4e6cf1bb8e2284bfc01dfef6c1a60c19f9c78238061b65370ccc01822161e83.jpg)

从0开始一直到amount一直分解问题。
dp[i] = x 表示当前目标金额为i时，至少需要 x 枚硬币。
数组初始化为 amount + 1 是因为凑成 amount 枚硬币最多只能等于 amount（全用1元硬币的情况），所以初始为 amount + 1 相当于初始化为正无穷，便于后续取最小值。

**代码:**
```javascript
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  if (amount === 0) {
    return 0;
  }
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i < dp.length; i++) {
    for (let j = 0; j < coins.length; j++) {
      if (i - coins[j] >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
      }
    }
  }

  return dp[dp.length - 1] === Infinity ? -1 : dp[dp.length - 1];
};