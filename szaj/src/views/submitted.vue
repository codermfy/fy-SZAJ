<template>
  <div class="submitted-page">
    <div class="container">
      <div class="card" v-if="type==='refund'">
        <van-icon name="checked" size="60" color="#11a885" />
        <div class="title">账号已验证成功</div>

      <van-button class="pre-btn" type="default" @click="returnBack">返回案件列表页</van-button>
      </div>
      <div class="card" v-else-if="type==='fail'">
        <van-icon name="clear" size="60" color="#ff0000" />
        <div class="title">验证失败，请检查后重新提交信息</div>

      <van-button class="pre-btn" type="default" @click="back">返回登记退款账号页</van-button>
      </div>
      <div class="card" v-else>
        <van-icon name="checked" size="60" color="#11a885" />
        <div class="title">信息已提交</div>
        <div class="text" v-if="!confirm">在{{formatted}}前，可再次修改信息</div>
      <van-button class="pre-btn" type="default" @click="returnBack">返回案件列表页</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  nextTick,
  watch,
  defineComponent,
} from "vue";
import { caseApi } from "@/api/case";
import { commonApi } from "@/api/common";
import { useCaseStore } from "@/stores/caseItem";
import { formatDate, copyObj } from "@/utils/baseTool";
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();

import { usePathStore } from "@/stores/routerPath";
const pathStore=usePathStore();

defineComponent({
  name: "submitted",
});
const TYPE_ONE = '1';
const TYPE_TWO = '2';

const type: any = ref("");
const confirm: any = ref("");
const formatted: any = ref("");
onMounted(() => {
  type.value = route.query.type||'';
  confirm.value = route.query.confirm||'';
  handleFormatTime();
});
const handleFormatTime=()=>{
  if(caseStore.caseItem.type===TYPE_ONE||caseStore.caseItem.type===TYPE_TWO){
 // 给定的日期字符串 
 let dateStr = caseStore.caseItem.endTime;
      // 要添加的天数
      let daysToAdd = caseStore.caseItem.hesitateDay;
      // 解析为Date对象并转换为时间戳,这样不受时区影响
      // let timestamp = new Date(dateStr).getTime(); 
      let timestamp = new Date().getTime()
      // 添加天数后的新时间戳
      let newTimestamp = timestamp + daysToAdd * 24 * 60 * 60 * 1000;
      let date = new Date(newTimestamp);

      // 格式化日期
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');

      // 格式化时间 
      let hour = date.getHours().toString().padStart(2, '0');
      let minute = date.getMinutes().toString().padStart(2, '0');
      let second = date.getSeconds().toString().padStart(2, '0');

      // 拼接格式化后的字符串
       formatted.value = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }else{
    formatted.value=formatDate(Number(caseStore.caseItem.hesitateEndTime))
  }
}
const returnBack=()=>{
  pathStore.setRouterPath('case-list');
  router.go(-1);
}
const back=()=>{
  router.back();
}
</script>

<style scoped lang="scss">
.submitted-page{
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .container{
    padding: 16px;
    height: 100%;
    overflow-y: auto;
    .card{
      width: 100%;
      background: #fff;
      border-radius: 8px;
      padding: 30px 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title{
        font-size: 12px;
        margin:10px
      }
      .text{
        color:$text-color-placeholder;
        font-size: 12px;
        margin-bottom:10px
      }
      .pre-btn{
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>