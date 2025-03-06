<template>
  <div class="file-wrap">
    <div v-if="isEdit&&uploadFileList.length<maxNum" class="add-file-btn" @click="clickUpload">
      <van-icon name="plus" size="20" color="#64646A" />
    </div>
    <div
      class="add-file-btn"
      v-for="(file, index) in uploadFileList"
      :key="index"
    >
      <img @click="previewFile(file)" :src="file.type=='img'?file.fileUrl:file.type=='pdf'?file.picUrl:''" alt="">
      <img v-if="isEdit" class="del-icon" @click="deleteFile(index)" src="@/assets/images/icon-close.png" alt="">
    </div>
    <input
      type="file"
      :disabled="disabled"
      :multiple="maxiMum != 1"
      :accept="accept"
      class="upload_file"
      @change="chooseFiles($event)"
      ref="inputImg"
    />
    <van-action-sheet
      v-model:show="showUpload"
      :actions="actions"
      cancel-text="取消"
      description="文件上传组件支持jpg、jpeg、png、tif、pdf、doc、docx格式，上传jpg、jpeg、png、tif请保持图像清晰，清晰度在300dpi以上"
      close-on-click-action
      :safe-area-inset-bottom="true"
      @select="onSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";

import {
  ref,
  watch,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  getCurrentInstance,
  nextTick,
  defineProps,
  defineEmits 
} from "vue";
import {  cosUploadFiles,fileToPdf,cosUploadFile } from "@/utils/oss";
import { FileUrlAndType } from "@/utils/baseTool";
const router = useRouter();
const route = useRoute();
const actions = [
  {
    name: "上传图片",
  },
  {
    name: "PDF",
  },
  // {
  //   name: "WORD",
  // },
];
const disabled = ref(false);
const inputImg = ref(null);
const maxiMum = ref(9);
const accept = ref("");
const maxSize = ref(50);
const selectType = ref("");

const props = defineProps({
  uploadFileList:{
    type:Array,
    default:()=>[]
  },
  isEdit:{
    type:Boolean,
    default:true,
  },
  maxNum:{
    type:Number,
    default:20,
  }
})
const emit = defineEmits(['fileChange']);
const uploadFileList=ref([]);
const isEdit=ref(props.isEdit)
const maxNum=ref(props.maxNum)
watch(
        () => props.isEdit,
        (newValue,oldValue) => {
          isEdit.value=newValue
        }
    )
watch(
        () => props.maxNum,
        (newValue,oldValue) => {
          maxNum.value=newValue
        }
    )
watch(
        () => props.uploadFileList,
        (newValue,oldValue) => {
          uploadFileList.value=newValue
        },{deep:true,immediate:true}
    )
