import { defineStore } from 'pinia'
import { getDatesInRange } from '@/utils/date'

export const useOrderStore = defineStore('order', {
  state: () => ({
    dateRange: {
      start: '',
      end: ''
    },
    selectedPlan: '',
    planForYouSelections: []
  }),

  getters: {
    deliveryDates: (state) => {
      return state.planForYouSelections.map(selection => selection.date)
    }
  },


  actions: {
    initDateRange(start, end) {
      this.dateRange.start = start
      this.dateRange.end = end
      const dates = getDatesInRange(start, end)

      this.planForYouSelections = dates.map(date => ({
        date,
        meals: [
          { name: '樂活元氣餐', count: 0, price: 320 },
          { name: '安心控醣餐', count: 0, price: 320 },
          { name: '柔食樂活餐', count: 0, price: 320 },
          { name: '蔬食養生餐', count: 0, price: 360 }
        ]
      }))
    },

    updateMealCount(date, mealName, count) {
      const day = this.planForYouSelections.find(d => d.date === date)
      if (!day) return

      const meal = day.meals.find(m => m.name === mealName)
      if (meal) {
        meal.count = count
      }
    }
  }
})