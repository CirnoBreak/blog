---
title: leetcode day02 - 反转链表
tags: [leetcode]
archives_title: Archives
categories: leetcode
date: 2020-03-02
---

# 题目地址

[https://leetcode-cn.com/problems/reverse-linked-list/](https://leetcode-cn.com/problems/reverse-linked-list/)

# 题目描述

反转一个单链表。

示例:

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

# 解题思路

## 非递归解法

遍历整个链表，借助变量 pre 记录前驱结点(初始为 null)，把当前结点(current)的 next 连接到 pre，即 current.next = pre。

**代码：**

```javascript
/**
 * 定义单链表
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  // 链表为空或者只有一个元素时直接返回head
  if (!head || !head.next) {
    return head;
  }

  // 初始化，先从head开始遍历，由于链表head的前驱为null，所以pre初始时为null
  let current = head,
    pre = null;
  while (current) {
    // 拷贝一份当前结点的后继结点
    const next = current.next;
    // 把当前结点的后继结点连接到前驱结点(反转)
    // 比如, null->head->next 变成了 null<-head
    current.next = pre;
    /*
     * 初始:
     * pre = null, current = null<-head
     * 下一回:
     * pre = null<-head，current = head.next
     * 再下一回
     * pre = null<-head<-head.next，current = head.next.next
     * ...
    */
    // 把当前结点赋值到前驱结点，准备下一次链表反转
    pre = current;
    // 把反转前的 current.next 的备份作为当前结点，准备下一次链表反转
    current = next;
  }
  return pre;
};
```

## 递归解法

递归解法代码实现比较简单，就是通过递归，直到触发结束条件，然后从尾部一直反转连接到头部。
也就是从链表尾部开始，每一次都先把自己与后继结点连接断掉，然后后继结点指向自己，直到连接到头部为止。

**代码：**

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  // 递归结束条件
  if (!head || !head.next) {
    return head;
  }

  let next = head.next,
    newList = reverseList(head.next);

  // head断开与后继结点的连接
  head.next = null;
  // 后继结点的后继结点连接到head
  next.next = head;

  return newList;
};
```