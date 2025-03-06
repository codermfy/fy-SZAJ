<template>
  <div class="ajsb-page">

    <div class="container">
      <van-cell-group inset>
        <div class="title">信息登记</div>
        <div class="tip">登记案件类型</div>
        <van-radio-group  v-model="caseForm.applyCaseType">
          <van-cell
            title="当事人本人登记"
            clickable
            @click="radioChange('当事人本人登记')"
          >
            <template #icon>
              <van-radio name="当事人本人登记" />
            </template>
          </van-cell>
          <van-cell
            title="当事人姓名或证件号码已变更"
            clickable
            @click="radioChange('当事人姓名或证件号码已变更')"
          >
            <template #icon>
              <van-radio name="当事人姓名或证件号码已变更" />
            </template>
          </van-cell>
          <van-cell
            title="原当事人死亡（以继承人名义登记）"
            clickable
            @click="radioChange('原当事人死亡（以继承人名义登记）')"
          >
            <template #icon>
              <van-radio name="原当事人死亡（以继承人名义登记）" />
            </template>
          </van-cell>
        </van-radio-group>
<template v-if="caseForm.applyCaseType==='当事人姓名或证件号码已变更'">
        <van-field
    v-model="caseForm.originalName"
    :required="true"
    label="当事人原姓名"
    placeholder="请输入"
    label-align="left"
  />
        <van-field
    v-model="caseForm.originalIDNumber"

    label="当事人原证件号码"
    placeholder="请输入"
    label-align="top"
  />
  <div class="m-cell">
    <div class="m-title required">户口本身份信息变更登记页或派出所身份信息系变更证明</div>
    <div class="file-content">
      <upload-com :key="1" :isEdit="edit" :uploadFileList="caseForm.identityFile" @fileChange="handleFileChange($event,'identityFile')"></upload-com>
    </div>
  </div>
</template>
<template v-if="caseForm.applyCaseType==='原当事人死亡（以继承人名义登记）'">
        <van-field
    v-model="caseForm.originalName"
    :required="true"
    label="死亡当事人姓名"
    placeholder="请输入"
    label-align="left"
  />
        <van-field
    v-model="caseForm.originalIDNumber"

    label="死亡当事人证件号码"
    placeholder="请输入"
    label-align="top"
  />
  <div class="m-cell">
    <div class="m-title required">死亡证明</div>
    <div class="file-content">
      <upload-com :key="2" :isEdit="edit" :uploadFileList="caseForm.deathFiles" @fileChange="handleFileChange($event,'deathFiles')"></upload-com>
    </div>
  </div>
  <div class="m-cell">
    <div class="m-title required">有关部门出具的身份关系证明</div>
    <div class="file-content">
      <upload-com :key="3" :isEdit="edit" :uploadFileList="caseForm.identityRelationFiles" @fileChange="handleFileChange($event,'identityRelationFiles')"></upload-com>
    </div>
  </div>
  <div class="m-cell">
    <div class="m-title">委托文书</div>
    <div class="tip-box">
      <van-icon size="14" color="#9D9DA5" name="warning" />
      <span class="tip-txt">如有多名继承人，应委托一人登记，并上传委托文书</span>
    </div>
    <div class="file-content">
      <upload-com :key="4" :isEdit="edit" :uploadFileList="caseForm.entrustFiles" @fileChange="handleFileChange($event,'entrustFiles')"></upload-com>
    </div>
  </div>
