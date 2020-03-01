---
title: windows系统安装Android Studio和配置Flutter
tags: [Flutter]
archives_title: Archives
categories: Flutter
date: 2019-01-10
---

Flutter 是谷歌开源的，一个全新的移动 UI 框架，在 2018 年 12 月初发布了 1.0 正式版本，由于本人是做前端开发的，对原生开发不太了解，想从 Flutter 开始入手，但是，在环境配置方面并不是那么的顺利，期间也踩了不少坑。由于环境是 Flutter1.0 发布不久后才部署好的，现在只能考记忆来回顾环境配置的过程。

# 需要下载的工具

1. Android Studio(需要科学上网): [https://developer.android.com/studio/](https://developer.android.com/studio/)
2. Flutter SDK 1.0 稳定版 [https://storage.googleapis.com/flutter_infra/releases/stable/windows/flutter_windows_v1.0.0-stable.zip](https://storage.googleapis.com/flutter_infra/releases/stable/windows/flutter_windows_v1.0.0-stable.zip)

# 设置 Flutter SDK 环境变量

把下载好的`Flutter SDK`放到任意你觉得方便的位置，解压。然后右键 此电脑，选择属性，依次点击 高级系统设置 -> 环境变量，双击 `xxx 的用户变量` 下面的`path`，点新建，然后输入你 Flutter SDK 所在的目录，比如我的 Flutter SDK 是放在 C 盘下的 src，则要输入 C:\src\flutter\bin，其他位置同理，记得一定是定位到`bin`下面。

# 设置 Flutter SDK 镜像

在终端(cmd/powershell)下面输入以下命令:

```sh
set PUB_HOSTED_URL=https://pub.flutter-io.cn
set FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

即可,详细参考[https://flutter.io/community/china](https://flutter.io/community/china)

## 运行 Flutter Doctor

打开一个新的 cmd 或 PowerShell，输入 flutter doctor 来运行，flutter doctor 是拿来检测你缺少哪些依赖，一般此时会显示你缺少(虚拟/真实)设备，那此时就需要 Android Studio 的模拟器或者你自己的手机(安卓机)。

# 安装 Android Studio

根据提示直接安装到完成，然后打开 Android Studio，如果是第一次安装，可能会提示你缺少 SDK，这是会让你选择下载 SDK 的目录并开始下载(Android SDK 的谷歌镜像速度还是蛮快的，如果觉得慢可以尝试使用国内 Android Studio SDK 镜像),目录尽量不要选择 C 盘(由于 SDK 巨大，之前选择 SDK 装在 C 盘，装了几个之后被占了几十 G)，可以选择你自己喜欢的地方。

当 SDK 下载完之后，可以进入 Android Studio 的欢迎界面，点击右下角的 configure -> SDK Manager 可以进入 SDK 管理界面。进入界面之后可以看到你 SDK 的安装情况，以及该 SDK 的详情(需要点击右下方的 Show Package Detail)。
{% asset_img SDKMAN.png sdkman %}

假如需要安装新的 SDK，只需要在对应的 SDK 打上勾后点 OK 即可。

## 配置 Android SDK 环境变量

在上述的配置环境变量界面，同样是在 `xxx 的用户变量`下面，点击 `新建`，新建一个名为`ANDROID_HOME`的环境变量，然后路径是你 Android SDK 的路径(可通过浏览文件选择)，比如: `F:\Android\sdk`。
{% asset_img asdk.png asdk %}

# 新建一个 Flutter 项目

## 使用 Android Studio 创建

在 Android Studio 的 欢迎界面 ，也就是一开始的界面，点击 `Start a new Flutter project`后，进入 `Create New Flutter Project`的界面后有三个选项，点击第一个`Flutter Application`后点击 next 此时会让你输入项目名称、项目描述，还有 Flutter SDK 的路径和项目位置的选择，自定义结束后点击 next，后面是包名的配置，定义结束后按 Finish 完成项目创建。

## 使用 Visual Studio Code 创建

在打开 Visual Studio Code 的情况下，按下组合键 `ctrl + shift + x`，或者直接点开左边活动栏第四个按钮(拓展)，在应用商店搜索并安装`Dart`和`Flutter`插件，插件安装完成后重启 Visual Studio Code。此时在 Visual Studio Code 按下组合键 `ctrl + shift + p`，输入 Flutter，点击`Flutter:New Project`，他会让你输入项目名字，比如可以输入 my_app 并按下回车来新建一个叫 my_app 的项目，此时会让你选择该项目的路径，选择完成确定后等待即可。

# 运行 Android Studio 的虚拟机(AVD)

在 Android Studio 打开任意项目，打开后在右上角找到`AVD Manager`，
{% asset_img AVD.png AVD %}
点击进入，此时可以点击`Create Virtual Device`来创建虚拟机，根据自己的需求来选择对应型号的虚拟机,选择后点击 next，会进入`System Image(系统镜像)`选择界面，(由于这里我之前试过被墙，一直转圈无法加载，这种情况出现时需要科学上网),选择对应的安卓系统镜像后(假如没有需要下载)，点 next，编辑好参数后点 finish 即可。
虚拟机安装完成之后，`AVD Manager`里面会成功显示你安装好的虚拟机，此时点击`Actions`下的绿色按钮即可运行虚拟机。
{% asset_img runavd.png runavd %}
第一次加载需要漫长的加载，请耐心等待。

# 运行 Flutter 项目

Flutter 项目主要运行的是 lib 文件夹下的 main.dart，同时确保真机/模拟器打开。

## Visual Studio Code 运行

首先运行虚拟机或者连接真机，然后在 Visual Studio Code 下点开当前项目 lib 文件夹下的 main.dart，按下 F5 即可。

## Android Studio 运行

首先运行虚拟机或者连接真机，然后点击 Android Studio 上方的绿色播放按钮即可。
{% asset_img runapp.png runapp %}
