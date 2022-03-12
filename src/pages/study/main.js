import Vue from 'vue';
import { Application, Flipbook, Logger } from '@up366/u3-flip-sdk';
import App from './App.vue';
import 'normalize.css/normalize.css';
import router from '@/pages/study/router';
// eslint-disable-next-line import/extensions
import { versionJudgment } from '@/utils/util';
// eslint-disable-next-line import/extensions
import LoadFile from '@/utils/loadFile';

const MIN_VERSION = {
    TEACHER: '4.1.0',
    STUDENT: '5.1.0.0',
};

if (window.jsBridgeObj) { // 客户端学习页宿主环境下
    Application.getAppInfo().then(async (data) => {
        const logger = Logger.getLogger('HTML');
        const {
            client, versions, os,
        } = data;
        let isSupport;
        let minVersion;
        if (client === 'TEACHER') {
            minVersion = MIN_VERSION.TEACHER;
            isSupport = versionJudgment(versions, MIN_VERSION.TEACHER);
        } else {
            minVersion = MIN_VERSION.STUDENT;
            isSupport = versionJudgment(versions, MIN_VERSION.STUDENT);
        }
        if (!isSupport) {
            logger.info(`需要v${minVersion}客户端，请升级`);
            return;
        }
        const page = await Flipbook.getPageInfo();
        if (!page) {
            logger.info('页面数据不存在，请重新加载');
            return;
        }
        const { pagePath } = page;
        const version = Date.now();
        const loadFile = new LoadFile();
        let url;
        // eslint-disable-next-line no-undef
        if (IS_SERVICE) {
            const bookInfo = await Flipbook.getBookInfo();
            const { bookId } = bookInfo;
            url = `http://book.up366.cn/upload/zipfile/${os === 'PC' ? 'Pc' : 'Mobile'}/${bookId}/${pagePath}/page1.js?${version}`;
        } else {
            url = `${pagePath}/page1.js?${version}`;
        }
        await loadFile.load(url);
        new Vue({
            router,
            components: { App },
            render: (h) => h(App),
        }).$mount('#app');
    });
} else {
    new Vue({
        router,
        components: { App },
        render: (h) => h(App),
    }).$mount('#app');
}
