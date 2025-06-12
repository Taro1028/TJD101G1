<script setup>
import FrontLayout from "../layouts/FrontLayout.vue";
import MarqueeText from '@/components/MarqueeText.vue';
import CoreValues from '@/components/CoreValues.vue';
import MainGoals from '@/components/MainGoals.vue';
import Gotop from "../components/Gotop.vue";


</script>

<template>
    <FrontLayout>
        <div class="about">
            <MarqueeText />
            <CoreValues />
            <MainGoals />
        </div>
        <Gotop />
    </FrontLayout>
</template>

<style scoped lang="scss">
.about{
    width: 100%;
    background-color: $primary_50;
}

</style>