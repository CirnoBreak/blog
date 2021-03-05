---
title: 获取对应的数据类型
order: 3
toc: menu
---

## 原理

原始数据类型（除了 null）都可以通过 typeof 获取到对应的类型，而复杂的引用类型和 null 则可以通过 Object.prototype.toString.call(obj) 返回的 [object 类型] 来获取到对应的类型。

```js
function getType(obj) {
  let type = typeof obj;
  if (type !== 'object') {
    return type;
  }

  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, '$1');
}
```
