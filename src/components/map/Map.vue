<template>
  <div class="map-container">
    <div ref="wrapRef" class="map-view">
      <div class="address">
        <p>地址：{{ info.address }}</p>
        <el-button type="primary" @click="comfirmAddress">确定地址</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
window._AMapSecurityConfig = {
	securityJsCode:'d0eaa46af4ec97819cec9a56a18c3883',
}
</script>
<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, reactive, ref,shallowRef } from 'vue';
import {ElMessage} from "element-plus"

const emit = defineEmits<{
  (e: 'closeMap', value: string): void
}>()

function comfirmAddress(){
   //发送事件，将地图关闭
   emit('closeMap', info.address)
}

const wrapRef = ref<HTMLDivElement | null>(null);
let map:any = shallowRef(null);
const info = reactive({
  address:'暂无地址',
})


const initMap = ()=>{
  AMapLoader.load({
            key:"da6bd131d4dd8c8eca5b7e0743aa4c5d",             // 申请好的Web端开发者Key，首次调用 load 时必填
            version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins:['AMap.Geocoder', 'AMap.Geolocation', 'AMap.CitySearch'],     // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            AMapUI: {
              version: "1.1",
              plugins: []  // 需要加载的 AMapUI ui插件
            }
        }).then((AMap)=>{
          
            //经纬度
            let lnglatValue:any;
            map = new AMap.Map(document.querySelector('.map-view'),{  //设置地图容器id
                viewMode:"3D",    //是否为3D地图模式
                zoom:14,           //初始化地图级别
                center:[115.8953547,29.61521454116]
            });
            //获取当前城市定位
            let city = new AMap.CitySearch()
              city.getLocalCity((status, result)=>{
                if(status === "complete"){
                  return ElMessage({
                    message:`您当前所在城市${result.province+result.city}`
                  })
                }
            })

             //标记
             let marker = new AMap.Marker();
            //编码
            let geocoder = new AMap.Geocoder({
              extensions: "all"
            })

              function geocode(e:MouseEvent){
              let lnglat = e.lnglat.lng + ","+e.lnglat.lat;
              lnglatValue = lnglat.split(',')
              map.add(marker);
              marker.setPosition(lnglatValue);
              
              geocoder.getAddress(lnglatValue, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // console.log(result);
                    info.address = result.regeocode.formattedAddress;
                    
                }else{
                  console.log('根据经纬度查询地址失败');
                }
              })
            }

            map.on('click', geocode)

            //定位
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：5s
              position:'RB',    //定位按钮的停靠位置
              offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
              zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                    onComplete(result)
                }else{
                    onError(result)
                }
            });

             //解析定位结果
            function onComplete(data) {
              return ElMessage({
                message:'定位成功',
                type:'success',
              })
            }
            //解析定位错误信息
            function onError(data) {
              return ElMessage({
                message:'定位失败',
                type:'error'
              })
            }


        }).catch(e=>{
            console.log(e);
        })
}

onMounted(() => {
  initMap()
})

</script>

<style lang="less" scoped>
.map-container {
  background-color: #fff;
  width: 100%;
  height: 100vh;
  position: relative;
  .map-view {
    width: 80%;
    height: calc(100vh - 100px);
    position: fixed;
    z-index: 9999;
    top:50%;
    left: 50%;
    transform: translate(-50%, -48%);
    border: 3px solid #e9e9e9;
    .address{
      position: relative;
      width: 300px;
      z-index: 9999;
      margin: 15px 0 0 15px;
      color: aqua;
      background: white;
    }
  }
}
</style>