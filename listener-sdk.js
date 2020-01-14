export default class Listener {
    constructor() {
        this.feedback = {};
    }

    getAll() {
        return this.feedback;
    }

    exist(name) {
        let batchListener = this.feedback[name];
        return batchListener && batchListener.length > 0;
    }

    register(param, callback, name) {
        console.log("register listener:" + name);
        let listener = {
            param: param,
            notice: callback
        };

        let batchListener = this.feedback[name];
        if (!batchListener) {
            batchListener = [];
        }
        batchListener.push(listener);

        if (!this.feedback[name]) {
            this.feedback[name] = batchListener;
        }
    }

    callback(name, result) {
        let self = this;
        let batchListener = self.feedback[name];
        if (!batchListener) {
            console.log("No listener to invoke:" + name);
            return;
        }

        let ids = [];
        let len = batchListener.length;
        for (let i = 0; i < len; i++) {
            let listener = batchListener[i];
            let param = {
                success: (res) => {
                    if (listener.param.single) {
                        console.log("single callback:" + name + "," + i);
                        ids.push(i);
                    }
                    listener.param.success(res);
                    console.log("callback successfully:" + name);

                    if (i === len - 1) {
                        for (let j = ids.length - 1; j >= 0; j--) {
                            let index = ids[j];
                            console.log("delete listener,single index:" + name + "," + index);
                            batchListener.splice(index, 1);
                        }

                        if (batchListener.length == 0) {
                            console.log("delete single listener:" + name);
                            delete self.feedback[name];
                        }
                    }
                },
                error: (res) => {
                    console.log("callback listener failed:" + name);
                    listener.param.error(res);
                },
                data: listener.param.data
            };
            listener.notice(param, result);
        }
    }
}