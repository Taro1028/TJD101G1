// stores/cartStore.js - 修正多日計算問題
import { defineStore } from 'pinia'
import { useMemberStore } from './MemberStore'

const env = import.meta.env.VITE_API_URL || 'http://localhost'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // 購物車項目
  }),

  getters: {
    // 取得當前用戶ID（從 MemberStore）
    currentMemberId(state) {
      const memberStore = useMemberStore()
      return memberStore.isAuthenticated ? memberStore.memberId : null
    },

    // 檢查是否有登入用戶
    hasUser(state) {
      return this.currentMemberId !== null
    },

    // 計算購物車總數量
    totalQuantity(state) {
      return state.items.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0)
    },

    // 計算購物車總金額
    totalAmount(state) {
      return state.items.reduce((total, item) => total + (parseFloat(item.dailyTotalAmount) || 0), 0)
    },

    // 獲取購物車群組（按 cart_id 分組）- 修正版本
    cartGroups(state) {
      const groups = {}
      
      state.items.forEach(item => {
        const cartId = item.cart_id
        if (!groups[cartId]) {
          groups[cartId] = {
            cart_id: cartId,
            plan_type: item.plan_type,
            order_start_date: item.order_start_date,
            order_end_date: item.order_end_date,
            total_days: item.total_days,
            message_card_id: item.message_card_id || null,
            total_meal_count: 0,
            total_amount: 0,
            items: []
          }
        }
        
        // 確保數據類型正確並累加
        const quantity = parseInt(item.quantity) || 0
        const amount = parseFloat(item.dailyTotalAmount) || 0
        
        groups[cartId].total_meal_count += quantity
        groups[cartId].total_amount += amount
        groups[cartId].items.push(item)
      })
      
      // 調試輸出
      console.log('=== cartGroups 計算結果 ===')
      Object.values(groups).forEach((group, index) => {
        console.log(`Group ${index + 1}:`, {
          cart_id: group.cart_id,
          plan_type: group.plan_type,
          total_days: group.total_days,
          items_count: group.items.length,
          total_meal_count: group.total_meal_count,
          total_amount: group.total_amount,
          individual_items: group.items.map(item => ({
            date: item.date,
            quantity: item.quantity,
            dailyTotalAmount: item.dailyTotalAmount
          }))
        })
      })
      console.log('========================')
      
      return Object.values(groups)
    }
  },

  actions: {
    /**
     * 初始化購物車（在用戶登入後呼叫）
     */
    async initializeCart() {
      const memberStore = useMemberStore()
      
      if (memberStore.isAuthenticated) {
        console.log('🛒 用戶已登入，載入購物車：', memberStore.memberName)
        await this.fetchCartItemsFromBackend()
      } else {
        console.log('👤 用戶未登入，清空購物車')
        this.items = []
      }
    },

    /**
     * 當用戶登出時清空購物車
     */
    clearCartOnLogout() {
      console.log('🚪 用戶登出，清空購物車')
      this.items = []
    },

    /**
     * 將訂單項目加入購物車
     * @param {Array} orderItems - 訂單項目陣列
     * @param {Number|null} messageCardId - 留言小卡 ID（可選）
     */
    async addOrderToBackendAndLocalCart(orderItems, messageCardId = null) {
      try {
        // 檢查用戶登入狀態
        if (!this.hasUser) {
          throw new Error('請先登入才能加入購物車')
        }

        // 準備傳送的資料
        const orderPayload = {
          m_id: this.currentMemberId, // 統一使用 m_id 對應資料庫欄位
          order_items: orderItems
        };

        // 如果有留言小卡 ID，才加入
        if (messageCardId) {
          orderPayload.message_card_id = messageCardId;
        }

        console.log('=== cartStore 準備傳送到後端 ===');
        console.log('會員ID:', this.currentMemberId);
        console.log('orderPayload:', JSON.stringify(orderPayload, null, 2));

        const response = await fetch(env + '/tjd101/g1/php/add_to_cart.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderPayload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ 訂單添加成功:', result.message);
          // 加入成功後，重新獲取購物車資料
          await this.fetchCartItemsFromBackend();
          return result;
        } else {
          throw new Error(result.message || 'API 失敗');
        }

      } catch (error) {
        console.error('❌ 加入購物車失敗:', error);
        throw error;
      }
    },

    /**
     * 從後端獲取購物車資料 - 修正版本
     */
    async fetchCartItemsFromBackend() {
      try {
        // 檢查用戶登入狀態
        if (!this.hasUser) {
          console.warn('⚠️ 沒有登入用戶，無法載入購物車')
          this.items = []
          return
        }

        const memberId = this.currentMemberId
        console.log('🔄 正在載入會員購物車，會員ID:', memberId)
        
        const response = await fetch(env + `/tjd101/g1/php/get_cart_items.php?m_id=${memberId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // 清空現有資料
          this.items = [];
          
          console.log('=== 後端返回的原始數據 ===')
          console.log('result.data:', result.data)
          
          // 轉換後端資料為前端格式
          result.data.forEach(cartGroup => {
            console.log('處理 cartGroup:', cartGroup)
            
            cartGroup.items.forEach(item => {
              console.log('處理 item:', item)
              
              this.addItemToLocalCart({
                cart_id: cartGroup.cart_id,
                plan_type: cartGroup.plan_type,
                date: item.meal_date,
                quantity: parseInt(item.count) || 0, // 確保轉換為數字
                dailyTotalAmount: parseFloat(item.total_amount) || 0, // 確保轉換為數字
                meal_items: item.meal_items,
                order_start_date: cartGroup.order_start_date,
                order_end_date: cartGroup.order_end_date,
                total_days: parseInt(cartGroup.total_days) || 0, // 確保轉換為數字
                message_card_id: cartGroup.message_card_id
              });
            });
          });
          
          console.log(`✅ 會員 ${memberId} 的購物車資料載入成功:`, this.items);
          console.log('==========================================')
        } else {
          throw new Error(result.message || '獲取購物車資料失敗');
        }
      } catch (error) {
        console.error('❌ 獲取購物車資料失敗:', error);
        throw error;
      }
    },

    /**
     * 將單個商品添加到前端本地購物車 - 修正版本
     */
    addItemToLocalCart(item) {
      if (!item || !item.quantity || item.quantity <= 0 || !item.date || !item.dailyTotalAmount) {
        console.warn('⚠️ 嘗試添加無效商品到本地購物車:', item);
        return;
      }
      
      // 確保所有數值都是正確的類型
      const cartItem = {
        cart_id: item.cart_id,
        plan_type: item.plan_type,
        date: item.date,
        quantity: parseInt(item.quantity) || 0,
        dailyTotalAmount: parseFloat(item.dailyTotalAmount) || 0,
        meal_items: item.meal_items,
        order_start_date: item.order_start_date,
        order_end_date: item.order_end_date,
        total_days: parseInt(item.total_days) || 0,
        message_card_id: item.message_card_id || null
      }
      
      console.log('添加到本地購物車:', cartItem)
      this.items.push(cartItem);
    },

    /**
     * 刪除購物車項目
     */
    async removeCartItem(cartId) {
      try {
        if (!this.hasUser) {
          throw new Error('請先登入才能操作購物車')
        }

        const response = await fetch(env + '/tjd101/g1/php/remove_cart_item.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cart_id: cartId,
            m_id: this.currentMemberId // 統一使用 m_id
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // 刪除成功後，重新獲取購物車資料
          await this.fetchCartItemsFromBackend();
          return result;
        } else {
          throw new Error(result.message || '刪除失敗');
        }
      } catch (error) {
        console.error('❌ 刪除購物車項目失敗:', error);
        throw error;
      }
    },

    /**
     * 清空購物車
     */
    clearCart() {
      this.items = [];
    }
  }
})