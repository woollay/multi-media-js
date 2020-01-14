import wx from 'weixin-js-sdk';
import Listener from "../listener-sdk"

const IMAGE_HEADER = "data:image/jpeg/png;base64,";
const IMAGE_HEADER_SPLIT = ",";

export default class Weixin {
    constructor(param) {
        this.name = "weixin";
        this.language = param.language;
        this.listener = new Listener();
        this.isInit = false;
        let jsApiList = [
            'getLocation',
            'chooseImage',
            'previewImage',
            'startRecord',
            'stopRecord',
            'playVoice',
            'stopVoice',
            'uploadVoice',
            'onVoiceRecordEnd',
            'downloadVoice',
            'getLocalImgData',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ];

        let self = this;
        console.log("start to init wx.");
        wx.ready(() => {
            console.log("ws sdk ready.");
            let locationParam = {
                success: (location) => {
                    self.isInit = true;
                    self.listener.callback("getLocation", location);
                    param.success(location);
                },
                error: param.error,
                single: true
            };

            let checkParam = {
                jsApiList: jsApiList,
                success: (res) => {
                    _getLocation(locationParam);
                },
                error: param.error
            };
            wx.checkJsApi(checkParam);
        });
        wx.error((res) => {
            param.error("ws sdk error." + res);
        });
        wx.config({
            debug: false,
            appId: param.data.appId,
            timestamp: param.data.timestamp,
            nonceStr: param.data.nonceStr,
            signature: param.data.signature,
            jsApiList: jsApiList
        });
    }

    getLocation(param) {
        let self = this;
        if (!self.isInit) {
            let callback = (newParam, location) => {
                console.log("get location successfully:", location);
                newParam.success(location);
            };
            self.listener.register(param, callback, "getLocation");
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
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: (res) => {
                console.log("wx photo localIds:", res.localIds);
                let imgParam = {
                    localId: res.localIds[0],
                    success: (res) => {
                        let base64 = IMAGE_HEADER;
                        if (res.localData.indexOf(IMAGE_HEADER_SPLIT) > -1) {
                            base64 = "";
                        }
                        let localData = base64 + res.localData;
                        param.success(localData);
                    },
                    error: (error) => {
                        param.error("failed to get photo:", error);
                    }
                };
                wx.getLocalImgData(imgParam);
            },
            error: (error) => {
                param.error("failed to get wx photo:", error);
            }
        });
    }

    startRecord(param) {
        _startRecord(param);
    }

    stopRecord(param) {
        let self = this;
        let uploadParam = {
            success: (res) => {
                console.log("successfully to get serverId:", res);
                param.success(res);
            },
            error: param.error
        };

        let stopParam = {
            success: (res) => {
                let localId = res;
                uploadParam.data = {
                    localId: localId
                }
                _uploadVoice(uploadParam);
            },
            error: param.error
        };
        _stopRecord(stopParam);
    }

    playRecord(param) {
        wx.playVoice({
            localId: param.data.localId
        });
        param.success("play voice successfully.");
    }

    shareToWeixin(param) {
        try {
            wx.onMenuShareAppMessage({
                title: param.data.title,
                desc: param.data.desc,
                link: param.data.link,
                imgUrl: param.data.imgUrl,
                type: '',
                dataUrl: '',
                success: () => {
                    param.success("Share to weixin success.");
                }
            })
        } catch (error) {
            param.error("Share to weixin error.", error);
        }
    }

    shareToMoments(param) {
        try {
            wx.onMenuShareTimeline({
                title: param.data.title,
                link: param.data.link,
                imgUrl: param.data.imgUrl,
                success: () => {
                    param.success("Share to moments success.");
                }
            })
        } catch (error) {
            param.error("Share to moments error.", error);
        }
    }

    shareToWeibo(param) {
        param.error("Interface not implemented");
    }
}

let _startRecord = (param) => {
    try {
        wx.startRecord();
        wx.onVoiceRecordEnd({
            complete: function (res) {
                console.log("stop record timeout:", res.localId);
            }
        });
        param.success("record successfully.");
    } catch (e) {
        param.error("start record error:", e)
    }
}

let _stopRecord = (param) => {
    wx.stopRecord({
        success: (res) => {
            let localId = res.localId;
            param.success(localId);
        },
        error: (error) => {
            param.error("failed to stop voice:", error);
        }
    });
}

let _uploadVoice = (param) => {
    let localId = param.data.localId;
    wx.uploadVoice({
        localId: localId,
        isShowProgressTips: 1,
        success: (res) => {
            let serverId = res.serverId;
            console.log("localId==", localId);
            console.log("mediaId==", serverId);
            param.success(serverId);
        },
        error: (error) => {
            param.error("failed to upload:{0},localId:{1}", error, localId);
        }
    });
}

let _getLocation = (param) => {
    wx.getLocation({
        type: 'wgs84',
        success: (res) => {
            console.log("get wx location:", JSON.stringify(res));
            let location = {};
            if (typeof (res.longitude) === "string") {
                location.latitude = parseFloat(res.latitude);
                location.longitude = parseFloat(res.longitude);
            } else {
                location.latitude = res.latitude;
                location.longitude = res.longitude;
            }
            param.success(location);
        },
        error: (error) => {
            param.error("failed to get wx location:", error);
        }
    });
}