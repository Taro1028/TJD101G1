<script setup>
const emit = defineEmits(['close'])

function closePopup() {
  emit('close')
}
</script>
<template>
<div class="overlay">
    <div class="selectblock">
        <div class="consigneeblock">
            <h5>選擇常用收貨人</h5>
            <button class="closebtn" @click="closePopup"><i class="bi bi-x-circle"></i></button>
            <div class="consigneelist">
                <div class="item">
                    <div class="itemblock">
                        <input class="radio" type="radio" checked>
                        <div class="iteminfo">
                            <div class="name">林榮傑</div>
                            <div class="phone">(+886) 0987-078-587</div>
                            <div class="addr">104 臺北市中山區南京東路三段</div>
                        </div>
                    </div>
                    <button class="del"><i class="bi bi-trash3"></i></button>
                </div>
                <div class="item">
                    <div class="itemblock">
                        <input class="radio" type="radio">
                        <div class="iteminfo">
                            <div class="name">王淑華</div>
                            <div class="phone">(+886) 0987-123-456</div>
                            <div class="addr">104 臺北市中山區南京東路三段</div>
                        </div>
                    </div>
                    <button class="del"><i class="bi bi-trash3"></i></button>
                </div>
                <div class="item">
                    <div class="itemblock">
                        <input class="radio" type="radio">
                        <div class="iteminfo">
                            <div class="name">陳冠傑</div>
                            <div class="phone">(+886) 0987-888-997</div>
                            <div class="addr">104 臺北市中山區南京東路三段</div>
                        </div>
                    </div>
                    <button class="del"><i class="bi bi-trash3"></i></button>
                </div>
                <div class="item">
                    <div class="addinfo">
                        <button><i class="bi bi-plus-circle"></i></button>
                        <button><p>新增常用收貨人</p></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnblock">
        <router-link to="/Order" class="btn-1">取消</router-link>
        <button @click="closePopup" class="btn-2">確定</button>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.selectblock{
    width: 570px;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    position: relative;
}

.closebtn{
    position: absolute;
    right: 24px;
    top: 20px;
    background-color: transparent;
    border: none;
    width: 32px;
    height: 32px;
    padding: 0;

    &:hover{
        cursor: pointer;
    }
}

.closebtn i{
    font-size: 24px;
}

.consigneeblock{
    display: flex;
    flex-direction: column;
    align-self: start;
    gap: 24px;
}

.consigneeblock h5{
    font-size: $font_h5;
}

.consigneelist{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item{
    display: flex;
    align-items: center;
    width: 560px;
    justify-content: space-between;
}

.itemblock{
    display: flex;
    gap: 12px;
    align-items: center;
}

.radio{
    width: 20px;
    height: 20px;
}



.iteminfo{
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.name{
    font-weight: bold;
}

.phone,
.addr{
    color: $neutral_700;
}

.del{
    background-color: transparent;
    border: none;
}

.del i{
    font-size: 20px;
    color: $neutral_300;
}

.addinfo{
    padding: 8px 0;
    display: flex;
    gap: 12px;
}

.addinfo button{
    background-color: transparent;
    height: 40px;
    border: none;
    padding: 0;
    color:$primary_600;
}

.addinfo i{
    font-size: 20px;
}

.btnblock{
    display: flex;
    gap: 40px;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

// --- RWD ---
@media screen and (max-width: 660px){
    .selectblock{
        width: 300px;
    }

    .item{
        width: 300px;
    }
}

</style>