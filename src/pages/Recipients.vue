<script setup>
    import { ref, computed, reactive, onMounted} from 'vue';
    import FrontLayout from '../layouts/FrontLayout.vue';
    import Gotop from "../components/Gotop.vue"
    import { useMemberStore } from '@/stores/MemberStore'
    import { useRouter } from 'vue-router'
    import { useRecipientsStore } from '@/stores/RecipientsStore'
    import RecipientsSuccessPopup from '@/components/Popup_RecipientsSuccess.vue'
    import { useModalStore } from '@/stores/ModalStore'  
    const showDefaultAvatar = computed(() => !memberStore.hasCustomAvatar);
    const userAvatar = computed(() => memberStore.userAvatar);
    const avatarInput = ref(null);
    const activeTab = ref('recipient1');  
    const memberStore = useMemberStore()
    const recipientsStore = useRecipientsStore()  
    const router = useRouter()
    const modalStore = useModalStore() 

    // 按鈕切換處理函數
    const switchTab = (tabName) => {
        activeTab.value = tabName
        // console.log('切換到分頁:', tabName)
    }

    // 電話欄位驗證狀態
const phoneValidation = reactive({
  recipient_telephone: true,     // 收件人市內電話驗證狀態
  recipient_mobile: true,        // 收件人行動電話驗證狀態
  safety_contact_phone: true     // 送餐安全聯絡人電話驗證狀態
});

    // 數字驗證函數
    const validatePhoneNumber = (value, field) => {
    // 允許空值、數字、短橫線、空格、括號
    const phoneRegex = /^[0-9\s\-\(\)]*$/;
    const isValid = phoneRegex.test(value);
    phoneValidation[field] = isValid;
    return isValid;
    };

    // 電話輸入處理函數
    const handlePhoneInput = (event, field) => {
    const value = event.target.value;
    validatePhoneNumber(value, field);
    };

    // 點擊大頭照區域觸發檔案選擇
    const handleAvatarClick = () => {
    // console.log('Avatar clicked!');
    // console.log('avatarInput.value:', avatarInput.value);
    
    if (avatarInput.value) {
        // console.log('Triggering file input click');
        avatarInput.value.click();
    } else {
        console.error('avatarInput ref is null');
    }
    };

    // 處理檔案上傳
    const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    //   console.log('File selected:', file); 
    
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案');
        // console.log('Invalid file type:', file.type);
        return;
    }
    
    // 檢查檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB');
        console.log('File too large:', file.size);
        return;
    }
    
    // console.log('File validation passed, reading file...');
    
    // 使用 FileReader 讀取檔案
    const reader = new FileReader();
    
    reader.onload = (e) => {
    memberStore.updateAvatar(e.target.result);
    };
    
    reader.onerror = () => {
        console.error('File read error');
        alert('檔案讀取失敗，請重新選擇');
    };
    
    reader.readAsDataURL(file);
    };

    // 重置大頭照
    // 重置大頭照
    const resetAvatar = () => {
        memberStore.resetAvatar();
        if (avatarInput.value) {
            avatarInput.value.value = '';
        }
    };
    // 登出處理函數
    const handleLogout = () => {
    // 確認是否要登出
    if (confirm('確定要登出嗎？')) {
        // 清除會員資料
        memberStore.logout()
        
        // 跳轉到首頁
        router.push('/Home')
        
        // 顯示登出成功訊息
        alert('登出成功！')
    }
    }
    // 載入狀態和錯誤處理
    const showLoadingMessage = computed(() => recipientsStore.loading)
    const showErrorMessage = computed(() => recipientsStore.error)

    // 檢查當前分頁是否有資料
    const currentRecipientHasData = computed(() => {
        return recipientsStore.hasRecipientData(activeTab.value)
    })

    // 當前分頁的收件人資料
    const currentRecipient = computed(() => {
        return recipientsStore.getRecipient(activeTab.value)
    })

    // 載入收件人資料的函數
    const loadRecipientsData = async () => {
        try {
            // 檢查會員是否已登入
            if (!memberStore.isAuthenticated || !memberStore.memberId) {
                console.log('使用者未登入，無法載入收件人資料')
                return
            }

            // 使用 API 載入收件人資料
            await recipientsStore.loadRecipientsFromAPI(memberStore.memberId)
            
        } catch (error) {
            console.error('載入收件人資料失敗:', error)
            // 錯誤處理已在 store 中完成，這裡不需要額外處理
        }
    }

    // 頁面載入時執行
    onMounted(() => {
        loadRecipientsData()
    })

    const saveCurrentRecipient = async () => {
        try {
            // 檢查會員是否已登入
            if (!memberStore.isAuthenticated || !memberStore.memberId) {
                alert('請先登入才能儲存資料')
                return
            }

            // 獲取當前分頁的收件人資料
            const currentRecipientData = recipientsStore.getRecipient(activeTab.value)
            
            // 檢查必填欄位
            if (!currentRecipientData.name || !currentRecipientData.address || !currentRecipientData.phone || 
                !currentRecipientData.contactsName || !currentRecipientData.contactsPhone) {
                alert('請填寫完整的收件人資料（收件人姓名、地址、手機、緊急聯絡人姓名、緊急聯絡人電話為必填）')
                return
            }

            // 檢查電話格式
            if (!phoneValidation.recipient_telephone || !phoneValidation.recipient_mobile || !phoneValidation.safety_contact_phone) {
                alert('請確認電話格式正確')
                return
            }

            // console.log('準備儲存收件人資料:', activeTab.value, currentRecipientData)

            // 調用 API 儲存資料
            const result = await recipientsStore.saveRecipientToAPI(
                memberStore.memberId, 
                activeTab.value, 
                currentRecipientData
            )

            // 顯示成功訊息
            modalStore.openSuccessPopup('收件人資料儲存成功！')
            
            // 重新載入資料以確保同步
            await loadRecipientsData()

        } catch (error) {
            console.error('儲存失敗:', error)
            alert(error.message || '儲存失敗，請重試')
        }
    }

