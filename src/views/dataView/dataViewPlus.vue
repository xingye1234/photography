<template>
  <div id="data-view">
    <div class="left">
        
    </div>
    <div id="center" style="height: 100vh"></div>
    <div class="right">
      <!-- <el-table :data="cityData" border style="width: 100%" >
        <el-table-column prop="cityData[0]" label="城市名" width="200" align="center"/>
        <el-table-column prop="name" label="用户人数" width="200" align="center"/>
      </el-table> -->
      <ul v-if="cityData.length">
        <li v-for="(city, index) in cityData" :key="index">{{ city }}</li>
      </ul>
      <div v-else>暂无数据</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, reactive } from "vue";
import { dataMap } from "../../mapData";
import "../../assets/china"

let cityData = reactive<string[]>([]);

onMounted(() => {
  let myEcharts = echarts.init(
    document.querySelector("#center") as HTMLElement
  );

  let points = [
    { value: [118.8062, 31.9208], itemStyle: { color: "#4ab2e5" } },
    { value: [127.9688, 45.368], itemStyle: { color: "#4fb6d2" } },
    { value: [110.3467, 41.4899], itemStyle: { color: "#52b9c7" } },
    { value: [125.8154, 44.2584], itemStyle: { color: "#5abead" } },
    { value: [116.4551, 40.2539], itemStyle: { color: "#f34e2b" } },
    { value: [123.1238, 42.1216], itemStyle: { color: "#f56321" } },
    { value: [114.4995, 38.1006], itemStyle: { color: "#f56f1c" } },
    { value: [117.4219, 39.4189], itemStyle: { color: "#f58414" } },
    { value: [112.3352, 37.9413], itemStyle: { color: "#f58f0e" } },
    { value: [109.1162, 34.2004], itemStyle: { color: "#f5a305" } },
    { value: [103.5901, 36.3043], itemStyle: { color: "#e7ab0b" } },
    { value: [106.3586, 38.1775], itemStyle: { color: "#dfae10" } },
    { value: [101.4038, 36.8207], itemStyle: { color: "#d5b314" } },
    { value: [103.9526, 30.7617], itemStyle: { color: "#c1bb1f" } },
    { value: [108.384366, 30.439702], itemStyle: { color: "#b9be23" } },
    { value: [113.0823, 28.2568], itemStyle: { color: "#a6c62c" } },
    { value: [102.9199, 25.46639], itemStyle: { color: "#96cc34" } },
    { value: [119.4543, 25.9222] , itemStyle: { color: "#96cc34" }},
  ];

  myEcharts.setOption({
    backgroundColor: "#013954",
    geo: {
      map: "china",
      aspectScale: 0.75, //长宽比
      zoom: 1.1,
      roam: false,
      itemStyle: {
        areaColor: {
          type: "radial",
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: "#09132c", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#274d68", // 100% 处的颜色
            },
          ],
          globalCoord: true, // 缺省为 false
        },
        shadowColor: "rgb(58,115,192)",
        shadowOffsetX: 10,
        shadowOffsetY: 11,
      },
      emphasis: {
        areaColor: "#2AB8FF",
        borderWidth: 0,
        color: "green",
        label: {
          show: false,
        },
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        roam: false,
        label: {
          show: true,
          color: "#1DE9B6",
        },
        emphasis: {
          textStyle: {
            color: "rgb(183,185,14)",
          },
        },

        itemStyle: {
          //   normal: {
          borderColor: "rgb(147, 235, 248)",
          borderWidth: 1,
          areaColor: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: "#09132c", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#274d68", // 100% 处的颜色
              },
            ],
            globalCoord: true, // 缺省为 false
          },
          //   },
        },
        emphasis: {
          areaColor: "rgb(46,229,206)",
          borderWidth: 0.1,
        },
        zoom: 1.1,
        map: "china", //使用
      },
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        showEffectOn: "render",
        zlevel: 1,
        rippleEffect: {
          period: 15,
          scale: 3,
          brushType: "fill",
        },
        // hoverAnimation: true,
        label: {
          formatter: "{b}",
          position: "right",
          offset: [15, 0],
          color: "#1DE9B6",
          show: true,
        },
        itemStyle: {
          color: "#1DE9B6",
          shadowBlur: 10,
          shadowColor: "#333",
        },
        symbolSize: 12,
        data: points,
      },
    ],
  });

  //点击事件
  myEcharts.on("click", (params) => {
    console.log(params);
    const { name } = params;
    //清空数组
    cityData.splice(0, cityData.length);
    //将数据添加到数组中
    cityData.push(...dataMap[name]);
  });
});
</script>
<style lang='less' scoped>
#data-view {
  //   filter: grayscale(1);
  height: 100vh;
  display: flex;
  background: #013954;
  .left {
    width: 300px;
  }
  #center {
    flex: 1;
  }
  .right {
    width: 400px;
    overflow: auto;
    // background: blue;
    ul {
      padding: 5px 10px;
      box-sizing: border-box;
      li {
        border-bottom: 1px solid #ccc;
        padding: 5px 10px;
        color: #1de9b6;
        background: #0a162f;
      }
      li:last-child{
        border: none;
      }
    }
  }
}
</style>