import Web from "../web/web";
export default class Android extends Web {
    constructor(param) {
        super(param);
        this.name = "android";
    }

    getLocation(param) {
        super.getLocation(param);
    }

    registerCompass(param) {
        super.registerCompass(param);
    }

    unregisterCompass(param) {
        super.unregisterCompass(param);
    }

    takePicture(param) {
        super.takePicture(param);
    }

    startRecord(param) {
        try {
            console.log("Recording start now.");
            window.startVoice = () => {
                console.log("start voice now.");
                param.success();
                window.startVoice = undefined;
            };
            jsCallback.startVoice();
        } catch (e) {
            param.error("Error:" + e);
        }
    }

    stopRecord(param) {
        try {
            console.log("Recording stop now.");
            window.stopVoice = (maxDB) => {
                console.log("stop voice now:" + maxDB);
                param.success(maxDB);
                window.stopVoice = undefined;
            };
            jsCallback.stopVoice();
        } catch (e) {
            param.error("Error:" + e);
        }
    }

    playRecord(param) {
        param.error("Not implemented");
    }

    shareToWeibo(param) {
        param.error("Not implemented");
    }

    shareToWeixin(param) {
        param.error("Not implemented");
    }

    shareToMoments(param) {
        param.error("Not implemented");
    }
}