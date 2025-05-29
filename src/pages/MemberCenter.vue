    <script setup>
    import FrontLayout from '../layouts/FrontLayout.vue';

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
                            <img src="./img/avatar.png" alt="大頭照" />
                            <p class="nickName">阿官</p>
                        </div>
                        <ul class="quick_link">
                            <li class="user_link_btn active"><RouterLink to="/front/MemberCenter">個人資料</RouterLink></li>
                            <li class="user_link_btn"><RouterLink to="/front/#">訂單總覽</RouterLink></li>
                            <li class="user_link_btn"><RouterLink to="/front/#">我的小卡</RouterLink></li>
                            <li class="user_link_btn"><RouterLink to="/front/#">收件者管理</RouterLink></li>
                        </ul>
                        <div class="logout">登出</div>
                    </div>
                    
                    <!-- 右側詳細內容區 -->
                    <div class="user_content">
                        <h3>個人資料</h3>

                        <div class="member-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">姓名</label>
                                    <input type="text" class="form-input" value="王慧明" />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">生理性別</label>
                                    <div class="radio-group">
                                        <label><input type="radio" name="gender" checked /> 女</label>
                                        <label><input type="radio" name="gender" /> 男</label>
                                        <label><input type="radio" name="gender" /> 其他</label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">生日</label>
                                    <input type="text" class="form-input" value="1991/01/01" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">暱稱</label>
                                <input type="text" class="form-input" value="阿豆" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">密碼</label>
                                <div class="password-input-container">
                                    <input type="password" class="form-input" value="*******" />
                                    <span class="password-toggle">
                                        <i class="bi bi-eye-slash-fill"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">新密碼</label>
                                <div class="password-input-container">
                                    <input type="password" class="form-input" placeholder="至少8-16個英數組成" />
                                    <span class="password-toggle">
                                        <i class="bi bi-eye-slash-fill"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">確認新密碼</label>
                                <div class="password-input-container">
                                    <input type="password" class="form-input" placeholder="至少8-16個英數組成" />
                                    <span class="password-toggle">
                                        <i class="bi bi-eye-slash-fill"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">聯絡地址</label>
                                <input type="text" class="form-input" value="臺北市中山區南京東路三段" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">電子信箱</label>
                                <input type="email" class="form-input" value="Abean101@Tibame.com" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">市內電話</label>
                                <input type="tel" class="form-input" value="02-2312-3456" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">行動電話</label>
                                <input type="tel" class="form-input" value="0987 078 587" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">備用聯絡人-姓名</label>
                                <input type="text" class="form-input" value="林婉瑜" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">備用聯絡人-電話</label>
                                <input type="tel" class="form-input" value="0987 078 587" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">備註</label>
                                <textarea class="form-textarea">罹有糖尿病、三高、重聽、牙口尚可、茹素、喜清淡</textarea>
                            </div>

                            <div class="btn-group">
                                <button type="button" class="btn btn-secondary">取消</button>
                                <button type="button" class="btn btn-primary">儲存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        </FrontLayout>
    </template>
    <style lang="scss">

    img {
        display: block;
    }

    </style>