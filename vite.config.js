import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 載入 path

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',   //專案似乎顯式地設定了太舊的瀏覽器(ChatGPT建議加這段)
  },
  base: "/tjd101/g1/", // 設定相對路徑
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/sass/basic/color.scss" as *;
          @use "@/assets/sass/basic/font.scss" as *;
          @use "@/assets/sass/basic/radius.scss" as *;
          @use "@/assets/sass/basic/spacing.scss" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ 符號：直接指向到 src 資料夾
    },
  },
  server: {
    host: '0.0.0.0'
  }
  // server: {
  //   //本機測試專用
  //   proxy: {
  //     "/tjd101/g1/php": {
  //       target: "http://localhost",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
