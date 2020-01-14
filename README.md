# 一、目标

1. 主要功能是**获取经纬度**、**拍照**、**录音**、**获取指南针**等强依赖各底层平台（指的是浏览器内核、操作系统等）的多媒体功能；
2. 支持的平台包括：**Mobile Chrome 浏览器**、**Android App**、~~IOS App~~（技术不熟，时间不充足，未实现）、**微信公众号**、**微博公众号**、~~Facebook~~ 等平台（因为老被封号，还有一些问题不好解决，放弃）；

# 二、方案

1. 涉及平台众多，但是都有一个 Webkit 内核(或者说 Webview)，所以技术选型时，尽量考虑通用技术,能够直接适配所有的业务场景；
2. 经过初步的验证，发现 Web 浏览器、Android App 均能较好地支持 H5 原生能力（原生获取经纬度、原生拍照、原生录音），而且微信公众号、Android 平台还自己单独封装了一套 API 来实现这些能力；
3. 综合考虑，使用 H5 原生+JS 平台+JS 的 ES6 语法来实现所有平台的适配，这样工作量较小（多个平台，一套代码）；
4. 考虑当前 JS 平台的流行程度、团队技能树以及 API、文档的友好程度，选择 Vue.js 框架作为页面和业务逻辑的 JS 框架，同时使用 vue-cli 作为脚手架、npm 作为 js 平台的打包框架来调试和出包(当前代码未体现，但在本人的其它项目中有体现)；

# 三、实现

1. 本代码在 Android App、微信公众号、Android/IOS Chrome 浏览器中经过验证；
2. 考虑到各平台的差异性，本基础 API 基本上只有标准的实现，没有具体的业务逻辑，业务逻辑代码在更上层的业务 js 中，限于商业考虑，无法共享给大家，抱歉；
3. 本人在此项目之前，基本上只有后台代码的开发经验，所以此处特别能接受 JS 的 ES6 语法，并在代码中大量应用了类、继承和静态方法；
4. **_开源代码地址：[woollay/multi-media-js](https://github.com/woollay/multi-media-js)_**。欢迎大家来完善:)

# 四、使用

1. 业务代码中引用 platform.js（在 Android/IOS 平台 App 使用时，须保证 UserAgent 必须有相关关键字：android/ios，其它平台不需要额外的任何处理）：

```javascript
//注意相对路径
import Platform from '../lib/platform'
```

2. 初始化平台对象：

```javascript
let platParam = {
    success: (resp) => {
        //初始化成功后执行的操作
        _initBusiness(...);
    },
    error: (resp) => {
      ...
    },
    data: ...
};
let platform = new Platform(platParam);
```

3. 调用 API：

```javascript
getLocation(callback) {
  platform.getLocation({
      success: (newLocation) => {
        callback(newLocation);
      },
      error: (resp) => {
        ...
      },
  });
}
```

4. 特殊说明：在 Android App 时，会涉及原生 js 和 Java 代码的交互过程，请关注我的博客，里面有详细的介绍：  
   [Vue.js 实战——开发 Android Hybird App 之 Webview 基础配置\_12](https://blog.csdn.net/dobuy/article/details/88771655)  
   [Vue.js 实战——开发 Android H5 App 之 Webview 高级配置\_13](https://blog.csdn.net/dobuy/article/details/88924667)  
   [Vue.js 实战——H5 拍照迁移至 Android App_14](https://blog.csdn.net/dobuy/article/details/89298626)  
   [Vue.js 实战——封装 Android H5 App 的录音组件\_15](https://blog.csdn.net/dobuy/article/details/89527317)
