<template>
    <div class="micro-skills">
        <div class="title">
            微技能
        </div>
        <div class="content">
            <div
                v-for="(item, index) in 30"
                :key="index"
                class="item"
            >
                微技能: {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.micro-skills {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
        font-size: 20px;
    }

    .item {
        font-size: 15px;
        color: rebeccapurple;
    }
}
</style>
