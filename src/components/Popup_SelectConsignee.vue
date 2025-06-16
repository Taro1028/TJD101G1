<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMemberStore } from '@/stores/MemberStore'

const emit = defineEmits(['close', 'select'])
const memberStore = useMemberStore()

const loading = ref(true)
const consignees = ref([])
const selectedConsigneeId = ref(null)
const showAddForm = ref(false)
const env = import.meta.env.VITE_API_URL || 'http://localhost'

// 新增收貨人表單
const newConsignee = ref({
  contacts_name: '',
  contacts_phone: '',
  address: '',
  telephone: '',
  note: ''
})

onMounted(async () => {
  await loadConsignees()
})

// 載入常用收貨人列表
const loadConsignees = async () => {
  try {
    loading.value = true
    
    if (!memberStore.memberId) {
      throw new Error('無會員ID')
    }
    
    console.log('🔍 載入常用收貨人，會員ID:', memberStore.memberId)
    
    const baseUrl = env.endsWith('/') ? env : env + '/'
    const apiUrl = `${baseUrl}tjd101/g1/php/getConsignees.php?member_id=${memberStore.memberId}`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || '獲取常用收貨人失敗')
    }
    
    consignees.value = result.data || []
    
    console.log('✅ 常用收貨人載入完成:')
    console.log('- 資料筆數:', consignees.value.length)
    console.log('- 資料內容:', consignees.value)
    
    // 預設選中第一個收貨人
    if (consignees.value.length > 0) {
      selectedConsigneeId.value = consignees.value[0].ID
      console.log('- 預設選中收貨人ID:', selectedConsigneeId.value)
    } else {
      console.log('- 沒有收貨人資料，顯示空狀態')
    }
    
  } catch (error) {
    console.error('❌ 載入常用收貨人失敗:', error)
    consignees.value = []
  } finally {
    loading.value = false
  }
}

// 選中的收貨人
const selectedConsignee = computed(() => {
  return consignees.value.find(c => c.ID === selectedConsigneeId.value)
})

// 刪除收貨人
const deleteConsignee = async (consigneeId) => {
  if (!confirm('確定要刪除這個常用收貨人嗎？')) {
    return
  }
  
  try {
    const baseUrl = env.endsWith('/') ? env : env + '/'
    const apiUrl = `${baseUrl}tjd101/g1/php/deleteConsignee.php?id=${consigneeId}&member_id=${memberStore.memberId}`
    
    const response = await fetch(apiUrl, {
      method: 'DELETE'
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || '刪除失敗')
    }
    
    // 重新載入列表
    await loadConsignees()
    
    console.log('✅ 收貨人刪除成功')
    
  } catch (error) {
    console.error('❌ 刪除收貨人失敗:', error)
    alert('刪除失敗：' + error.message)
  }
}

// 新增收貨人
const saveNewConsignee = async () => {
  try {
    if (!newConsignee.value.contacts_name || !newConsignee.value.contacts_phone || !newConsignee.value.address) {
      alert('請填寫姓名、電話和地址')
      return
    }
    
    const baseUrl = env.endsWith('/') ? env : env + '/'
    const apiUrl = `${baseUrl}tjd101/g1/php/saveConsignee.php`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        member_id: memberStore.memberId,
        contacts_name: newConsignee.value.contacts_name,
        contacts_phone: newConsignee.value.contacts_phone,
        address: newConsignee.value.address,
        telephone: newConsignee.value.telephone,
        note: newConsignee.value.note
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || '新增失敗')
    }
    
    // 重新載入列表
    await loadConsignees()
    
    // 重置表單
    newConsignee.value = {
      contacts_name: '',
      contacts_phone: '',
      address: '',
      telephone: '',
      note: ''
    }
    showAddForm.value = false
    
    console.log('✅ 收貨人新增成功')
    
  } catch (error) {
    console.error('❌ 新增收貨人失敗:', error)
    alert('新增失敗：' + error.message)
  }
}

