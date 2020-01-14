import Recorder from "./recorder";
import Listener from '../listener-sdk';
import {
    url
} from "../../jsplatform/url-const";

export default class Web {
    constructor(param) {
        this.name = "web";
        this.language = param.language;
        this.recorder = undefined;
        this.listener = new Listener();
        this.compass = undefined;

        this.isInit = false;
        let self = this;
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
        console.log("end web.");
    }

    getLocation(param) {
        let self = this;
        if (!self.isInit) {
            let callback = (newParam, location) => {
                console.log("get location successfully:" + location);
                newParam.success(location);
            };
            console.log("start to register getLocation from web.");
            self.listener.register(param, callback, "getLocation");
        } else {
            console.log("start to get Location from web.");
            _getLocation(param);
        }
    }

    registerCompass(param) {
        let handler = (event) => {
            let degree = Math.round(360 - event.alpha);
            let compassImg = document.getElementById("compass-img");
            compassImg.style.transform = 'rotate(-' + degree + 'deg)';
            let compassTxt = document.getElementById("alpha");

            compassTxt.innerHTML = degree;
            param.success(degree);
        };
        this.compass = {
            name: 'deviceorientationabsolute',
            handler: handler
        };

        window.addEventListener(this.compass.name, handler, false);
        console.log("add compass listener.");
    }

    unregisterCompass(param) {
        if (this.compass) {
            window.removeEventListener(this.compass.name, this.compass.handler, false);
            console.log("remove compass listener.");
            param.success();
        } else {
            param.error("No compass.");
        }
    }

    takePicture(param) {
        //parent div must exist
        let mediaDiv = document.getElementById("task-content");
        if (!mediaDiv) {
            param.error("element is not exist.");
            return;
        }

        let camera = document.getElementById("task-camera");
        if (!camera) {
            camera = document.createElement("input");
            camera.setAttribute("id", "task-camera");
            camera.setAttribute("type", "file");
            camera.setAttribute("accept", "image/*");
            camera.setAttribute("capture", "camera");
            camera.style.display = "none";

            camera.addEventListener("change", function () {
                console.log("camera data has changed.");
                let file = this.files[0];
                console.log("filesize=" + file.size);
                console.log("file=" + file + ",file type=" + file.type);
                if (!file || !file.type || !/image\/\w+/.test(file.type)) {
                    param.error("No picture error!");
                } else {
                    try {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            console.log("successfully to read picture.");
                            param.success(this.result);
                        };
                        reader.readAsDataURL(file);
                    } catch (e) {
                        console.log("failed to get image:" + e);
                    }
                }
            });
            mediaDiv.appendChild(camera);
        }
        camera.click();
    }

    startRecord(param) {
        let self = this;
        try {
            Recorder.get((rec) => {
                console.log("Record start now.");
                self.recorder = rec;
                self.recorder.clear();
                self.recorder.start();
                param.success("success");
            });
        } catch (e) {
            param.error("Error:{0}", e);
        }
    }

    stopRecord(param) {
        console.log("Recording stop now.");
        let blobData = this.recorder.getBlob();
        param.success(blobData);
    }

    playRecord(param) {
        //parent div must exist
        let mediaDiv = document.getElementById("task-content");
        if (!mediaDiv) {
            param.error("element is not exist.");
            return;
        }
        let audio = document.getElementById("task-audio");
        if (!audio) {
            audio = document.createElement('audio');
            audio.style.display = "none";
            mediaDiv.appendChild(audio);
        }

        try {
            let newAudio = document.getElementById("task-audio");
            this.recorder.playRecord(newAudio);
            param.success("play voice successfully.");
        } catch (e) {
            param.error("play audio error:" + e);
        }
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

let _getLocation = (param) => {
    console.log("start to get location now.");
    if (navigator.geolocation) {
        let options = {
            enableHighAccuracy: true,
            maximumAge: 1000
        };

        navigator.geolocation.getCurrentPosition(
            (res) => {
                console.log("Navigator getlocation result 0:" + JSON.stringify(res));
                let position = {};
                position.longitude = res.coords.longitude;
                position.latitude = res.coords.latitude;
                param.success(position);
            },
            (res) => {
                console.log("Navigator getlocation result 1:" + JSON.stringify(res));
                param.error(res);
            },
            options
        );
    } else {
        param.error("Geo location not supported.");
    }
}