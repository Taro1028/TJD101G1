<script setup>
import { ref } from 'vue'

defineProps({
  logo: String,
  title: String,
  description: String,
  isFlipped: Boolean
})

defineEmits(['flip'])
</script>


<template>
  <div class="card" @click.stop="$emit('flip')">
    <div class="card-inner" :class="{ flipped: isFlipped }">
      <div class="card-front">
        <img :src="logo" alt="logo" />
      </div>
      <div class="card-back">
        <h4>{{ title }}</h4>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.card {
    width: 240px;
    height: 240px;
    perspective: 1000px;
    cursor: pointer;
}

.card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 1s;
    transform-style: preserve-3d;
}

.card-inner.flipped {
    transform: rotateY(180deg);
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.card-front img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 20px;
}

.card-back {
    background-color: $primary_100;
    transform: rotateY(180deg);
    flex-direction: column;
    text-align: center;
}

.card-back h4 {
    font-size: $font_h5;
    margin-bottom: 20px;
    color: $primary_600;
}

.card-back p {
    font-size: $font_h6;
    color: $primary_600;
    line-height: 1.6;
    letter-spacing: 2px;
    margin: 5px;
}

@media (max-width: 820px) {
}

@media (max-width: 620px) {
  .card {
    width: 160px;
    height: 160px;
  }

  .card-back h4 {
    font-size: $font_h6;
    margin-bottom: 8px;
    color: $primary_600;
}

.card-back p {
    font-size: $font_p;
    color: $primary_600;
    line-height: 1.2;
    letter-spacing: 0;
    margin: 5px;
}

}

@media (max-width: 420px) {
}

</style>