// const uploadFileList = reactive([
// // {
// //     "path": {},
// //     "type": "img",
// //     "name": "bg.png",
// //     "fileUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/szaj/h1e22uzxtt.png?q-sign-algorithm=sha1&q-ak=AKIDYrwynVMBdSR4V-bCfn64w3bkfUvAetAKcSz-MwUlECYph_D_ryjmu_u4D7aWOAWP&q-sign-time=1730441999%3B1730701199&q-key-time=1730441999%3B1730701199&q-header-list=host&q-url-param-list=&q-signature=a3438d8a0535cdd86c90c8796fb3757e59ee9661&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa7d4b7af86fd1e4a11bd0799caf5232a2GwUFCGLj5GNoWSuAj1-imCMWlII5OmWNHvbwAogYtE_2asAfAfmV6QljUuzd8x9jieUm-VRfn_cEoHj54mw7CqUBtgM1kqafXAhU25QINYxN3BGm_QyiBnY-zUCMvQho6Y90M_tOiR_ZQS1pfa7C5wiT1hQXkdtOBGVwMGlV34v-hlkWSZFfBc8e1ZyPgAemSeAlSMAnbZarh8QTnWUZ874rOBZnWH3yLVzGC1iUoK5QtK-BxLqDjyXzRWeEx2IPFaac3mVUc3Qc0j0_W9zwkmkuDC2sOE7g8f9uIJd5HpUGMIJLiEH15WIMsrQfMZlq",
// //     "fileId": "4831ecf4-befc-40fb-9ea1-89d698aaaad8",
// //     "fileName": "bg.png",
// //     "objectName": "szaj/h1e22uzxtt.png",
// //     "category": "image",
// //     "picUrl": "",
// //     "isLargeFile": false
// // },
// // {
// //     "type": "pdf",
// //     "name": "1.pdf",
// //     "fileUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/szaj/h1e27yp61t.pdf?q-sign-algorithm=sha1&q-ak=AKIDNeak6EM14MylPL-RjoHGT1lUEnx5ntfW0MRH5yA7lL1DfY-MutCHO_xp0NAFwtqC&q-sign-time=1730442307%3B1730701507&q-key-time=1730442307%3B1730701507&q-header-list=host&q-url-param-list=&q-signature=d11961a4dbed22d6ccc158f1ea44ced72998828d&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa30ffa57c8baf32bb7f8063e6a3f394a9GwUFCGLj5GNoWSuAj1-imDK-oVO90I-6cXpXu78I0Xy06r-tFg1XviSFYO7WDvhHRYwg_KkNSSeBQiODtA6XyZVcQAR7DFJdkUDIZd3ZIY-lsKZnDpylJrAterK8QYjeLSUVZjbrXh8i-KvexGjUQChGDOf2QJXT-rBy0j1qV6yrMdmbp7qTj8cWhaq_WCbHTW3rnnU1LNAe0Vj6OwZ3hfY4RzwfWydCBYXbKPzYYOuTvDZYapnrnQmJ5jRtlNKoSIHdOhk2N8xv2uOhNTKk87AblJ6felGdgBom67vqQ-o_dU1OzFrLcZ1PklNQWD9n",
// //     "fileId": "8a0179c5-c4e0-4430-957a-5d123f14fd87",
// //     "fileName": "1.pdf",
// //     "objectName": "szaj/h1e27yp61t.pdf",
// //     "category": "file",
// //     "picUrl": "https://fr-signature-1254728086.cos.ap-shanghai.myqcloud.com/thumbnail/obtain-4b2b8267-98c1-4221-a83c-a685ff64166b.png?q-sign-algorithm=sha1&q-ak=AKIDNeak6EM14MylPL-RjoHGT1lUEnx5ntfW0MRH5yA7lL1DfY-MutCHO_xp0NAFwtqC&q-sign-time=1730442307%3B1730701507&q-key-time=1730442307%3B1730701507&q-header-list=host&q-url-param-list=&q-signature=b37ab5e1f43002e74b2effb1f043c1192e719f2a&x-cos-security-token=7WEKKQdEU2kGCgyauNAs1bqEfZtNWIFa30ffa57c8baf32bb7f8063e6a3f394a9GwUFCGLj5GNoWSuAj1-imDK-oVO90I-6cXpXu78I0Xy06r-tFg1XviSFYO7WDvhHRYwg_KkNSSeBQiODtA6XyZVcQAR7DFJdkUDIZd3ZIY-lsKZnDpylJrAterK8QYjeLSUVZjbrXh8i-KvexGjUQChGDOf2QJXT-rBy0j1qV6yrMdmbp7qTj8cWhaq_WCbHTW3rnnU1LNAe0Vj6OwZ3hfY4RzwfWydCBYXbKPzYYOuTvDZYapnrnQmJ5jRtlNKoSIHdOhk2N8xv2uOhNTKk87AblJ6felGdgBom67vqQ-o_dU1OzFrLcZ1PklNQWD9n",
// //     "isLargeFile": false
// // }
// ]);
const TYPE_FORMAT = new Map([
  ["img", ["jpg", "jpeg", "png", "tif"]],
  ["pdf", ["pdf"]],
  ["doc", ["doc", "docx"]],
]);
const showUpload = ref(false);
const clickUpload = () => {
  showUpload.value = true;
};
const onSelect = async (val) => {
  let { name } = val;
  if (name == "上传图片") {
    selectType.value = "img";
    maxiMum.value = 1;
    accept.value = "image/jpeg,image/png,.tif,image/tif";
  } else if ((name = "PDF")) {
    selectType.value = "pdf";
    maxiMum.value = 1;
    accept.value = "application/pdf";
  } else if (name == "WORD") {
    selectType.value = "doc";
    maxiMum.value = 1;
    accept.value =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword";
  }
  nextTick(() => {
    inputImg.value.click();
  });
};

