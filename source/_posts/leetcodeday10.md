---
title: leetcode day10 - 二叉树的直径
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-10
---

# 题目地址

[https://leetcode-cn.com/problems/diameter-of-binary-tree/](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

# 题目描述

给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过根结点。

示例 :
给定二叉树

```
          1
         / \
        2   3
       / \
      4   5
```

返回  3, 它的长度是路径 [4,2,1,3] 或者  [5,2,1,3]。

# 解题思路

## 深度优先搜索(DFS)

本题的核心就是寻找二叉树左子树的最大深度和右子树的最大深度之和加上根节点(1)，可以拆分为不断遍历左右子树，通过回溯（自底向上）累加（空的时候为 0， 存在的时候加 1）得到当前节点的左右子树深度，并取最大值，可以参考[link](https://leetcode-cn.com/problems/diameter-of-binary-tree/solution/shi-pin-jie-shi-di-gui-dai-ma-de-yun-xing-guo-chen/)的 ppt。

**代码：**

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {
  // 路径长度初始值
  let ans = 0;
  function depth(node) {
    // 没有左/右子树时返回0
    if (!node) {
      return 0;
    }
    // 遍历左子树
    const leftChildNum = depth(node.left);
    // 遍历右子树
    const rightChildNum = depth(node.right);
    // 取路径最大值赋值给ans
    ans = Math.max(ans, leftChildNum + rightChildNum);
    // 取当前节点的左右子树中最长的路径，往上一步(+1)
    return Math.max(leftChildNum, rightChildNum) + 1;
  }
  depth(root);
  return ans;
};
```
