/* eslint-disable no-useless-escape */
// 查询url中的某个键值
export const query = (name) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
};

// mm:ss转换成ms
export const mmsstransformMill = (time) => {
    if (time) {
        const arr = time.split(':');
        const ms = (arr[0] - 0) * 60 * 1000 + (arr[1] - 0) * 1000;
        return ms;
    }
    return undefined;
};

export const parseWord = ({ text = '', wordClass = '', wordGroupLabel = '' } = {}) => {
    if (text === '' || wordClass === '') return '';
    const wordExp = 'A-Za-z\\-’\\\'ˈˌ•';
    const reg0 = new RegExp(`((<[^<>]*>)*)([^${wordExp}<>]*)([${wordExp}]+)?([^${wordExp}<>]*)((<\\/[^<>]*>)*)`, 'g');
    const reg1 = new RegExp(`<span class="${wordClass}"></span>`, 'g');
    const reg2 = new RegExp(`<span class="${wordClass}">([${wordExp}]+)</span>`, 'g');
    const wordText = text
        .replace(reg0, `$1$3<span class="${wordClass}">$4</span>$5$6`)
        .replace(reg1, '');
    if (wordGroupLabel === '') return wordText;
    const temp = document.createElement('div');
    temp.innerHTML = wordText;
    const nodeList = temp.querySelectorAll(wordGroupLabel);
    [].forEach.call(nodeList, (element) => {
        const el = element;
        const textCont = element.innerHTML.replace(reg2, '$1');
        el.innerHTML = textCont;
        el.classList.add(wordClass);
    });
    return temp.innerHTML;
};
// 输入框中文转英文，指定输入字符集
export function replaceEn(val) {
    // ,.?!:;’”“”‘’/\|[](){}﹤﹥_+-*=%$¥@#&£€
    // eslint-disable-next-line no-useless-escape
    const reg = /[^\,\.\?\!\:\;\'\"\“\”\‘\’\/\\\[\]\(\)\{\}\<\>\_\+\=\*\-\%\$\¥\@\#\&\£\€\u0020\n\t\f\v\r\d\a-zA-Z]/g;
    const reg1 = /[\。\：\；\，\‘\’\！\？\“\”\—\【\】\（\）\｛\｝\＊\￥]/g;
    const dotJSON = {
        '％': '%',
        '…': '...',
        '。': '.',
        '：': ':',
        '；': ';',
        '，': ',',
        '‘': "'",
        '’': "'",
        '！': '!',
        '？': '?',
        '“': '"',
        '”': '"',
        '—': '-',
        '【': '[',
        '】': ']',
        '（': '(',
        '）': ')',
        '｛': '{',
        '｝': '}',
        '': '',
        '＊': '*',
        '￥': '¥',
        '￡': '£',
        '＆': '&',
    };
    let value = val;
    value = value.replace(reg1, (_val) => dotJSON[_val]).replace(/\u0020+/g, ' ').replace(/\n+/g, '\n').replace(reg, (_val) => {
        if (_val.match(/\s+/g)) {
            return ' ';
        }
        return '';
    });
    return value;
}

// 去提升作答组件 状态 0- 未开始 11- 进行中（未提交过）12-进行中（至少提交过一次）2 - 完成
export const UpgradeStateEnum = {
    NOTSTART: 0, // 未开始
    PROCESSINGNOTSUBMIT: 11, // 进行中 未提交过
    PROCESSINGNSUBMIT: 12, // 进行中 至少提交过一次
    FINISH: 2, // 完成
};

// 将时间转换成年月日的形式
export function transDays(time) {
    const date = new Date(time - 0);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month > 9 ? month : `0${month}`;
    day = day > 9 ? day : `0${day}`;
    return `${year}-${month}-${day}`;
}

export function deepClone(orginObject) {
    if (orginObject == null || typeof orginObject !== 'object') {
        return;
    }

    const resultObject = {};
    // 深度遍历需要创建栈
    const queue = [];

    Object.keys(orginObject).forEach((key) => {
        queue.push({
            key,
            value: orginObject[key],
            parent: resultObject,
        });
    });

    while (queue.length) {
        const currentNode = queue.shift();
        const { parent } = currentNode;
        const currentKey = currentNode.key;
        const currentValue = currentNode.value;
        // 若是无下属对象，返回其值
        if (currentValue == null || typeof currentValue !== 'object') {
            parent[currentKey] = currentValue;
        } else {
            // 若下属值是对象，将子节点压入栈中
            parent[currentKey] = Object.prototype.toString.call(currentValue) === '[object Array]' ? [] : {};
            Object.keys(currentValue).forEach((key) => {
                queue.push({
                    key,
                    value: currentValue[key],
                    parent: parent[currentKey],
                });
            });
        }
    }
    // eslint-disable-next-line consistent-return
    return resultObject;
}
// 写作组件pageState
export const CUR_PAGE_STATE = {
    WRITE_TIGANG: -1, // 列提纲页面
    WRITE_BEGIN: 0, // 开始写作页面未提交
    WRITE_BEGIN_MARKING: 11, // 开始写作业页面批改中
    WRITE_BEGIN_MARKFAIL: 12, // 开始写作业页面批改失败
    WRITE_REPORT: 2, // 写作报告
    WRITE_REPORT_FANKUI: 21, // 写作报告反馈弹窗弹出
    WRITE_MODIFY_NOCHECK: 31, // 修改页面未检查
    WRITE_MODIFY_NOSUBMIT: 32, // 修改页面检查了但没提交
    WRITE_MODIFY_MARKFAIL: 33, // 修改页面批改失败
    WRITE_MODIFY_MARKING: 34, // 修改页面批改中
    WRITE_MODIFY_MODIFYED: 35, // 检查页面修改了但未提交
};
// 0-开始写作页面，不显示检查按钮只显示提交按钮；1-批改中页面；2-批改结果页面; 3-修改页面
export const PageTypeEnum = {
    GOWRITING: 0, // 开始写作
    MARK: 1, // 批改中
    WRITINGREPORT: 2, // 批改结果
    WRITINGEDIT: 3, // 去修改
};

/**
 * 去掉字符串中的"font-size"、"font-familly"样式
 * @param text
 * @returns {string}
 */
export function clearFSizeFFamilly(text) {
    if (typeof text !== 'string') {
        return text;
    }
    let _text = text;
    _text = _text.replace(/font-size:\s*\d+px/g, '').replace(/(font-family:[^><;"]*(;)?)/ig, '');
    return _text;
}

/**
 * 四舍五入函数
 * （js当中的toFixed() 函数四舍五入规则"4舍6入" 末尾是5时,结果不正确 ）
 * @param {*} num 小数
 * @param {*} s 保留小数点位数
 */
export function toFixed(num, s) {
    const times = 10 ** s;
    let des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return des;
}

// 生成路径
export const dir = (_src, _pagePath) => {
    const _pagePath1 = _pagePath;
    const { globalConfig: { pagePath: _pagePath2 } = {} } = window || {};
    const pagePath = _pagePath1 || _pagePath2;
    return `./${pagePath.replace(/\\/g, '/')}/${_src}`;
};

/**
 * 时间戳转化为时间字符串
 * @param {timeStamp} timeStamp
 * @return {string} "2019-10-30 20:33"
 */
export const timeStampToString = (_timeStamp, sign = '-') => {
    const fixZero = (num) => (num >= 10 ? `${num}` : `0${num}`);
    const timeStamp = _timeStamp;
    const date = new Date(parseInt(timeStamp, 10));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dateTime = `${year}${sign}${fixZero(month)}${sign}${fixZero(day)} ${fixZero(hours)}:${fixZero(minutes)}`;
    return dateTime;
};

export const time2Str = (timeStamp, format) => {
    const time = new Date(timeStamp);
    const zeroFill = (num, len = 0) => {
        if (num >= 10 ** len) {
            return num;
        }
        const l = num.toString().length;
        const diff = len - l;
        return `${new Array(diff).fill(0).join('')}${num}`;
    };
    return format.replace(/Y+|M+|D+|h+|m+|s+|S+|/g, (match) => {
        if (match.indexOf('Y') >= 0) {
            return zeroFill(time.getFullYear(), match.length);
        }
        if (match.indexOf('M') >= 0) {
            return zeroFill(time.getMonth() + 1, match.length);
        }
        if (match.indexOf('D') >= 0) {
            return zeroFill(time.getDate(), match.length);
        }
        if (match.indexOf('h') >= 0) {
            return zeroFill(time.getHours(), match.length);
        }
        if (match.indexOf('m') >= 0) {
            return zeroFill(time.getMinutes(), match.length);
        }
        if (match.indexOf('s') >= 0) {
            return zeroFill(time.getSeconds(), match.length);
        }
        if (match.indexOf('S') >= 0) {
            return time.getMilliseconds();
        }
        return '';
    });
};

/**
 * 版本判断当前版本是否满足版本要求
 * @param  {String} currentVersion [当前版本] '4.0.6'(PC 3.0.0.184)
 * @param  {String} minimumVersion [要求版本] '3.2.2'(PC 3.0.0.184)
 * @return {Boolean}                [description]
 */
export const versionJudgment = (currentVersion, minimumVersion) => {
    if (typeof currentVersion !== 'string' || typeof minimumVersion !== 'string') return true;
    const currentVersionArr = currentVersion.replace(/[^\d\.]/g, '').split('.').map((unit) => parseInt(unit, 10) || 0);
    const minimumVersionArr = minimumVersion.replace(/[^\d\.]/g, '').split('.').map((unit) => parseInt(unit, 10) || 0);
    const len = 3;
    for (let i = 0; i < len; i++) {
        const unit = currentVersionArr[i] || 0;
        const _unit = minimumVersionArr[i] || 0;
        if (unit > _unit) {
            return true;
        }
        if (unit < _unit) {
            return false;
        }
    }
    return true;
};

export function stringToCamel(str) {
    const temp = str.split('-');
    for (let i = 1; i < temp.length; i++) {
        temp[i] = temp[i][0].toUpperCase() + temp[i].slice(1);
    }
    return temp.join('');
}
