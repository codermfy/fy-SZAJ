<template>
  <div class="ajdj-page">
    <div class="tip">请通过下面查询方式选择案件进行登记</div>
    <div class="card" @click="toSearch">
      <img src="@/assets/images/courtin-blue.png" alt="">
      <div>
        <div class="title">模糊查询</div>
        <div class="tips">可通过案号、案件简称查询</div>
      </div>
    </div>
    <div class="card" @click="openCourt">
      <img src="@/assets/images/fuzzy-blue.png" alt="">
      <div>
        <div class="title">法院查询</div>
        <div class="tips">可通过法院、案件简称查询</div>
      </div>
    </div>
    <van-popup v-model:show="showPicker"  :safe-area-inset-bottom="true" :close-on-click-overlay="false" round position="bottom">
  <van-picker
  title="法院查询"
    :columns="columns"
    @cancel="showPicker = false"
    @confirm="onConfirm"
  />
</van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { commonApi } from "@/api/common";
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
} from "vue";
import {courtList} from '@/utils/courtData'
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const showPicker=ref(false);
const columns = courtList
const toSearch = () => {
  router.push({
    path:'/search',
    query:{
      name:'模糊查询'
    }
  })
};
const openCourt= ()=>{
  showPicker.value=true;
}
const onConfirm=async(val)=>{
  let fyid=val.selectedValues[1];
  let res=await commonApi.findCourtCase({IDNumber:userStore.userInfo.identityId,code:fyid});
  if(!res){
    return;
  }
  // console.log(res)
  if(res.length){
    router.push({
    path:'/search',
    query:{
      name:'法院查询',
      fycx:fyid
    }
  })
  showPicker.value=false;
  }else{
    showToast("无案件");
  }
}


</script>

<style scoped lang="scss">
.ajdj-page{
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .tip{
    font-size: 12px;
  color: $text-color-placeholder;
  margin: 15px;
  }
  .card{
    margin: 15px;
  background: #fff;
  display: flex;
  padding: 15px;
  height: 100px;
  align-items: center;
  border-radius: 5px;
  img{
    width: 35px;
  height: 35px;
  margin-right: 10px;
  }
  .title{
  color: $text-color-base;
  font-size: 16px;
}
.tips{
  margin-top:10px ;
  color: $text-color-placeholder;
  font-size: 12px;
}
  }
}
</style>