</template>
      </van-cell-group>

    </div>

    <div class="foot">
      <van-button class="pre-btn" type="default" @click="router.back()">上一步</van-button>
      <van-button class="next-btn" type="primary" @click="next">下一步</van-button>
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
  defineComponent
} from "vue";
import { caseApi } from "@/api/case";
import { commonApi } from "@/api/common";
import { useCaseStore } from "@/stores/caseItem";
import { formatDate,copyObj } from "@/utils/baseTool";
import uploadCom from '@/components/uploadCom.vue'
import * as commonTools from '@/utils/commonTool'
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
defineComponent({
  name: "ajsb",
});
let timeout=ref(null);
const caseForm = reactive({
  applyCaseType: "当事人本人登记",
  identityFile: [
//     {
//     "path": {},
//     "type": "img",
//     "name": "bg.png",
//     "fileUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/szaj/h1e22uzxtt.png?q-sign-algorithm=sha1&q-ak=AKIDYrwynVMBdSR4V-bCfn64w3bkfUvAetAKcSz-MwUlECYph_D_ryjmu_u4D7aWOAWP&q-sign-time=1730441999%3B1730701199&q-key-time=1730441999%3B1730701199&q-header-list=host&q-url-param-list=&q-signature=a3438d8a0535cdd86c90c8796fb3757e59ee9661&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa7d4b7af86fd1e4a11bd0799caf5232a2GwUFCGLj5GNoWSuAj1-imCMWlII5OmWNHvbwAogYtE_2asAfAfmV6QljUuzd8x9jieUm-VRfn_cEoHj54mw7CqUBtgM1kqafXAhU25QINYxN3BGm_QyiBnY-zUCMvQho6Y90M_tOiR_ZQS1pfa7C5wiT1hQXkdtOBGVwMGlV34v-hlkWSZFfBc8e1ZyPgAemSeAlSMAnbZarh8QTnWUZ874rOBZnWH3yLVzGC1iUoK5QtK-BxLqDjyXzRWeEx2IPFaac3mVUc3Qc0j0_W9zwkmkuDC2sOE7g8f9uIJd5HpUGMIJLiEH15WIMsrQfMZlq",
//     "fileId": "4831ecf4-befc-40fb-9ea1-89d698aaaad8",
//     "fileName": "bg.png",
//     "objectName": "szaj/h1e22uzxtt.png",
//     "category": "image",
//     "picUrl": "",
//     "isLargeFile": false
// },
// {
//     "type": "pdf",
//     "name": "1.pdf",
//     "fileUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/szaj/h1e27yp61t.pdf?q-sign-algorithm=sha1&q-ak=AKIDNeak6EM14MylPL-RjoHGT1lUEnx5ntfW0MRH5yA7lL1DfY-MutCHO_xp0NAFwtqC&q-sign-time=1730442307%3B1730701507&q-key-time=1730442307%3B1730701507&q-header-list=host&q-url-param-list=&q-signature=d11961a4dbed22d6ccc158f1ea44ced72998828d&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa30ffa57c8baf32bb7f8063e6a3f394a9GwUFCGLj5GNoWSuAj1-imDK-oVO90I-6cXpXu78I0Xy06r-tFg1XviSFYO7WDvhHRYwg_KkNSSeBQiODtA6XyZVcQAR7DFJdkUDIZd3ZIY-lsKZnDpylJrAterK8QYjeLSUVZjbrXh8i-KvexGjUQChGDOf2QJXT-rBy0j1qV6yrMdmbp7qTj8cWhaq_WCbHTW3rnnU1LNAe0Vj6OwZ3hfY4RzwfWydCBYXbKPzYYOuTvDZYapnrnQmJ5jRtlNKoSIHdOhk2N8xv2uOhNTKk87AblJ6felGdgBom67vqQ-o_dU1OzFrLcZ1PklNQWD9n",
//     "fileId": "8a0179c5-c4e0-4430-957a-5d123f14fd87",
//     "fileName": "1.pdf",
//     "objectName": "szaj/h1e27yp61t.pdf",
//     "category": "file",
//     "picUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/thumbnail/obtain-4b2b8267-98c1-4221-a83c-a685ff64166b.png?q-sign-algorithm=sha1&q-ak=AKIDNeak6EM14MylPL-RjoHGT1lUEnx5ntfW0MRH5yA7lL1DfY-MutCHO_xp0NAFwtqC&q-sign-time=1730442307%3B1730701507&q-key-time=1730442307%3B1730701507&q-header-list=host&q-url-param-list=&q-signature=b37ab5e1f43002e74b2effb1f043c1192e719f2a&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa30ffa57c8baf32bb7f8063e6a3f394a9GwUFCGLj5GNoWSuAj1-imDK-oVO90I-6cXpXu78I0Xy06r-tFg1XviSFYO7WDvhHRYwg_KkNSSeBQiODtA6XyZVcQAR7DFJdkUDIZd3ZIY-lsKZnDpylJrAterK8QYjeLSUVZjbrXh8i-KvexGjUQChGDOf2QJXT-rBy0j1qV6yrMdmbp7qTj8cWhaq_WCbHTW3rnnU1LNAe0Vj6OwZ3hfY4RzwfWydCBYXbKPzYYOuTvDZYapnrnQmJ5jRtlNKoSIHdOhk2N8xv2uOhNTKk87AblJ6felGdgBom67vqQ-o_dU1OzFrLcZ1PklNQWD9n",
//     "isLargeFile": false
// }
  ],
  deathFiles: [],
  identityRelationFiles: [],
  entrustFiles: [],
  originalName:'',
  originalIDNumber:'',

});
let tempCase=reactive({});
const edit=ref(false)
const radioChange = (val) => {
  caseForm.applyCaseType = val;
};
onMounted(()=>{
  edit.value=route.query.edit?true:false
  getCaseDetail();
})
const getCaseDetail=async ()=>{
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res=await caseApi.getCaseDetails({
    type:caseStore.caseItem.type,
    bh:caseStore.caseItem.bh,
    refund:caseStore.caseItem.refund,
    caseBh:caseStore.caseItem.caseBh,
    partyIDNumber:userStore.userInfo.identityId,
  })

  if(!res){
    closeToast();
    return;
  }
  let temp=res;
  closeToast();
  for(let key in temp){
    let arr=temp[key];
    if (Array.isArray(arr) && (key === 'identityFile' || key === 'deathFiles' || key === 'identityRelationFiles' || key === 'entrustFiles')) {
      let obj=reactive([])
      for(let item of arr){
        let f=await commonTools.downloadYhFile({
         fileId:item.file_id,
          needThumb:1   
        }).then(res => res).catch(err => err);
        if(f.status==='success'){
          obj.push({
            fileUrl: f.data.data.url,
            picUrl: f.data.data.thumbnail_url,
            fileId: item.file_id,
            type: item.type
          })

        }
      }
      temp[key] = obj
      caseForm[key]=obj
    }
  }

  tempCase=reactive(temp)
  caseForm.originalIDNumber=temp.originalIDNumber
  caseForm.originalName=temp.originalName
  caseForm.applyCaseType=temp.applyCaseType||'当事人本人登记';
  saveTemp();
}
const saveTemp= async ()=>{

  // console.log('saveTemp')
  if(timeout.value){
    clearTimeout(timeout.value)
  }
  timeout.value=setTimeout(async () => {
    let data=Object.assign({}, copyObj(tempCase), copyObj(caseForm));
    for (let key in data) {
        let arr = data[key];
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            item['file_id'] = item.fileId || item.file_id
            item['type'] = item.type
            for (let subKey in item) {
              if (subKey !== 'file_id' && subKey !== 'type') {
                delete item[subKey];
              }
            }
          }
        }
      }
      data.partyIDNumber =userStore.userInfo.identityId;
      //  wx.getStorageSync('common_userInfo').identityIdEnc
      data.partyPhone = userStore.userInfo.phone;
      // wx.getStorageSync('common_userInfo').phoneEnc
      data.caseBh = caseStore.caseItem.caseBh
      caseStore.setTempCase(data);
      caseApi.stagingData({
        ...data
      })
  }, 1000);
}
const next = async ()=>{
  if(caseForm.applyCaseType==='当事人姓名或证件号码已变更'){
    if(!caseForm.originalName){
      showToast('请输入当事人原姓名')
      return;
    }
    if (caseForm.identityFile.length < 1) {
      showToast('请上传户口本身份信息变更登记页或派出所身份信息系变更证明')
        return
      }
  }else if(caseForm.applyCaseType==='原当事人死亡（以继承人名义登记）'){
    if (!caseForm.originalName) {
      showToast('请输入死亡当事人姓名')
      return;
      }
      if (caseForm.deathFiles.length < 1) {
        showToast('请上传死亡证明')
        return
      }
      if (caseForm.identityRelationFiles.length < 1) {
      showToast('请上传有关部门出具的身份关系证明')
        return
      }
  }
  router.push({
    path:'/ajxx',
    query:{
      edit:route.query.edit,
    }
  })
}

