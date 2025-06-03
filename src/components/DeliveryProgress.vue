<template>
    <section class="accordion accordion--radio">
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd1">
        <label for="rd1" class="tab__label"><i class="bi bi-envelope"> 訂單編號：020</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd2">
        <label for="rd2" class="tab__label"><i class="bi bi-envelope"> 訂單編號：019</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd3">
        <label for="rd3" class="tab__label"><i class="bi bi-envelope"> 訂單編號：018</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd4">
        <label for="rd4" class="tab__label"><i class="bi bi-envelope"> 訂單編號：017</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd5">
        <label for="rd5" class="tab__label"><i class="bi bi-envelope"> 訂單編號：016</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd6">
        <label for="rd6" class="tab__label"><i class="bi bi-envelope"> 訂單編號：015</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd7">
        <label for="rd7" class="tab__label"><i class="bi bi-envelope"> 訂單編號：013</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="rd8">
        <label for="rd8" class="tab__label"><i class="bi bi-envelope"> 訂單編號：012</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <DeliveryStatusLine />
          <p>2025/05/04 下訂</p>
        </div>
    </div>
    <div class="tab">
        <input type="radio" name="accordion-2" id="close-tab">
        <label for="close-tab" class="tab__close">關閉訂單 &times;</label>
    </div>
    </section>
</template>

<script setup>
import DeliveryStatusLine from '../components/DeliveryStatusLine.vue';
</script>

<style scoped>

/* Core styles/functionality */
.tab {
  position: relative;
}
.tab input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
.tab__content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.35s;
}
.tab input:checked ~ .tab__content {
  max-height: 10rem;
}

/* Visual styles */
.accordion {
  color: #f6f4ef; 
  border: 2px solid;
  border-radius: 0.5rem;
  overflow: hidden;
}
.tab__label,
.tab__close {
  display: flex;
  color: #4f4f4f;
  background: #f6f4ef; 
  cursor: pointer;
}
.tab__label {
  justify-content: space-between;
  padding: 1rem;
}

.tab__label i {
  font-style: normal;
  font-size: 20px;
}

.tab__label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transform: rotate(90deg);
  transition: all 0.35s;
}
.tab input:checked + .tab__label::after {
  transform: rotate(270deg);
}
.tab__content p {
  margin: 0;
  padding: 0.9rem;
  color: #262626;
  line-height: 0.3;
}
.tab__close {
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}
.accordion--radio {
  color: #b0b0b0;
}

/* Arrow animation */
.tab input:not(:checked) + .tab__label:hover::after {
  animation: bounce .5s infinite;
}
@keyframes bounce {
  25% {
    transform: rotate(90deg) translate(.25rem);
  }
  75% {
    transform: rotate(90deg) translate(-.25rem);
  }
}
 
  @media (max-width: 600px) {
    .tab__label i {
      font-size: 16px;
    }

  }

   @media (max-width: 460px) {
    .tab__content p {
      line-height: 1.2;
    }
   }



</style>