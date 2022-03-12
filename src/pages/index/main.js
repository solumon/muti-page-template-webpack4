import Vue from 'vue';
import { Application, Logger } from '@up366/u3-flip-sdk';
import App from './App.vue';
import 'normalize.css/normalize.css';
// eslint-disable-next-line import/extensions
import { versionJudgment } from '@/utils/util';

const MIN_VERSION = {
    TEACHER: '4.1.0',
    STUDENT: '5.1.0.0',
};

if (window.jsBridgeChapterObj) {
    Application.getAppInfo().then(async (data) => {
        const logger = Logger.getLogger('HTML');
        const {
            client, versions,
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
        new Vue({
            components: { App },
            render: (h) => h(App),
        }).$mount('#app');
    });
} else {
    new Vue({
        components: { App },
        render: (h) => h(App),
    }).$mount('#app');
}
