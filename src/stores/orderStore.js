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
          { name: '舒心控醣餐', count: 0, price: 380 },
          { name: '柔食樂活餐', count: 0, price: 330 },
          { name: '蔬食養生餐', count: 0, price: 360 }
        ]
      }))
    },

    updateMealCount(date, mealName, newCount) {
      const day = this.planForYouSelections.find(d => d.date === date)
      if (!day) return

      const totalCount = day.meals.reduce((sum, meal) => sum + meal.count, 0)
      const currentMeal = day.meals.find(m => m.name === mealName)
      if (!currentMeal) return

      const countDifference = newCount - currentMeal.count
      const newTotal = totalCount + countDifference

      if (newTotal <= 10 && newCount >= 0) {
        currentMeal.count = newCount
      }

      // const meal = day.meals.find(m => m.name === mealName)
      // if (meal) {
      //   meal.count = count
      // }
    },
    getTotalCountForDate(date) {
      const day = this.planForYouSelections.find(d => d.date === date)
      if (!day) return 0
      return day.meals.reduce((sum, meal) => sum + meal.count, 0)
    },
    getTotalPriceForDate(date) {
      const day = this.planForYouSelections.find(d => d.date === date)
      if (!day) return 0
      return day.meals.reduce((sum, meal) => sum + meal.count * meal.price, 0)
    }
  }
})