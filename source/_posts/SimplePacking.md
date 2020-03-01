---
title: 如何编写一个简易的模块打包工具
tags: [webpack]
archives_title: Archives
categories: webpack
date: 2019-02-26
---

在现代前端开发中，像 Webpack、Rollup、Parcel 等打包工具已经成为不可缺少的一部分，其中 Webpack 是最常用的。为了了解 Webpack 的工作原理，再加上自己曾经在面试过程中也被问过如何实现简易的模块打包工具却不知道如何回答，于是打算开始学习这一部分的内容。

在观看之后，初步了解到 webpack 的打包是先从入口文件开始，以`import`作为线索去寻找模块，实现一个简易的打包工具也是如此。

# 准备工作

在实现简易的打包工具之前，先通过命令来安装我们所需要的模块:

```sh
yarn add babylon babel-traverse babel-core
```

其中，`babylon`用于把(入口)文件的代码转换成 AST(抽象语法树),使用`babel-travse`遍历 AST 的 import 声明(ImportDeclaration)部分来寻找模块依赖关系，把遍历到的内容(模块名)存放到模块依赖数组里面,使用`babel-core`的`transformFromAst`模块把(入口)文件的代码(import 不能被浏览器识别)生成的 AST 代码转换成浏览器所能识别的代码(ES6 转 ES5)。

整个项目的结构如下:

```
|-- example
  |-- entry.js
  |-- message.js
  |-- name.js
|-- minipack.js
```

其中 example 为我们要打包的的示例，minipack.js 是我们下面要编写的简易的模块打包工具。

示例的代码如下:

entry.js

```js
import message from "./message.js";

console.log(message);
```

message.js

```js
import { name } from "./name.js";

export default `hello ${name}!`;
```

name.js

```js
export const name = "hihihhi";
```

准备工作做好了，下面开始编写打包工具的代码。

# 第一部分 - createAsset(解析依赖关系)

createAsset 主要用于解析文件内模块依赖信息。

```js
const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const { transformFromAst } = require("babel-core");

// 模块唯一标识符
let ID = 0;

function createAsset(filename) {
  // 以字符串的形式去读取文件的内容
  const content = fs.readFileSync(filename, "utf-8");

  // 把文件内容解析为AST
  const ast = babylon.parse(content, {
    sourceType: "module"
  });

  // 模块依赖数组(存放模块相对路径)
  const dependencies = [];

  // 遍历AST里面的import声明
  traverse(ast, {
    ImportDeclartion: ({ node }) => {
      // 把值存放到依赖关系数组里面
      dependencies.push(node.source.value);
    }
  });

  // 分配模块唯一标识符，为ID的递增
  const id = ID++;

  // 利用`babel-preset-env`的规则转换AST的代码(es6转es5)
  const { code } = transformFromAst(ast, null, {
    presets: ["env"]
  });

  // 当前文件的所有信息
  return {
    id,
    filename,
    dependencies,
    code
  };
}
```

我们把入口文件代码放到[AST Explorer](https://astexplorer.net/)这个网站上，我们可以很清楚的看到，`import message from './message.js';`这一行代码在`ImportDeclaration`的部分，是我们遍历的线索，也是使用`babel-traverse`时的关键。

{% asset_img ast.png ast %}

我们来分析下`createAsset`做了什么:

1. 通过传入文件路径，使用`fs`来读取文件内容。
2. 通过`babylon`解析获取到的内容(代码)并解析成`AST`。
3. 通过`babel-traverse`遍历`AST`，去寻找模块的依赖关系，也就是是否还引入了别的模块，把找到的模块依赖关系存放到`dependencies`数组。
4. 使用`babel-core`的`transformFromAst`模块，把`AST`的代码转换成`ES5`。
5. 最后返回一个对象，包含当前模块的标识符(id)、当前文件的路径、当前文件的依赖关系以及当前文件转换后的代码。

最后，运行下代码后输出以下结果:
{% asset_img result1.png result1 %}

# 第二部分 - createGraph(生成依赖图)

这一部分是调用 createAsset 来解析入口文件，从入口文件开始分析模块依赖关系来了解应用程序之间的每一个模块以及他们是如何依赖的，形成`依赖图`。

```js
// entry为入口文件的相对路径
function createGraph(entry) {
  // 解析整个入口文件，获取相关信息
  const mainAsset = createAsset(entry);

  // 使用队列queue来存放每个asset的依赖关系,初始值是只有mainAsset相关信息的数组
  const queue = [mainAsset];

  // 遍历队列
  // 最初队列只有mainAsset，但在遍历过程中，会有新的asset进入队列
  // 循环直队列尾为止
  for (const asset of queue) {
    // 存放模块依赖关系
    asset.mapping = {};

    // 获取这个模块所在目录的路径
    const dirname = path.dirname(asset.filename);

    // 遍历模块依赖关系列表(相对路径)
    asset.dependencies.forEach(relativePath => {
      // 当前模块所在文件的绝对路径
      const absolutePath = path.join(dirname, relative);

      // 获取当前模块的依赖关系
      const child = createAsset(absolutePath);

      // 把依赖关系存放到mapping,对应关系为 相对路径 -> 模块id
      asset.mapping[relativePath] = child.id;

      // 把child存放到队列
      queue.push(child);
    });
  }

  // 返回依赖关系图
  return queue;
}
```

下面分析下 createGraph 做了什么:

1. 获取入口文件的信息，然后创建一个数组 queue，先存放入口文件的信息。
2. 遍历数组，一开始数组只有入口文件的信息，但在遍历的过程中，假如入口文件含有其他依赖的文件，会在遍历过程中`push`到`queue`里面，直到文件最后没有依赖，遍历到 queue 队尾时停止遍历。
3. 在遍历过程中，我们会把依赖关系存放到 mapping 里面，对应关系为: 模块的相对路径 -> 模块 id。
4. 获取当前模块对应文件的依赖关系，并存放到队列。
5. 返回队列。

最后运行代码，结果如下:

{% asset_img result2.png result2 %}

# 最后一部分 - bundle

这一部分是把上面 createGraph 生成的信息做整合，打包代码。

```js
// 接收`createGraph(entry)`生成的信息，打包
function bundle(graph) {
  let modules = "";

  // 遍历graph的信息，生成传给IIFE的代码
  // 结构: "{0: function (require, module, exports) {xxx}, './xxx': 0}, ..."
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}  
    ]`;
  });

  // 把commonjs代码转成浏览器能运行的代码
  // require 函数先从0(入口)开始
  // 处理完之后返回result(可以运行的代码)
  const result = `
    (function (modules) {
      function require (id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = {
          exports: {}
        };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;

  return result;
}
```

运行结果如下:
{% asset_img result3.png result3 %}

最后我们把这段代码，拷贝到浏览器控制台，结果如下:
{% asset_img result4.png result4 %}

我们发现，他成功的输出了我们想要的结果，大功告成。

参考

> [Webpack founder Tobias Koppers demos bundling live by hand](https://www.youtube.com/watch?v=UNMkLHzofQI) > [BUILD YOUR OWN WEBPACK by Ronen Amiel](https://www.youtube.com/watch?v=Gc9-7PBqOC8) > [minipack](https://github.com/ronami/minipack)
> 《前端面试之道》 - 实现小型打包工具