// 取消新增
const cancelAdd = () => {
  newConsignee.value = {
    contacts_name: '',
    contacts_phone: '',
    address: '',
    telephone: '',
    note: ''
  }
  showAddForm.value = false
}

// 確定選擇
const confirmSelection = () => {
  if (selectedConsignee.value) {
    emit('select', {
      name: selectedConsignee.value.C_CONTACTS_NAME,
      phone: selectedConsignee.value.C_CONTACTS_PHONE,
      address: selectedConsignee.value.C_ADD
    })
  }
}

// 關閉彈窗
const closePopup = () => {
  emit('close')
}
</script>

<template>
<div class="overlay">
    <div class="selectblock">
        <div class="consigneeblock">
            <h5>選擇常用收貨人</h5>
            <button class="closebtn" @click="closePopup">
              <i class="bi bi-x-circle"></i>
            </button>
            
            <!-- 載入中狀態 -->
            <div v-if="loading" class="loading">
              載入中...
            </div>
            
            <!-- 收貨人列表 -->
            <div v-else class="consigneelist">
                <!-- 現有收貨人列表 -->
                <div v-if="consignees.length > 0">
                    <div v-for="consignee in consignees" :key="consignee.ID" class="item">
                        <label class="itemblock">
                            <input 
                              class="radio" 
                              type="radio" 
                              :value="consignee.ID"
                              v-model="selectedConsigneeId"
                              name="select"
                            >
                            <div class="iteminfo">
                                <div class="name">{{ consignee.C_CONTACTS_NAME }}</div>
                                <div class="phone">{{ consignee.C_CONTACTS_PHONE }}</div>
                                <div class="addr">{{ consignee.C_ADD }}</div>
                            </div>
                        </label>
                        <button class="del" @click="deleteConsignee(consignee.ID)">
                          <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                    
                    <!-- 新增收貨人按鈕（有資料時） -->
                    <div v-if="!showAddForm" class="item">
                        <button class="addinfo" @click="showAddForm = true">
                            <i class="bi bi-plus-circle"></i>
                            <p>新增常用收貨人</p>
                        </button>
                    </div>
                </div>
                
                <!-- 新增收貨人表單 -->
                <div v-if="showAddForm" class="addform">
                    <h6>新增常用收貨人</h6>
                    <div class="formgroup">
                        <label>姓名 *</label>
                        <input 
                          type="text" 
                          v-model="newConsignee.contacts_name"
                          placeholder="請輸入收貨人姓名"
                        >
                    </div>
                    <div class="formgroup">
                        <label>手機 *</label>
                        <input 
                          type="text" 
                          v-model="newConsignee.contacts_phone"
                          placeholder="請輸入手機號碼"
                        >
                    </div>
                    <div class="formgroup">
                        <label>地址 *</label>
                        <input 
                          type="text" 
                          v-model="newConsignee.address"
                          placeholder="請輸入收貨地址"
                        >
                    </div>
                    <div class="formgroup">
                        <label>市話</label>
                        <input 
                          type="text" 
                          v-model="newConsignee.telephone"
                          placeholder="請輸入市話(選填)"
                        >
                    </div>
                    <div class="formgroup">
                        <label>備註</label>
                        <input 
                          type="text" 
                          v-model="newConsignee.note"
                          placeholder="備註(選填)"
                        >
                    </div>
                    <div class="formbtn">
                        <button class="cancel" @click="cancelAdd">取消</button>
                        <button class="save" @click="saveNewConsignee">儲存</button>
                    </div>
                </div>
                
                <!-- 空狀態（沒有收貨人時） -->
                <div v-if="consignees.length === 0 && !showAddForm" class="empty">
                    <div class="emptyicon">
                        <i class="bi bi-person-plus"></i>
                    </div>
                    <p>尚無常用收貨人</p>
                    <p class="emptytext">新增常用收貨人可以讓下次訂購更便利</p>
                    <button class="addinfo" @click="showAddForm = true">
                        <i class="bi bi-plus-circle"></i>
                        <span>新增常用收貨人</span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 底部按鈕 -->
        <div class="btnblock">
            <button class="btn-1" @click="closePopup">取消</button>
            <button 
              class="btn-2" 
              @click="confirmSelection"
              :disabled="!selectedConsignee && consignees.length > 0"
            >
              確定
            </button>
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
    max-height: 90vh;
    overflow-y: auto;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_300;
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
    cursor: pointer;

    i{
        font-size: 24px;
    }
}

