---
title: leetcode day04 - 腐烂的橘子
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-04
---

# 题目地址

[https://leetcode-cn.com/problems/rotting-oranges/](https://leetcode-cn.com/problems/rotting-oranges/)

# 题目描述

在给定的网格中，每个单元格可以有以下三个值之一：

值 0 代表空单元格；
值 1 代表新鲜橘子；
值 2 代表腐烂的橘子。
每分钟，任何与腐烂的橘子（在 4 个正方向上）相邻的新鲜橘子都会腐烂。

返回直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1。

 

**示例 1**：

![示例1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/16/oranges.png)

```
输入：[[2,1,1],[1,1,0],[0,1,1]]
输出：4
```

示例 2：

```
输入：[[2,1,1],[0,1,1],[1,0,1]]
输出：-1
解释：左下角的橘子（第 2 行， 第 0 列）永远不会腐烂，因为腐烂只会发生在 4 个正向上。
```

示例 3：

```
输入：[[0,2]]
输出：0
解释：因为 0 分钟时已经没有新鲜橘子了，所以答案就是 0 。
```


# 解题思路

## 广度优先搜索(BFS)

1. indexQueue 用于存放感染的橘子的下标，freshNum 记录新鲜的橘子数量， mins 记录感染的分钟数。
2. 首先遍历一遍 grid 数组，找出所有感染的橘子(2)的下标[i, j]，存放到 indexQueue 数组，供 BFS 使用，同时记录新鲜橘子的数量。
3. 开始遍历 indexQueue，每次取出 indexQueue 第一个对应的值的下标，开始感染(四个方向都感染)。如果遇到新鲜的橘子，把该橘子的下标存进新的队列 newIndexQueue 提供后续遍历感染并把对应的值赋值为2，同时新鲜橘子的数量 - 1，一轮结束 mins + 1，把 newIndexQueue 赋值给indexQueue，开始新一轮的感染。
4. 最后，如果还有新鲜的橘子(freshNum > 0)，返回 -1，否则返回感染过程的分钟数 mins。

引用一下其中一个 leetcode 题解的动图 [link](https://leetcode-cn.com/problems/rotting-oranges/solution/yan-du-you-xian-sou-suo-python3-c-by-z1m/)：

![](https://pic.leetcode-cn.com/aec044437ac27b8e23ba0d8f07daac230e6e0c0671fcd6a68f8884b991b4e1cf-0994.gif)


**代码：**

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {
  // 初始的感染橘子下标队列
  let indexQueue = [];
  // 新鲜橘子数量
  let freshNum = 0;
  // 感染的分钟数
  let mins = 0;
  // 遍历橘子二维数组
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
      // 把感染橘子的下标存到 indexQueue
      if (grid[i][j] === 2) {
        indexQueue.push([i, j]);
      }
      // 记录新鲜橘子数量
      if (grid[i][j] === 1) {
        freshNum++;
      }
    }
  }
  while (indexQueue.length > 0 && freshNum > 0) {
    // 下一轮的indexQueue
    let newIndexQueue = [];
    while (indexQueue.length > 0) {
      const badOrangeIndex = indexQueue.shift();
      // 当前橘子感染的橘子数
      let curInfectNum = 0;
      // 取下标
      const [r, c] = badOrangeIndex;
      // 往上感染
      if (r > 0 && grid[r - 1][c] === 1) {
        grid[r - 1][c] = 2;
        curInfectNum++;
        newIndexQueue.push([r - 1, c])
      }
      // 往左感染
      if (c > 0 && grid[r][c - 1] === 1) {
        grid[r][c - 1] = 2;
        curInfectNum++;
        newIndexQueue.push([r, c - 1])
      }
      // 往下感染
      if (r < grid.length - 1 && grid[r + 1][c] === 1) {
        grid[r + 1][c] = 2;
        curInfectNum++;
        newIndexQueue.push([r + 1, c])
      }
      // 往右感染
      if (c < grid[0].length - 1 && grid[r][c + 1] === 1) {
        grid[r][c + 1] = 2;
        curInfectNum++;
        newIndexQueue.push([r, c + 1])
      }
      // 减少新鲜橘子数量
      freshNum -= curInfectNum;
    }
    // 一轮结束
    mins++;
    // 准备开始下一轮遍历
    indexQueue = newIndexQueue;
  }
  if (freshNum !== 0) {
    return -1;
  }
  return mins;
};
```