<template>
    <div id="root">
        <router-view />
    </div>
</template>

<script>
export default {
    created() {
        setTimeout(() => {
            console.log('数据加载完成');
            // this.$router.push({
            //     path: '/diagnostic-test',
            // });
        }, 1000);
    },
};
</script>
<style lang="scss" scoped>
#root {
    height: 100vh;
}
</style>