.consigneeblock{
    display: flex;
    flex-direction: column;
    align-self: start;
    gap: 24px;
    width: 100%;

    h5{
        font-size: $font_h5;
    }
}

.loading {
    text-align: center;
    padding: 40px;
    color: $neutral_700;
}

.consigneelist{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.itemblock{
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    flex: 1;
}

.radio{
    width: 20px;
    height: 20px;
    cursor: pointer;
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
    font-size: 14px;
}

.del{
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;

    i{
        font-size: 20px;
        color: $neutral_300;
        
        &:hover{
            color: $point_700;
        }
    }
}

.addinfo{
    padding: 8px 0;
    gap: 12px;
    align-items: center;
    background-color: transparent;
    border: none;
    color: $primary_600;
    cursor: pointer;

    i{
        font-size: 20px;
    }

    &:hover{
        color: $primary_600;
    }
}

// 新增表單樣式
.addform{
    border: 1px solid $neutral_300;
    border-radius: 8px;
    padding: 16px;
    background-color: $neutral_100;
    width: 100%;

    h6{
        font-size: $font_h6;
        margin-bottom: 16px;
        font-weight: bold;
    }
}

.formgroup{
    margin-bottom: 12px;

    label{
        display: block;
        font-size: 14px;
        margin-bottom: 4px;
        color: $neutral_700;
    }

    input{
        width: 100%;
        padding: 8px 12px;
        border: 1px solid $neutral_300;
        border-radius: 4px;
        font-size: 14px;

        &:focus{
            outline: none;
            border-color: $primary_400;
        }
    }
}

.formbtn{
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;

    button{
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 14px;
    }

    .cancel{
        background-color: $neutral_300;
        color: $neutral_700;

        &:hover{
            background-color: $neutral_300;
        }
    }

    .save{
        background-color: $primary_600;
        color: white;

        &:hover{
            background-color: $primary_600;
        }
    }
}

// 空狀態
.empty{
    text-align: center;
    padding: 60px 20px;
    color: $neutral_700;
    
    .emptyicon{
        margin-bottom: 16px;
        
        i{
            font-size: 40px;
            color: $neutral_300;
        }
    }

    p{
        margin-bottom: 8px;
        font-size: 20px;
        font-weight: bold;
    }
    
    .emptytext{
        font-size: 16px;
        color: $neutral_300;
        margin-bottom: 24px;
        font-weight: normal;
    }
    
    .addinfo{
        color: $primary_600;
        padding: 12px 24px;
        border-radius: 24px;
        border: none;
        
        span{
            font-size: 18px;
            margin-left: 8px;
        }
        
        &:hover{
            outline: 1px solid $primary_600;
        }
    }
}

.btnblock{
    display: flex;
    gap: 40px;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;
    cursor: pointer;

    &:hover{
        background-color: transparent;
        color: $neutral_black;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;
    cursor: pointer;

    &:hover:not(:disabled){
        background-color: transparent;
        color: $neutral_black;
    }

    &:disabled{
        opacity: 0.5;
        cursor: not-allowed;
    }
}

// --- RWD ---
@media screen and (max-width: 660px){
    .selectblock{
        width: 90vw;
        max-width: 500px;
        margin: 20px;
    }

    .item{
        width: 100%;
    }
    
    .btnblock{
        gap: 20px;
    }
}
</style>