import Weixin from "./weixin/weixin";
import Android from "./android/android";
import IOS from "./ios/ios";
import Web from "./web/web";
import Weibo from "./weibo/weibo";

/**
 * Core.js is a javascript platform. 
 * It can be used in android/ios/weixin/web browser,etc.
 */
export default class Platform {
    constructor(param) {
        let language = Platform.getLanguage();
        console.log("current language is:" + language);
        this.language = language;
        param.language = language;

        this.user = param.user;
        this.platform = _getPlatform(param);
    }

    static getLanguage() {
        let language = (navigator.language || navigator.browserLanguage).toLowerCase();
        if (language !== "zh-cn" && language !== "en-us") {
            language = "en-us";
        }
        return language;
    }

    static getName() {
        return _getName();
    }

    getLocation(param) {
        this.platform.getLocation(param);
    }

    registerCompass(param) {
        this.platform.registerCompass(param);
    }

    unregisterCompass(param) {
        this.platform.unregisterCompass(param);
    }

    takePicture(param) {
        this.platform.takePicture(param);
    }

    startRecord(param) {
        this.platform.startRecord(param);
    }

    stopRecord(param) {
        this.platform.stopRecord(param);
    }

    uploadVoice(param) {
        this.platform.uploadVoice(param);
    }

    playRecord(param) {
        this.platform.playRecord(param);
    }

    shareToWeibo(param) {
        this.platform.shareToWeibo(param);
    }

    shareToWeixin(param) {
        this.platform.shareToWeixin(param);
    }

    shareToMoments(param) {
        this.platform.shareToMoments(param);
    }
}

/**
 * Get the type of platform. [Inner method]
 */
let _getPlatform = (param) => {
    let name = _getName();
    switch (name) {
        case "weixin":
            return new Weixin(param);
        case "weibo":
            return new Weibo(param);
        case "web":
            return new Web(param);
        case "android":
            return new Android(param);
        default:
            return new IOS(param);
    };
}

/**
 * Get the type of platform. [Inner method]
 */
let _getName = () => {
    let userAgent = navigator.userAgent;
    let browserTypeRegExp = new RegExp("MicroMessenger");
    let isWx = browserTypeRegExp.test(userAgent);

    let weiboTypeRegExp = new RegExp("Weibo");
    let isWb = weiboTypeRegExp.test(userAgent);

    let name = "unknown";
    if (isWx) {
        name = "weixin";
    } else if (isWb) {
        name = "weibo";
    } else {
        let regExp = new RegExp("Chrome|Mac");
        let isWeb = regExp.test(userAgent);
        if (isWeb) {
            name = "web";
        } else if ("android" === userAgent) {
            name = "android";
        } else {
            name = "ios";
        }
    }
    console.log("current platform is:" + name);
    return name;
}