const handleFileChange=(val,key)=>{
  caseForm[key]=val;
}
watch(caseForm,(post,pre)=>{
  saveTemp();
})

</script>

<style scoped lang="scss">
.ajsb-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .container {
    padding-top: 16px;
    height: calc(100% - 80px);
    overflow-y: auto;
    .title {
      color: $text-color-base;
      font-size: 16px;
      font-weight: bold;
      padding-top: 20px;
      padding-left: 16px;
    }
    .tip {
      font-size: 14px;
      color: $text-color-base;
      padding-top: 15px;
      padding-left: 16px;
    }
    .van-radio {
      margin-right: 5px;
    }
    .van-cell {
      padding: 16px 16px;
    }
    .van-radio-group{
      position: relative;
      &::after{
      position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: var(--van-padding-md);
    bottom: 0;
    left: var(--van-padding-md);
    border-bottom: 1px solid var(--van-cell-border-color);
    transform: scaleY(.5);
    }
    }
    .m-cell{
      padding: 16px;
      font-size: 14px;
      position: relative;
      color:$text-color-base;
      &::after{
      position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: var(--van-padding-md);
    bottom: 0;
    left: var(--van-padding-md);
    border-bottom: 1px solid var(--van-cell-border-color);
    transform: scaleY(.5);
    }
    .m-title{
      margin-bottom: 10px;
    }
    .tip-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-bottom: 10px;
      .tip-txt{
        margin-left: 4px;
        color:$text-color-placeholder;
      }
    }
    .required::before{
      content: '* ';
      color: var(--van-field-required-mark-color);
    }
    .file-content{
      display: flex;

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