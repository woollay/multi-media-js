import Listener from "../listener-sdk"

const IMAGE_HEADER = "data:image/jpeg/png;base64,";
// const IMAGE_HEADER_SPLIT = ",";

export default class Weibo {
    constructor(param) {
        let self = this;
        require("./mobile.js");
        this.name = "weibo";
        this.language = param.language;

        this.listener = new Listener();
        this.isInit = false;

        let sign = param.data.data;
        window.WeiboJS.init({
            'appkey': '2145382919',
            'debug': false,
            'timestamp': sign.timestamp,
            'noncestr': sign.noncestr,
            'signature': sign.signature,
            'scope': [
                'getNetworkType',
                'networkTypeChanged',
                'getBrowserInfo',
                'checkAvailability',
                'setBrowserTitle',
                'openMenu',
                'setMenuItems',
                'menuItemSelected',
                'setSharingContent',
                'openImage',
                'scanQRCode',
                'pickImage',
                'getLocation',
                'pickContact',
                'invokeMenuItem'
            ]
        }, (ret) => {
            console.log('init done\n', JSON.stringify(ret));
            if (ret.code !== 200) {
                alert('加载微博SDK失败\n', JSON.stringify(ret));
            }
            if (true) {
                console.log("weibo sdk ready.");
                let locationParam = {
                    success: (location) => {
                        self.isInit = true;
                        self.listener.callback("getLocation", location);
                        param.success(location);
                    },
                    error: param.error,
                    single: true
                };
                _getLocation(locationParam);
            }
        });
    }

    getLocation(param) {
        let self = this;
        if (!self.isInit) {
            let newParam = {
                success: (res) => {
                    console.log("current location:", res);
                },
                error: param.error
            };
            let callback = (location) => {
                param.success(location);
            };
            self.listener.register(newParam, callback, "getLocation");
        } else {
            _getLocation(param);
        }
    }

    registerCompass(param) {
        param.error("Not implemented");
    }

    unregisterCompass(param) {
        param.error("Not implemented");
    }

    takePicture(param) {
        WeiboJS.invoke("pickImage", {
            'source': 'camera'
        }, function (e) {
            try {
                let base64 = IMAGE_HEADER;
                let imgData = base64 + e.base64;
                param.success(imgData);
            } catch (e) {
                param.error("Failed to get wb photo.", e);
            }
        });
    }

    startRecord(param) {
        param.error("Not supported");
    }

    stopRecord(param) {
        param.error("Not supported");
    }

    playRecord(param) {
        param.error("Not supported");
    }

    shareToWeixin(param) {
        param.error("Not implemented");
    }

    shareToMoments(param) {
        param.error("Not implemented");
    }

    shareToWeibo(param) {
        param.error("Not implemented");
    }
}

let _getLocation = (param) => {
    WeiboJS.invoke("getLocation", null, (e) => {
        try {
            let location = {};
            location.latitude = e.lat;
            location.longitude = e.long;
            console.log("Successfully to get new wb location:", JSON.stringify(location));
            param.success(location);
        } catch (e) {
            param.error("Failed to get wb location", e);
        }
    });
}