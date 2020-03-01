---
title: "[译]在docker上开发一个简单的React(next.js)应用"
tags: [Docker]
archives_title: Archives
categories: Docker
date: 2019-01-26
---

> 原文链接: [A simple React(Next.js) app development on Docker](https://medium.com/@khwsc1/a-simple-react-next-js-app-development-on-docker-6f0bd3f78c2c)
> 原文作者: [Hyeokwoo Alex Kwon](https://medium.com/@khwsc1)

当你要部署一个微服务架构的应用时，在把它部署到生产环境服务器上之前你不能测试它里面所有的服务。通常这会花费很长的时间才能得到反馈。Docker 有助于加快这一过程，因为它使本地小型独立服务更容易链接在一起。

在这篇文章，我们会通过如何去设置并且使用 docker 来进行 react.js 的应用开发。我们会构建一个简单的 next.js 应用并且把它当做成一个 docker 镜像，以便运行在本机的生产环境上运行一个容器。

# 1. 构建一个简单的 next.js 应用

首先，我们开始编写一个简单的服务端渲染(ssr)的 react 应用，并通过设置把它做成一个很小的 docker 镜像。我们使用 next.js 库是因为它允许我们去构建一个支持 SSR 的 react 应用。

> docker 镜像是一个创建和运行 docker 容器，或者构建其他镜像的文件。docker 镜像包含一个应用和它的执行代码，用于构建和运行。[参考](https://searchitoperations.techtarget.com/definition/Docker-image)

让我们用下面的命令在本地新建一个项目:

```shell
mkdir docker-nextjs
cd docker-nextjs
yarn init
```

在这个刚建的 node.js 项目下安装 next.js:

```
yarn add next react react-dom
```

我们应该在`package.json`里面添加 scripts 来更方便地管理应用:

```json
"script": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

然后我们来设置最简单的 next.js 路由。首先在主路由上新建一个简单的 hello world 页面。我们可以在项目根目录下新建`pages/`文件夹，并在里面新建`index.js`来实现。它会变成一个路由并且在主页面上渲染。

新建`pages/index.js`后在编写如下组件:

```js
// pages/index.js
import React from "react";

class Index extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

export default Index;
```

现在我们可以在本地运行`yarn dev`命令来启动这个应用。你将可以通过`localhost:3000`来访问应用。

# 2. 编写 Dockerfile 来构建 docker 镜像

到目前为止，我们已经构建了一个最小的 next.js hellow world 应用，现在我们来让它变成一个 docker 镜像。

docker 镜像可以在项目里面用单个文件来构建。Dockerfile，在定义上，"Dockerfile 是一个包含所有你通常需要手动执行的,用于构建 docker 镜像的文本文档"。

因此，主要是通过编写命令来构建和运行应用，您可以构建一个 docker 镜像。当你构建 docker 镜像的时候，docker 系统会读取包含所有命令列表并逐行执行以构建镜像的 Dockerfile。

好的，下面开始编写 Dockerfile。我们在项目里面新建一个叫`Dockerfile`的文件，并且在里面编写以下的代码:

```bash
FROM node:10

# 设置工作路径。所有的路径都会关联WORKDIR
WORKDIR /usr/src/app

# 安装依赖
COPY package*.json ./
RUN npm install

# 拷贝源文件
COPY . .

# 构建应用
RUN npm run build

# 运行应用
CMD [ "npm", "start" ]
```

这些代码包含用于构建和运行应用的命令集。第一行的`FROM node:10`,镜像会从 nodejs 官方 docker 镜像获取，因此应用可以在 nodejs 环境中运行。

下一条命令是用`WORKDIR`来把应用的工作路径设置成`/usr/src/app`。因此，当在镜像上运行容器的时候，所有拷贝的和构建好的文件都会在这个地方。

然后，我们添加`npm install`命令来安装依赖，并且使用`COPY . .`命令来拷贝源文件到 docker。我们还应该使用`npm run build`来把应用打包成生产版本和用`npm start`来运行应用。

好的!我们已经准备好用`Dockerfile`去构建 docker 镜像了。在终端上，定位到你的项目目录，运行以下命令:

```bash
docker build -t <你的docker用户名>/docker-nextjs
```

使用 build 命令，docker 系统会通过`Dockerfile`上的命令来创建一个新的镜像。`-t`用于标记你的镜像，使得你更容易地在镜像列表里面找到你的镜像。你可以使用`docker image`命令来检查 docker 镜像。

# 3.在镜像上运行容器

要使用 docker 实际运行应用，应该基于镜像运行 docker 容器。

> 容器是 docker 镜像实例化的运行时。到目前为止，我们可以使用构建好的 docker 镜像来创建容器。[查看更多](https://www.docker.com/resources/what-container)

由于我们拥有自己的 docker 镜像，我们可以用以下命令创建并且运行 docker 容器:

```bash
docker run -d -p 3333:3000 <你的docker用户名>/docker-nextjs:latest
```

这行命令会用镜像`<你的docker用户名>/docker-nextjs:latest`去创建一个容器，并且把端口号绑定到`3333:3000`。此处的绑定意味着在 docker 里面应用是在`3000`端口运行，并且可以通过`localhost:3000`来访问(在本机是`localhost:3333`)。

# 总结

通过阅读这篇文章，你能够掌握用最小最简单的方式来用 docker 部署 react 应用。这个例子只用 docker 部署了简单应用，但但至少您可以使用 docker 更快速地测试生产环境。希望你的生活过得更轻松愉快!🐳
