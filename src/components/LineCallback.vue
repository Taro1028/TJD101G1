<template>
  <div class="wrapper">
    <p>正在處理 LINE 登入中...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMemberStore } from '../stores/MemberStore';

const router = useRouter();
const route = useRoute();
const env = import.meta.env.VITE_API_URL;

onMounted(async () => {
  const memberStore = useMemberStore();

  //  ?? '' 是fallback 防呆 避免有奇怪的情況下錯誤
  const code = route.query.code ?? '';
  const state = route.query.state ?? '';

  const storedState = localStorage.getItem('line_auth_state');
  localStorage.removeItem('line_auth_state'); // 使用後移除 state

  // 驗證 state 以防止 CSRF 攻擊
  if (!state || state !== storedState) {
    alert('LINE 登入失敗：狀態驗證錯誤！');
    router.replace('/Login'); // 導回登入頁
    return;
  }

  if (!code) {
    alert('LINE 登入失敗：未收到授權碼');
    router.replace('/Login');
    return;
  }

  // 將 code 發送到後端做 token 換取及會員處理
  try {
    const response = await fetch(env + "/tjd101/g1/php/LineLogin.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        code,
        redirect_uri: import.meta.env.VITE_LINE_REDIRECT_URI,
        }),
    });

    let result = null;

    try {
        result = await response.json();
    } catch (e) {
        const text = await response.text();
        console.error('後端回傳非 JSON:', text);
        alert('伺服器回應格式錯誤，請稍後再試。');
        router.replace('/Login');
        return;
    }

    if (result.success) {
        // 🔧 修正：將後端回傳的 member_info 轉換成 MemberStore 期望的格式
        const memberData = {
            success: true,
            ID: result.member_info.id,
            M_NAME: result.member_info.name,
            EMAIL: result.member_info.email || '',
            PHONE: result.member_info.phone || '',
            GENDER: result.member_info.gender || '',
            BIRTHDAY: result.member_info.birthday || '',
            LINE_ID: result.member_info.LINE_ID || '',
            // 其他欄位設定預設值
            NICKNAME: '',
            ADDRESS: '',
            PASSWORD: '',
            TELEPHONE: '',
            EMERGENCY_CONTACTS_NAME: '',
            EMERGENCY_CONTACTS_PHONE: '',
            AVATAR: '',
            NOTE: ''
        };

        // 設定會員資料
        memberStore.setMember(memberData);
        
        console.log('LINE 登入成功，會員資料已設定:', memberStore.memberName);
        console.log('登入狀態:', memberStore.isAuthenticated);
        
        alert('LINE 登入成功！');
        router.replace('/Home');
    } else {
        switch (result.errorCode) {
        case 'EMAIL_EXISTS':
            alert(result.message);
            break;
        default:
            alert('LINE 登入失敗：' + (result.message || '未知錯誤'));
        }
        router.replace('/Login');
    }
    } catch (error) {
    console.error('LINE 登入處理錯誤', error);
    alert('伺服器錯誤，請稍後再試');
    router.replace('/Login');
    }
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 192px);
}
</style>