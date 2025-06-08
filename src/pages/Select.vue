<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import { useDateRangeStore } from '@/stores/dateRangeStore'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props / Emits
const props = defineProps({ modelValue: Array }) // [startDate, endDate]
const emit = defineEmits(['update:modelValue', 'confirm'])

// 日期範圍狀態
const dateRange = reactive({
  start: props.modelValue?.[0] || '',
  end: props.modelValue?.[1] || ''
})

// 可否前往下一步
const canProceed = computed(() => !!dateRange.start && !!dateRange.end)

// 差幾天
const dayCount = computed(() => {
  if (!dateRange.start || !dateRange.end) return 0
  const diff = (new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24) + 1
  return diff
})

// 限制條件：從今天最多選 7 天
const today = new Date()

// flatpickr 初始化
const calendarEl = ref(null)
let pickerInstance = null

onMounted(() => {
  document.body.classList.add('custom-bg')

  pickerInstance = flatpickr(calendarEl.value, {
    inline: true,
    locale: Mandarin,
    mode: 'range',
    dateFormat: 'Y-m-d',
    defaultDate: [dateRange.start, dateRange.end],
    minDate: today,
    onChange: (selectedDates) => {
      if (selectedDates.length === 2) {
        let [start, end] = selectedDates
        const diff = (end - start) / (1000 * 60 * 60 * 24) + 1

        // 限制最多選取 7 天
        if (diff > 7) {
          end = new Date(start)
          end.setDate(start.getDate() + 6)
          pickerInstance.setDate([start, end], true)
        }

        const [startStr, endStr] = [start, end].map(d => d.toLocaleDateString('sv-SE'))
        dateRange.start = startStr
        dateRange.end = endStr
        emit('update:modelValue', [startStr, endStr])
      }
    }
  })
})

onBeforeUnmount(() => {
  document.body.classList.remove('custom-bg')
  if (pickerInstance) pickerInstance.destroy()
})

// 下一步
function goNext() {
 if (canProceed.value) {
    emit('confirm', [dateRange.start, dateRange.end])

    // 新增：初始化 pinia store
    const dateRangeStore = useDateRangeStore()
    dateRangeStore.setDates(dateRange.start, dateRange.end)

    
    router.push({
      path: '/Order',
      query: {
        start: dateRange.start,
        end: dateRange.end
      }
    })
  }
}
</script>


<template>
<FrontLayout>
  <div class="date-range-picker">
    <h3>請選擇餐食期間</h3>
    <div class="fitwid">
        <i class="bi bi-info-circle-fill"></i>
        <h5>單筆訂單最多選擇 7 日，如需大量訂購，請來電預約</h5>
    </div>
    <div class="pickrwrap">
        <div ref="calendarEl" class="calendar-inline" />
    </div>

    <div v-if="dateRange.start && dateRange.end" class="output">
      <h4>{{ dateRange.start }} — {{ dateRange.end }}</h4>
      <h4><strong>共 {{ dayCount }} 日</strong></h4>
    </div>

    <button class="btn-2" 
            :disabled="!canProceed" 
            @click="goNext">下一步
    </button>
  </div>

</FrontLayout>
</template>

<style>
.custom-bg{
background-image: url(../assets/images/Order/background.svg);
}
</style>

<style scoped lang="scss">

.date-range-picker {
    margin: 40px;
    text-align: center;
}

.date-range-picker h3{
    font-size: $font_h3;
}

.pickrwrap{
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

// .calendar-input {
//   padding: 12px;
//   font-size: 16px;
//   margin-bottom: 12px;
// }

input.flatpickr-input {
  display: none;
}

:deep(.flatpickr-day.startRange),
:deep(.flatpickr-day.endRange) {
  background-color: $primary_600;
  color: white;
  font-weight: bold;
  border: none;
}

/* 中間區間色淡一點 */
:deep(.flatpickr-day.inRange) {
  background-color: $primary_100;
  -webkit-box-shadow:-5px 0 0 #fbedca, 5px 0 0 #fbedca;
  box-shadow:-5px 0 0 #fbedca, 5px 0 0 #fbedca;
  color: $neutral_black;
  border: none;
  margin: 0;
  gap: 0;
}

:deep(.flatpickr-day:hover) {
  background: #ffcc80 !important;
  border: none;
}

:deep(.flatpickr-day.disabled) {
//   background-color: #f0f0f0 !important;
  color: $neutral_300 !important;
  cursor: not-allowed !important;
}

h4{
    margin-top: 12px;
    font-size: $font_h4;
    font-weight: normal;
}

.btn-2 {
    margin: 24px 0;
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;
    cursor: pointer;

    &:not(:disabled):hover {
        background-color: transparent;
        color: $neutral_black;
    }

    &:disabled {
        background-color: $neutral_300;
        border: 2px solid $neutral_300;
        cursor: not-allowed;
    }
}

.fitwid{
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
    color: $neutral_black;
    opacity: .7;
}

.fitwid i{
    padding-top: 2px;
}

.fitwid h5{
    font-size: $font_h5;
    font-weight: normal;
}

</style>