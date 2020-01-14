export default class DB {
    constructor(dbName, storeName, version, param) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;

        const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
        const request = indexedDB.open(this.dbName, version);

        request.onsuccess = (e) => {
            console.log("successfully to init db:" + dbName);
            this.db = e.target.result;
            if (param && param.success) {
                param.success("inited db:" + dbName);
            }
        };

        request.onupgradeneeded = (e) => {
            console.log("successfully to update db.");
            this.db = e.target.result;
            if (!this.db.objectStoreNames.contains(storeName)) {
                this.store = this.db.createObjectStore(storeName);
            }
            console.log('DB version changed, db version:' + this.db.version);
        };

        request.onerror = (e) => {
            console.log("failed to init db:" + e.target.error);
            if (param && param.error) {
                param.error(e.target.error);
            }
        };
    }

    get(key, param) {
        const transaction = this.db.transaction(this.storeName);
        const model = transaction.objectStore(this.storeName);
        const query = model.get(key);

        let self = this;
        query.onsuccess = (e) => {
            console.log("successfully to get db:" + self.storeName);
            if (param && param.success) {
                param.success(e.target.result);
            }
        };

        query.onerror = (e) => {
            console.log("failed to get db:" + self.storeName + "," + e.target.error);
            if (param && param.error) {
                param.error(e.target.error);
            }
        };
    }

    merge(key, value, param) {
        this.get(key, {
            success: (oldValue) => {
                if (oldValue) {
                    this.update(key, value, param);
                } else {
                    this.add(key, value, param);
                }
            },
            error: (e) => {
                console.log("failed to merge db:" + e.target.error);
                if (param && param.error) {
                    param.error(e.target.error);
                }
            }
        });
    }

    add(key, value, param) {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const model = transaction.objectStore(this.storeName);
        const request = model.add(value, key);

        request.onsuccess = (e) => {
            console.log("successfully to add db.");
            if (param && param.success) {
                console.log("successfully to add to db:" + key + "," + JSON.stringify(value));
                param.success(e.target.result);
            }
        };

        request.onerror = (e) => {
            console.log("failed to add db:{0}", e.target.error);
            if (param && param.error) {
                param.error(e.target.error);
            }
        };
    }

    update(key, value, param) {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const model = transaction.objectStore(this.storeName);
        const request = model.put(value, key);

        request.onsuccess = (e) => {
            console.log("successfully to update to db:" + key);
            if (param && param.success) {
                param.success(e.target.result);
            }
        };

        request.onerror = (e) => {
            console.log("failed to update db:" + e.target.error);
            if (param && param.error) {
                param.error(e.target.error);
            }
        };
    }

    delete(key, param) {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const model = transaction.objectStore(this.storeName);
        const request = model.delete(key);

        request.onsuccess = (e) => {
            console.log("successfully to delete db.");
            if (param && param.success) {
                param.success(e.target.result);
            }
        };

        request.onerror = (e) => {
            console.log("failed to delete db:" + e.target.error);
            if (param && param.error) {
                param.error(e.target.error);
            }
        };
    }

    close() {
        this.db.close();
    }
}