const chooseFiles = async (e) => {
  // console.log(e);
  let files = Object.values(e.target.files);
  let sizeRes = checkFileSize(files, maxSize.value);
  let formatRes = checkFileFormat(files, selectType.value);
  if (!sizeRes || !formatRes) {
    return;
  }

  if (selectType.value == "img") {
    let tempFiles = FileUrlAndType(files);
    for(let item of tempFiles){
      let uploadRes=await cosUploadFile({
        tempFilePath:item.file,
        fileName:item.name,
        suffix:item.suffix,
        needThumb:false
      },'szaj');
      if(!uploadRes){
        return;
      }
      // console.log({ path: item.tempFilePath, type:item.suffix, name: item.name, ...uploadRes })
      let obj={  type:'img', name: item.name, ...uploadRes };
      uploadFileList.value.push(obj)
    }

  } else if (selectType.value == "pdf") {
    let tempFiles = FileUrlAndType(files);
    for(let item of tempFiles){
      let uploadRes=await cosUploadFile({
        tempFilePath:item.file,
        fileName:item.name,
        suffix:item.suffix,
        needThumb:true
      },'szaj');
      if(!uploadRes){
        return;
      }
      // console.log({ path: item.tempFilePath, type:item.suffix, name: item.name, ...uploadRes })
      let obj={  type:item.suffix, name: item.name, ...uploadRes };
      uploadFileList.value.push(obj)
    }
  } else if (selectType.value == "doc") {
  }
  emit('fileChange', uploadFileList.value);
};
const checkFileSize = (files, limit) => {
  let flag = true;
  if (files && files.length) {
    files.forEach((item) => {
      if (limit && item.size > limit * 1024 * 1024) {
        showToast(`文件大小不能超过${limit}M`);
        flag = false;
      }
    });
  } else {
    flag = false;
  }
  return flag;
};
const checkFileFormat = (files, type = "") => {
  let flag = true;
  const typeList = TYPE_FORMAT.get(type) || [];
  if (files && files.length) {
    files.forEach((item) => {
      let tempPath = item.name;
      let suffix = tempPath.split(".").reverse()[0];
      if (!typeList.includes(suffix.toLowerCase())) {
        showToast(`该文件格式不支持上传`);
        flag = false;
      }
    });
  } else {
    flag = false;
  }
  return flag;
};
const previewFile = (item)=>{
  // console.log(item)
  if(item.type=='img'){
    showImagePreview([item.fileUrl]);
  }else if(item.type=='pdf'){
    localStorage.setItem('pdfUrl',item.fileUrl)
    router.push({
    path: '/previewPdf',
  });
  }
}
const deleteFile = (index)=>{
  // console.log(index)
  uploadFileList.value.splice(index,1)
  emit('fileChange', uploadFileList.value);
}
// const uploadFile = async (files) => {
//   try {
//     let tempFiles = FileUrlAndType(files);
//     let ossKey = await cosUploadFile(
//       tempFiles,
//       "szaj",
//       "涉众案件",
//       false,
//       true
//     );
//     return ossKey;
//   } catch (err) {
//     return false;
//   } finally {
//   }
// };
</script>

<style lang="scss" scoped>
.file-wrap {
  display: flex;
  flex-wrap: wrap;
  // overflow-y: auto;
  .upload_file {
    position: absolute;
    top: -999px;
    left: -999px;
    // width: 100%;
    // height: 100%;
    display: block;
    z-index: 2;
    opacity: 0;
    cursor: pointer;
  }
}
.add-file-btn {
  width: 82px;
  height: 82px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #d4d8dc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .del-icon{
    width: 20px;
    height: 20px;
    position: absolute;
    top: -11px;
    right: -11px;
  }
  img{
    max-height: 80px;
  }
}

</style>
