---
title: "01-创建脚本"
date: 2021-10-21T15:44:55+08:00
draft: false
---

## 0x01 增加脚本

麻将执行的内容为`JavaScript`脚本，在软件中点击`脚本`-`右下角加号`即可添加一个脚本。

新添加的脚本会存放在当前手机的存储卡内，具体路径如下：

```
/sdcard/Android/data/io.github.mohjong/files/scripts/***.js
```

## 0x02 脚本的内容

下面为一个默认新添加的脚本的内容：

```javascript
// ==UserScript==
// @uuid        ef7af6fe-44ff-497e-a2b9-3412748edeab
// @name        新建脚本-ef7af6fe
// @version     0.0.1
// @description 简单的描述下您脚本的功能
// @author      路人甲
// @package     com.example.android
// @enable      false
// @priority      100
// ==/UserScript==

//
// 这里编写您的脚本代码
// 更多文档参考：https://mohjong.github.io/develop/
//
const Logcat = Java.use("android.util.Log");
```

## 说明

脚本的配置部分必须以`// ==UserScript==`和`// ==/UserScript==`结尾。

中间部分为配置内容，下面部分为脚本代码。

配置说明：

| 序号 | 字段         | 说明                 | 备注                                |
| ---- | ------------ | -------------------- | ----------------------------------- |
| 1    | @uuid        | 脚本唯一的UUID       | 必须为标准的UUID格式                |
| 2    | @name        | 脚本展示的名称       |                                     |
| 3    | @version     | 脚本版本号           |                                     |
| 4    | @description | 脚本描述信息         |                                     |
| 5    | @author      | 脚本作者             |                                     |
| 6    | @package     | 脚本支持的软件的包名 | 可以写多个，单每个要起一行          |
| 7    | @enable      | 脚本开关             | 麻将启动、停止会复写此字段          |
| 8    | @priority    | 脚本优先级           | 脚本的加载顺序，越低加载越早。1~999 |

> 配置部分不支持换行

