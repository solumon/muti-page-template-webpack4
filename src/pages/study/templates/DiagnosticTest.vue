<template>
    <div class="diagnostic-test">
        <div class="title">
            诊断测试
        </div>
        <div class="content">
            <div
                v-for="(item, index) in 10"
                :key="index"
                class="item"
            >
                诊断测试内容:{{ item }}
            </div>
        </div>
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.diagnostic-test {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .title {
        font-size: 20px;
    }

    .item {
        font-size: 15px;
        color: bisque;
    }
}
</style>
