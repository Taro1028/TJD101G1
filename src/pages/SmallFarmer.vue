<script setup>
import FrontLayout from "../layouts/FrontLayout.vue";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoData from '@/assets/twCounty2010.geo.json';


const router = useRouter();

const popupData = {
    '宜蘭縣': {
        title: '宜蘭專業蔥農的堅持',
        image: new URL('../assets/images/About/yilan.jpeg', import.meta.url).href,
        content: '宜蘭三星蔥，青翠飽滿、蔥白修長，口感細緻、香氣濃郁，是餐桌上畫龍點睛的美味。',
        link: '/tjd101/g1/LunchBox'
    },
    '花蓮縣': {
        title: '季節食材飽滿香甜花蓮好南瓜',
        image: new URL('../assets/images/About/hualian.jpeg', import.meta.url).href,
        content: '夏季的颱風豪雨及高溫期病蟲害問題，常對生產造成威脅，秋、冬為主要之生產季節。',
        link: '/tjd101/g1/LunchBox'
    },
    '台東縣': {
        title: '來自台東池上的純淨好米',
        image: new URL('../assets/images/Home/farmer_1.png', import.meta.url).href,
        content: '米粒外觀透明、碩大且飽滿，香Ｑ的米飯絕佳口感，香、濃、稠的口感更是驚為天人。',
        link: '/tjd101/g1/LunchBox'
    },
    '台南市': {
        title: '台南官田蕃茄讓您一口接一口',
        image: new URL('../assets/images/About/tainan.jpeg', import.meta.url).href,
        content: '黑柿蕃茄為大果番茄，果型碩大、外觀討喜、外皮濃綠帶有一點紅，富有絕佳風味。',
        link: '/tjd101/g1/LunchBox'
    },
    '雲林縣': {
        title: '品嚐雲林在地高麗菜的清甜',
        image: new URL('../assets/images/About/yunlin.jpeg', import.meta.url).href,
        content: '雲林高麗菜，飽滿清甜、口感爽脆，富含營養，是餐桌上健康又美味的好選擇。',
        link: '/tjd101/g1/LunchBox'
    }
};

onMounted(() => {
  const taiwanBounds = L.latLngBounds(
    [21.5, 119.0],
    [25.5, 123.5]
  );

  const map = L.map('map', {
    maxBoundsViscosity: 0.5,
    minZoom: 7,
    maxZoom: 12
  }).setView([23.6978, 120.9605], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const defaultStyle = {
    color: '#fbedca',
    weight: 1,
    fillOpacity: 0.4
  };

  const hoverStyle = {
    color: '#cf6610',
    weight: 2,
    fillOpacity: 0.7
  };

  function onEachFeature(feature, layer) {
    const name = feature.properties.COUNTYNAME;
    const data = popupData[name];

    if (data) {
      const popupHTML = `
        <div style="width: 220px; text-align: center;">
          <h4 style="margin: 0 0 6px; font-size: 16px; color: #cf6610;">${data.title}</h4>
          <img src="${data.image}" alt="${data.title}" style="width: 140px; height: 140px; border-radius: 4px;" />
          <p style="font-size: 14px; margin: 10px 0;">${data.content}</p>
          <a class="go-to-lunchbox" href="${data.link}" style="
            padding: 6px 12px;
            background: #cf6610;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
          ">餐點介紹</a>
        </div>
      `;
      const popup = L.popup({
        autoPan: false
    }).setContent(popupHTML);
      layer.bindPopup(popupHTML);

      layer.on('click', (e) => {
        layer.openPopup();
      });

      layer.on('popupopen', () => {
        const btn = document.querySelector('.go-to-lunchbox');
        if (btn) {
          btn.addEventListener('click', () => {
            router.push('/lunchbox');
          });
        }
      });


      layer.on({
        mouseover: (e) => {
          e.target.setStyle(hoverStyle);
          e.target.bringToFront();
        },
        mouseout: (e) => {
          geoLayer.resetStyle(e.target);
        }
      });
    }
  }

  const geoLayer = L.geoJSON(geoData, {
    style: defaultStyle,
    onEachFeature
  }).addTo(map);
});
</script>

<template>
    <FrontLayout>
        <div id="map" style="height: 600px;"></div>
    </FrontLayout>
</template>

<style scoped lang="scss">
#map {
  width: 100%;
}
</style>