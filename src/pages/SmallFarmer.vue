<script setup>
import FrontLayout from "../layouts/FrontLayout.vue";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoData from '../data/twCounty2010.geo.json';

const router = useRouter();

const popupData = {
  '宜蘭縣': {
    title: '宜蘭專業蔥農的堅持',
    image: new URL('../assets/images/About/yilan.jpeg', import.meta.url).href,
    content: '宜蘭三星蔥，青翠飽滿、蔥白修長，口感細緻、香氣濃郁，是餐桌上畫龍點睛的美味。',
    link: '/tjd101/g1/LunchBox',
    latlng: [24.45, 121.65],
    markerIcon: new URL('../assets/images/About/chives.png', import.meta.url).href
  },
  '花蓮縣': {
    title: '季節食材飽滿香甜花蓮好南瓜',
    image: new URL('../assets/images/About/hualian.jpeg', import.meta.url).href,
    content: '夏季的颱風豪雨及高溫期病蟲害問題，常對生產造成威脅，秋、冬為主要之生產季節。',
    link: '/tjd101/g1/LunchBox',
    latlng: [23.7, 121.45],
    markerIcon: new URL('../assets/images/About/pumpkin.png', import.meta.url).href
  },
  '台東縣': {
    title: '來自台東池上的純淨好米',
    image: new URL('../assets/images/Home/farmer_1.png', import.meta.url).href,
    content: '米粒外觀透明、碩大且飽滿，香Ｑ的米飯絕佳口感，香、濃、稠的口感更是驚為天人。',
    link: '/tjd101/g1/LunchBox',
    latlng: [22.8, 121.07],
    markerIcon: new URL('../assets/images/About/flour.png', import.meta.url).href
  },
  '台南市': {
    title: '台南官田蕃茄讓您一口接一口',
    image: new URL('../assets/images/About/tainan.jpeg', import.meta.url).href,
    content: '黑柿蕃茄為大果番茄，果型碩大、外觀討喜、外皮濃綠帶有一點紅，富有絕佳風味。',
    link: '/tjd101/g1/LunchBox',
    latlng: [23.05, 120.34],
    markerIcon: new URL('../assets/images/About/pomegranate.png', import.meta.url).href
  },
  '雲林縣': {
    title: '品嚐雲林在地高麗菜的清甜',
    image: new URL('../assets/images/About/yunlin.jpeg', import.meta.url).href,
    content: '雲林高麗菜，飽滿清甜、口感爽脆，富含營養，是餐桌上健康又美味的好選擇。',
    link: '/tjd101/g1/LunchBox',
    latlng: [23.6, 120.4],
    markerIcon: new URL('../assets/images/About/cabbage.png', import.meta.url).href
  }
};

onMounted(() => {
  const map = L.map('map', {
    minZoom: 7,
    maxZoom: 12,
    maxBoundsViscosity: 0.5
  }).setView([23.6978, 120.9605], 8);

  L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://stamen.com/">Stamen</a> & OSM'
  }).addTo(map);

  const defaultStyle = {
    color: '#fbedca',
    weight: 1,
    fillOpacity: 0.4
  };

  const hoverStyle = {
    color: '#cf6610',
    weight: 2,
    fillOpacity: 1
  };

  const geoLayer = L.geoJSON(geoData, {
    style: defaultStyle,
    onEachFeature: (feature, layer) => {
      const name = feature.properties.COUNTYNAME;
      const data = popupData[name];

      if (data) {
        const popupHTML = `
          <div style="width: 220px; text-align: center;">
            <h4 style="margin: 0 0 6px; font-size: 16px;">${data.title}</h4>
            <img src="${data.image}" alt="${data.title}" style="width: 160px; height: 160px; border-radius: 4px;" />
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

        layer.bindPopup(popupHTML);

        layer.on('click', () => layer.openPopup());
        layer.on('popupopen', () => {
          const btn = document.querySelector('.go-to-lunchbox');
          if (btn) {
            btn.addEventListener('click', () => {
              router.push(data.link);
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
  }).addTo(map);


  Object.entries(popupData).forEach(([name, data]) => {
    const icon = L.icon({
      iconUrl: data.markerIcon,
      iconSize: [32, 32],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    const marker = L.marker(data.latlng, { icon }).addTo(map);

    const popupHTML = `
      <div style="width: 220px; text-align: center;">
        <h4 style="margin: 0 0 6px; font-size: 16px;">${data.title}</h4>
        <img src="${data.image}" alt="${data.title}" style="width: 160px; height: 160px; border-radius: 4px;" />
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

    marker.bindPopup(popupHTML);

    marker.on('click', () => marker.openPopup());
    marker.on('popupopen', () => {
      const btn = document.querySelector('.go-to-lunchbox');
      if (btn) {
        btn.addEventListener('click', () => {
          router.push(data.link);
        });
      }
    });
  });
});
</script>


<template>
    <FrontLayout>
        <div id="map" style="height: 640px;"></div>
    </FrontLayout>
</template>

<style scoped lang="scss">
#map {
  width: 100%;
}

.custom-marker-icon img {
  transition: transform 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
.custom-marker-icon img:hover {
  transform: scale(1.2);
}
</style>