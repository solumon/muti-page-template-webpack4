export default function Load(promise) {
    this.promise = promise || Promise.resolve();
    return this;
}

Load.prototype.load = function (...rest) {
    this.promise = this.promise.then(() => {
        const promises = Load.getLoadPromises(rest);
        return Promise.all(promises).catch((e) => { console.error(e); });
    });
    return new Load(this.promise);
};

Load.prototype.then = function (callback, isAsync) {
    this.promise = this.promise.then((data) => new Promise(((resolve) => {
        if (isAsync) {
            callback(resolve, data);
        } else {
            const _data = callback(data);
            resolve(_data);
        }
    })).catch((e) => { console.error(e); }));
    return new Load(this.promise);
};

Load.getLoadPromises = function (params) {
    const promises = params.map((url) => new Promise(((resolve) => {
        const type = Load.parseType(url);
        switch (type) {
        case 'js':
            Load.loadScript(url, resolve);
            break;
        case 'css':
            Load.loadLink(url, resolve);
            break;
        default:
            console.error(`unknow type! ${url}`);
        }
    })));
    return promises;
};

Load.parseType = function (url) {
    const urlArr = url.split('?');
    const urls = urlArr[0].split('.');
    const end = urls[urls.length - 1];
    return end.toLowerCase();
};

Load.loadScript = function (url, resolve) {
    if (Load.loaded[url]) {
        resolve();
        return;
    }
    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    // node.async = true;
    node.src = url;
    Load.appendNode(node, url, resolve);
};

Load.loadLink = function (url, resolve) {
    if (Load.loaded[url]) {
        resolve();
        return;
    }
    const node = document.createElement('link');
    node.rel = 'stylesheet';
    node.href = url;
    document.getElementsByTagName('head')[0].appendChild(node);
    Load.isCSSLoaded(node, url, resolve);
};

Load.isCSSLoaded = function (node, url, resolve) {
    let isLoaded = false;
    try {
        if (node.sheet) {
            isLoaded = true;
        } else if (node.styleSheet) {
            isLoaded = true;
        } else if (node.innerHTML) {
            isLoaded = true;
        }
    } catch (ex) {
        // FF下的判断跨域，也不行，路径错了还是抛这个异常,
        // 在发生此异常时，我们默认css加载成功
        if (ex.name && ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
            isLoaded = true;
        }
    }
    if (isLoaded) {
        resolve();
    } else {
        setTimeout(() => {
            Load.isCSSLoaded(node, url, resolve);
        }, 50);
    }
};

Load.appendNode = function (node, url, resolve) {
    const _node = node;
    if (_node.readyState) {
        _node.onreadystatechange = function () {
            if (_node.readyState === 'loaded' || _node.readyState === 'complete') {
                _node.onreadystatechange = null;
                Load.loaded[url] = true;
                resolve();
            }
        };
    } else {
        _node.onload = function () {
            Load.loaded[url] = true;
            resolve();
        };
        _node.onerror = function (e) {
            console.error(e);
            resolve();
        };
    }

    document.getElementsByTagName('head')[0].appendChild(_node);
};

Load.loaded = {};
