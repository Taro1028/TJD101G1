<template>
    <div>
        <section>
            <img src="../../assets/images/Logo_S.svg" alt="">
            <p class="word">後台中心</p>
            <img src="../../assets/images/Admin/userphoto.png" alt="">
        </section>
    </div>
</template>

<script setup>
   
</script>

<style lang="scss" scoped>
section{
    display: flex;
    background-color: $primary_100;
}
section .word{
    font-size: $font_h5;
    display: flex;
    align-items: center;
   margin: 0;
}
section img:nth-of-type(2){
  
    width: 60px;
    border-radius: 50%;
   margin-left: auto;
   padding: 10px;
}
</style>