// 取消編輯（重新載入資料）
const cancelEdit = async () => {
    if (confirm('確定要取消編輯嗎？未儲存的變更將會遺失。')) {
        await loadRecipientsData()
    }
}
</script>

    <template>
        <FrontLayout>
        <section class="memberCenter">
            <div class="wrapper">
                <h2>會員中心</h2>
                <!-- 會員管理區 -->
                <div class="memberArea">
                    <!-- 左側導覽列 -->

                    <div class="user_nav">
                        <div class="head-area">
                            
                        <!-- 上傳後的圖片顯示區（初始隱藏） -->
                        <img id="uploadedAvatar" class="uploaded-avatar" alt="大頭照" style="display: none;" />
                            
                        <!-- 上傳按鈕覆蓋層 -->
                        <div class="upload-overlay" id="uploadOverlay">
                            <i class="bi bi-camera-fill"></i>
                            <!-- <span>更換照片</span> -->
                        </div>
                            
                        <!-- 隱藏的檔案輸入 -->
                        <div class="avatar-container" @click="handleAvatarClick">
                                <!-- 預設圖標顯示區 -->
                                <div 
                                    class="default-avatar" 
                                    v-show="showDefaultAvatar"
                                >
                                    <i class="bi bi-person-fill-gear"></i>
                                </div>
                                
                                <!-- 上傳後的圖片顯示區（初始隱藏） -->
                                <img 
                                    class="uploaded-avatar" 
                                    alt="大頭照" 
                                    v-show="!showDefaultAvatar"
                                    :src="userAvatar"
                                />
                                
                                <!-- 上傳按鈕覆蓋層 -->
                                <div class="upload-overlay">
                                    <i class="bi bi-camera-fill"></i>
                                    <!-- <span>{{ showDefaultAvatar ? '上傳照片' : '更換照片' }}</span> -->
                                </div>
                    
                                <!-- 隱藏的檔案輸入 -->
                                <input 
                                    ref="avatarInput"
                                    type="file" 
                                    accept="image/*" 
                                    style="display: none;" 
                                    @change="handleFileChange"
                                />
                            </div>
                            <p class="nickName">{{ memberStore.nickname }}</p>
                            
                            <!-- 一開始隱藏的登出鈕 -->
                            <button class="logout btn2" @click="handleLogout">登出</button>

                        </div>
                        <ul class="quck_link">
                            <li><RouterLink to="/MemberCenter">個人資料</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/MyOrders">訂單總覽</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/MyCards">我的小卡</RouterLink></li>
                            <li class="active"><RouterLink to="/MemberCenter/Recipients">收件者管理</RouterLink></li>
                            <li class="logout">
                                <button class="btn2" @click="handleLogout">登出</button>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- 右側詳細內容區 -->
                    <div class="user_content">
                        <h3>收件者管理</h3>
                        <div class="member-form">

                            <!-- 切換收件人管理分頁 -->
                            <ul class="recipients-btn-group">
                                <li class="nav-item">
                                    <button 
                                        class="recipients-btn" 
                                        :class="{ 'recipients-btn-active': activeTab === 'recipient1' }"
                                        type="button"
                                        @click="switchTab('recipient1')"
                                    >
                                        常用收件人1
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button 
                                        class="recipients-btn" 
                                        :class="{ 'recipients-btn-active': activeTab === 'recipient2' }"
                                        type="button"
                                        @click="switchTab('recipient2')"
                                    >
                                        常用收件人2
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button 
                                        class="recipients-btn" 
                                        :class="{ 'recipients-btn-active': activeTab === 'recipient3' }"
                                        type="button"
                                        @click="switchTab('recipient3')"
                                    >
                                        常用收件人3
                                    </button>
                                </li>
                            </ul>

                            <div class="tab-content">
                            <!-- 收件人1的表單 -->
                                <div v-show="activeTab === 'recipient1'" class="recipient-page">
                                    <div class="form-group">
                                        <label class="form-label">收件人姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient1.name"
                                            placeholder="請輸入收件人姓名"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">收件人地址</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient1.address"
                                            placeholder="請輸入收件人地址"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_telephone }">
                                        <label class="form-label">收件人市內電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_telephone }"
                                                v-model="recipientsStore.recipients.recipient1.telephone"
                                                @input="handlePhoneInput($event, 'recipient_telephone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_telephone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_telephone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_mobile }">
                                        <label class="form-label">收件人行動電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_mobile }"
                                                v-model="recipientsStore.recipients.recipient1.phone"
                                                @input="handlePhoneInput($event, 'recipient_mobile')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_mobile">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_mobile">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">送餐安全聯絡人－姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient1.contactsName"
                                            placeholder="請輸入聯絡人姓名"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.safety_contact_phone }">
                                        <label class="form-label">送餐安全聯絡人－電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.safety_contact_phone }"
                                                v-model="recipientsStore.recipients.recipient1.contactsPhone"
                                                @input="handlePhoneInput($event, 'safety_contact_phone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.safety_contact_phone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.safety_contact_phone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">備註</label>
                                        <textarea 
                                            class="form-textarea"
                                            v-model="recipientsStore.recipients.recipient1.note"
                                            placeholder="請輸入備註"
                                        ></textarea>
                                    </div>
                                </div>

                                <!-- 收件人2的表單 -->
                                <div v-show="activeTab === 'recipient2'" class="recipient-page">
                                    <div class="form-group">
                                        <label class="form-label">收件人姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient2.name"
                                            placeholder="請輸入收件人姓名"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">收件人地址</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient2.address"
                                            placeholder="請輸入收件人地址"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_telephone }">
                                        <label class="form-label">收件人市內電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_telephone }"
                                                v-model="recipientsStore.recipients.recipient2.telephone"
                                                @input="handlePhoneInput($event, 'recipient_telephone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_telephone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_telephone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_mobile }">
                                        <label class="form-label">收件人行動電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_mobile }"
                                                v-model="recipientsStore.recipients.recipient2.phone"
                                                @input="handlePhoneInput($event, 'recipient_mobile')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_mobile">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_mobile">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">送餐安全聯絡人－姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient2.contactsName"
                                            placeholder="請輸入聯絡人姓名"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.safety_contact_phone }">
                                        <label class="form-label">送餐安全聯絡人－電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.safety_contact_phone }"
                                                v-model="recipientsStore.recipients.recipient2.contactsPhone"
                                                @input="handlePhoneInput($event, 'safety_contact_phone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.safety_contact_phone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.safety_contact_phone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">備註</label>
                                        <textarea 
                                            class="form-textarea"
                                            v-model="recipientsStore.recipients.recipient2.note"
                                            placeholder="請輸入備註"
                                        ></textarea>
                                    </div>
                                </div>

                                <!-- 收件人3的表單 -->
                                <div v-show="activeTab === 'recipient3'" class="recipient-page">
                                    <div class="form-group">
                                        <label class="form-label">收件人姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient3.name"
                                            placeholder="請輸入收件人姓名"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">收件人地址</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient3.address"
                                            placeholder="請輸入收件人地址"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_telephone }">
                                        <label class="form-label">收件人市內電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_telephone }"
                                                v-model="recipientsStore.recipients.recipient3.telephone"
                                                @input="handlePhoneInput($event, 'recipient_telephone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_telephone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_telephone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.recipient_mobile }">
                                        <label class="form-label">收件人行動電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.recipient_mobile }"
                                                v-model="recipientsStore.recipients.recipient3.phone"
                                                @input="handlePhoneInput($event, 'recipient_mobile')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.recipient_mobile">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.recipient_mobile">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">送餐安全聯絡人－姓名</label>
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            v-model="recipientsStore.recipients.recipient3.contactsName"
                                            placeholder="請輸入聯絡人姓名"
                                        />
                                    </div>

                                    <div class="form-group" :class="{ 'phone-error': !phoneValidation.safety_contact_phone }">
                                        <label class="form-label">送餐安全聯絡人－電話</label>
                                        <div class="phone-input-container">
                                            <input 
                                                type="tel" 
                                                class="form-input" 
                                                :class="{ 'error': !phoneValidation.safety_contact_phone }"
                                                v-model="recipientsStore.recipients.recipient3.contactsPhone"
                                                @input="handlePhoneInput($event, 'safety_contact_phone')"
                                                placeholder="請輸入數字"
                                            />
                                            <span class="error-icon" v-show="!phoneValidation.safety_contact_phone">
                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                            </span>
                                        </div>
                                        <span class="error-message" v-show="!phoneValidation.safety_contact_phone">
                                            請只輸入數字、空格、短橫線或括號
                                        </span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">備註</label>
                                        <textarea 
                                            class="form-textarea"
                                            v-model="recipientsStore.recipients.recipient3.note"
                                            placeholder="請輸入備註"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- 儲存/取消按鈕 -->
                            <div class="btn-group">
                                <button 
                                    type="button" 
                                    class="btn2 cancel"
                                    @click="cancelEdit"
                                    :disabled="recipientsStore.loading"
                                >
                                    取消
                                </button>
                                <button 
                                    type="button" 
                                    class="btn2 save"
                                    @click="saveCurrentRecipient"
                                    :disabled="recipientsStore.loading"
                                >
                                    {{ recipientsStore.loading ? '儲存中...' : '儲存' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Gotop></Gotop>
        <RecipientsSuccessPopup />
        </FrontLayout>
    </template>
    <style scoped lang="scss">

        @font-face {
        font-family: 'JF Open Huninn';
        src: url('@/assets/font/jf-openhuninn-2.1.ttf') format('truetype');
          font-weight: normal;
            font-style: normal;
        }
        .memberCenter {
        font-family: 'JF Open Huninn', sans-serif;
        }
        img {
            display: block;
        }

        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: $spacing_6;
            box-sizing: border-box;
            width: 100%;
        }

        .wrapper h2 {
            text-align: center;
            margin-bottom: $spacing_8;
            font-size: $font_h2;
            font-weight: bold;
        }

        .memberArea {
            display: flex;
            gap: 1rem;
            align-items: stretch;
        }

        // 大頭照區
        .avatar-container {
            position: relative;
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
            cursor: pointer;
        }

        .default-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: $neutral_700;
            position: absolute;

        }

        .uploaded-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 1px solid black;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0
        }

        .upload-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .avatar-container:hover .upload-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        .upload-overlay i {
            font-size: 50px;
            margin-bottom: 4px;
        }

        /* 左側導覽列 */
        .user_nav {
            width: 240px;
            padding: 30px 20px 12px 20px;
            // margin-right: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background-color: $primary_100;
        }

        // 大頭照及匿名區
        .head-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
        }

        .head-area img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 15px;
            border: 1px solid black;
        }

        .nickName {
            font-size: 1.8rem;
            font-weight: bold;
            margin: 0;
        }

        /* 快速連結選單 */
        .quck_link{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: $spacing_4;
            height: 100%;
            padding-left: 0;
        }

        .quck_link li {
            text-align: center;
        }

        .quck_link a {
            display: block;
            color: $neutral_black;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            padding: $spacing_3 $spacing_10;
            font-weight: bold;
        }

        .quck_link .active a {
            background-color: $primary_400;
            color: white;
        }

        .quck_link a:hover {
            background-color: $primary_600;
            color: white;
        }

        .logout .btn2:hover {
            background-color: $primary_950;
        }

        .quck_link li.logout {
            margin-top: auto;
        }

        .logout .btn2{
            background-color: $primary_600;
            color: white;
        }

        .logout.btn2{
            background-color: $primary_600;
            color: white;
        }

        /* 右側內容區域 */
        .user_content {
            flex: 1;
            padding: 30px 30px 12px 30px;
            border-radius: 8px;
            background-color: $primary_100;
        }

        .user_content h3 {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 25px 0;
        }

        /* 表單版面配置 */
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: $spacing_5;
            box-sizing: border-box;
            padding-top: $spacing_6;
            padding-left: $spacing_8;
            border-radius: 8px;
            background-color: #F6F4EF;
        }

        .form-row .form-group {
            flex: 1;
        }

        /* 表單群組 */
        .form-group {
            margin-bottom: 20px;
        }

        /* 表單標籤 */
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }

        /* 表單輸入框 */
        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid $primary_400;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;

            &:focus {
                outline: none; 
                border: 1px solid $primary_600; 
            }
        }
        /* 電話輸入框容器 */
        .phone-input-container {
        position: relative;
        display: flex;
        align-items: center;
        }

        /* 錯誤狀態的輸入框 */
        .form-input.error {
        border: 2px solid #dc3545;
        background-color: #ffeaa7;
        
        &:focus {
            outline: none;
            border: 2px solid #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        }

        /* 錯誤圖示 */
        .error-icon {
        position: absolute;
        right: 15px;
        color: #dc3545;
        font-size: 16px;
        pointer-events: none;
        z-index: 1;
        }

        /* 錯誤訊息文字 */
        .error-message {
        display: block;
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        font-weight: 500;
        }

        /* 錯誤狀態的表單群組 */
        .form-group.phone-error .form-label {
        color: #dc3545;
        }


        /* 表單文字顯示 */
        .form-text {
            display: block;
            width: 100%;
            padding-top: 12px;
            font-size: 14px;
            box-sizing: border-box;
            min-height: $spacing_6;
        }

        /* 文字區域 */
        .form-textarea {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid $primary_400;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
            min-height: 80px;
            resize: vertical;
            font-family: inherit;

            &:focus {
            outline: none; 
            border: 1px solid $primary_600; 
            }
        }

        /* 不可改基本資料組 */
        .radio-group {
            display: flex;
            gap: $spacing_4;
            margin-top: $spacing_5;
        }

        .radio-group label {
            display: flex;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
        }

        .radio-group input[type="radio"] {
            margin-right: 5px;
        }

        /* 密碼輸入框容器 */
        .password-input-container {
            position: relative;
        }

        /* 密碼顯示切換按鈕 */
        .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }

        /* 底部按鈕群組 */
        .btn-group {
            display: flex;
            gap: $spacing_4;
            margin-top: 30px;
        }

        /* 按鈕基本樣式 */
        .btn2 {
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn2.cancel {
            color: $neutral_300;
        }

        .btn2.save {
            color: $neutral_white;
            background-color: $primary_400;
        }

        //管理收件人列表

        .recipients-btn-group{
            display: flex;
            justify-content: flex-start;
            gap: $spacing_4;
            height: 100%;
            padding-left: 0;
            margin-top: $spacing_8;
            margin-bottom: $spacing_6;
        }

        // 管理收件人按鈕樣式
        .recipients-btn {
        display: inline-block;
        color: $neutral_black;
        padding: 10px 20px;
        border: 1px solid $neutral_black;
        border-radius: 8px;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none; 
        
        &:hover {
            background-color: $primary_400;
            color: $neutral_white;
            border-color: $primary_400;  
        }
        }

        .recipients-btn-active{
            background-color: $primary_400;
            color: $neutral_white;
            border-color: $primary_400;
        }

        // 響應式設定

        @media (min-width: 800px) {
            .logout.btn2 {
                display: none;
            }
        }

        @media (max-width: 800px) {
            .wrapper {
                display: flex;
                flex-direction: column;
                gap: $spacing_4;
            }
            
            .memberArea {
                flex-direction: column;
                gap: $spacing_4;
            }
            
            .user_nav {
                width: 90%;
                margin-right: 0;
                margin-bottom: $spacing_4;
            }
            
            /* head-area 橫向排列 */
            .head-area {
                flex-direction: row;
                align-items: center;
                gap: $spacing_10;
                margin-bottom: $spacing_4;
            }
            
            .avatar-container {
                margin-bottom: 0;
                flex-shrink: 0;
            }
            
            .nickName {
                font-size: 1.6rem;
                margin-left: auto;
            }
            
            .quck_link {
                flex-direction: row;
                flex-wrap: wrap;
                gap: $spacing_2;
                justify-content: center;
            }
            
            .quck_link a {
                padding: $spacing_2 $spacing_4;
                font-size: 0.9rem;
            }
            
            .user_content {
                margin-left: 0;
                padding: $spacing_4;
            }
            
            .logout .btn2 {
                display: none;
            }

        }


        /* 480px 以下 - 導覽橫排不換行 */
        @media (max-width: 480px) {
            .quck_link {
                flex-wrap: nowrap;
                overflow-x: auto;
                overflow-y: hidden;
                justify-content: flex-start;
                padding: $spacing_2 0;
                gap: $spacing_2;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: $primary_400 $primary_100;
            }
            
            .quck_link::-webkit-scrollbar {
                height: 6px;
            }
            
            .quck_link::-webkit-scrollbar-track {
                background: $primary_100;
                border-radius: 3px;
            }
            
            .quck_link::-webkit-scrollbar-thumb {
                background: $primary_400;
                border-radius: 3px;
            }
            
            .quck_link::-webkit-scrollbar-thumb:hover {
                background: $primary_600;
            }
            
            .quck_link li {
                flex-shrink: 0;
            }
            
            .quck_link a {
                white-space: nowrap;
                min-width: max-content;
            }

        }

        /* 400px 以下 - 手機螢幕 */
        @media (max-width: 400px) {
            .wrapper {
                padding: $spacing_4;
            }
            
            .wrapper h2 {
                font-size: 1.8rem;
                margin-bottom: $spacing_4;
            }
            
            .user_nav {
                padding: $spacing_4;
            }
            
            .head-area {
                gap: $spacing_8;
            }
            
            .avatar-container {
                width: 60px;
                height: 60px;
            }
            
            .default-avatar,
            .uploaded-avatar {
                width: 60px;
                height: 60px;
                font-size: 30px;
            }
            
            .nickName {
                font-size: 1.4rem;
            }
            
            .quck_link {
                gap: $spacing_1;
            }
            
            .quck_link a {
                padding: 10px $spacing_2;
                font-size: 0.8rem;
            }
            
            .user_content {
                padding: $spacing_3;
            }
            
            .user_content h3 {
                font-size: 1.8rem;
                margin-bottom: $spacing_3;
            }
            .recipients-btn{
                font-size: 0.8rem;
            }

        }

</style>