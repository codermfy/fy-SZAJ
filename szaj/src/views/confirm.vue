<template>
  <div class="confirm-page">
    <div class="container">
      <div class="card">
        <div class="title">温馨提示</div>
        <div>信息登记:确认</div>
        <div class="content">
          {{ content }}
        </div>
      </div>
    </div>
    <div class="foot">
      <van-button class="next-btn" type="primary" @click="next"
        >确认提交</van-button
      >
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
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
defineComponent({
  name: "confirm",
});
const inherit: any = ref("");
const type: any = ref("");
const confirm: any = ref("");
const content = ref("1231321");

onMounted(() => {
  inherit.value = route.query.inherit||'';
  type.value = route.query.type||'';
  confirm.value = route.query.confirm||'';
  handleContent();
});
const handleContent = () => {
  if (type.value == "update") {
    if (
      inherit.value === "原当事人死亡（以继承人名义登记）" ||
      inherit.value === "原当事人死亡（以继承人名义申报）"
    ) {
      content.value = `确认您提交的信息准确无误,特别是您本案的损失金额为 ${caseStore.tempCase.lossCash} 元。有多名权利继承人时,您仅代表所有权利继承人登记和领取案款, 所领款项非您一人所有,您应及时分配给其他权利继承人。`;
    } else {
      content.value = `确认您提交的信息准确无误,特别是您本案的损失金额为 ${caseStore.tempCase.lossCash} 元。`;
    }
  } else {
    if (
      caseStore.tempCase.applyCaseType === "原当事人死亡（以继承人名义登记）" ||
      caseStore.tempCase.applyCaseType === "原当事人死亡（以继承人名义申报）"
    ) {
      content.value = `请再次确认您是本案的当事人或本案当事人的继承人，确认您提交的信息准确无误,特别是您本案的损失金额为 ${caseStore.tempCase.lossCash} 元，虚假登记将依法追究您的法律责任。有多名权利继承人时,您仅代表所有权利继承人登记和领取案款, 所领款项非您一人所有,您应及时分配给其他权利继承人。`;
    } else {
      content.value = `请再次确认您是本案的当事人或本案当事人的继承人，确认您提交的信息准确无误,特别是您本案的损失金额为 ${caseStore.tempCase.lossCash} 元，虚假登记将依法追究您的法律责任。`;
    }
  }
};
const next = async () => {
  let data = Object.assign({}, copyObj(caseStore.tempCase));
  if (type.value === "update") {
    data.caseBh = caseStore.caseItem.caseBh;
    data.type = String(caseStore.caseItem.type);
    data.bh = caseStore.caseItem.bh;
    data.partyIDNumber=caseStore.caseForm.partyIDNumber
    if (/\*/.test(data.partyPhone)) {
      // data.partyPhone=wx.getStorageSync('common_userInfo').phoneEnc
      data.partyPhone = userStore.userInfo.phone;
    }
    showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
    let res=await caseApi.updatePartyData(data);
    if(!res){
      return;
    }
    closeToast();
    router.push(
      {
        path:'/submitted',
        query:{
          confirm:confirm.value
        }
      }
    )

  }else{
    // data.partyIDNumber = wx.getStorageSync('common_userInfo').identityIdEnc
    //   data.partyPhone = wx.getStorageSync('common_userInfo').phoneEnc
    data.partyIDNumber = userStore.userInfo.identityId;
      data.partyPhone = userStore.userInfo.phone;
      data.caseBh = caseStore.caseItem.caseBh
      showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
    let res=await caseApi.addPartyData(data);
    if(!res){
      return;
    }
    closeToast();
    router.push(
      {
        path:'/submitted',
      }
    )
  }
};
</script>

<style scoped lang="scss">
.confirm-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .container {
    padding: 16px 16px 6px;
    height: calc(100% - 80px);
    overflow-y: auto;
    .card {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      padding: 15px;
      color: $text-color-regular;
      font-size: 16px;
      line-height: 24px;
      .title {
        color: $text-color-base;
        font-weight: bold;
        font-size: 19px;
        text-align: center;
        line-height: 38px;
      }
      .content {
        text-indent: 2em;
      }
    }
  }
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 80px;

    width: 100%;
    display: flex;
    padding: 10px 15px 0px 15px;
    box-sizing: border-box;

    .pre-btn {
      flex: 2;
      margin-right: 10px;
    }
    .next-btn {
      flex: 3;
    }
  }
}
</style>