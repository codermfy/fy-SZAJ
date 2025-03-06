<template>
<div class="announcement-page">
  <div class="title">{{ caseStore.caseItem.caseName }}</div>
  <div class="getNotice" @click="getFile">
    <div>{{ caseStore.caseItem.caseName }}公告</div>
    <img src="@/assets/images/down_left.png" alt="">
  </div>
  <div class="checkbox">
    <van-checkbox @click="checkedChange" v-model="checked">已阅读并同意<span class="agreeTitle">《公告》</span></van-checkbox>
  </div>
  <van-button @click="addCase" class="check-btn" size="medium" type="primary">我已知晓</van-button>
</div>
</template>

<script setup lang="ts">
import {
  useRouter,
  useRoute
} from "vue-router";
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  defineComponent
} from "vue";
import {
  commonApi
} from "@/api/common";
import {
  formatDate
} from "@/utils/baseTool";
import {
  useCaseStore
} from "@/stores/caseItem";
import {
  useReadFileStore
} from "@/stores/readFile";
import * as commonTools from '@/utils/commonTool'
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
const readFileStore = useReadFileStore();
const checked = ref(false)
// const fileUrl=ref('');
defineComponent({
  name: "announcement",
});
const getFile = async () => {
  let res = await commonTools.downloadYhFile({
    fileId: caseStore.caseItem.caseNotice
  }).then(res => res).catch(err => err);
  if (res.status === 'success') {
    // fileUrl.value=res.data.data.url
    localStorage.setItem('pdfUrl', res.data.data.url)
    previewPdf();
    recordRead();
  }

}
const recordRead = () => {
  let readList = readFileStore.readFile;
  let index = readList.indexOf(caseStore.caseItem.caseBh);
  if (index === -1) {
    readList.push(caseStore.caseItem.caseBh);
    readFileStore.setReadFile(readList);
  }
}
const previewPdf = () => {
  router.push({
    path: '/previewPdf',
  });
}
const checkedChange = (val) => {
  let index = readFileStore.readFile.indexOf(caseStore.caseItem.caseBh);
  if (index !== -1) {
  } else {
    checked.value = false
    showToast("请先阅读公告");
    return;
  }

}
const addCase = () => {
  if (!checked.value) {
    showToast("请先阅读并同意");
    return;
  }
  if (caseStore.caseItem.type == '1') {
    router.push({
      path: '/ajsb',
      query: {
        edit: route.query.edit,
      },
    });
  } else {
    router.push({
      path: '/ajxx',
      query: {
        edit: route.query.edit,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.announcement-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  padding: 0 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    line-height: 25px;
    color: $text-color-base;
    font-weight: bold;
    margin: 30px 0 13px;
  }

  .getNotice {
    padding: 5px 0;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    img {
      width: 14px;
      height: 14px;
    }
  }

  .checkbox {
    margin: 22px 0;
    padding: 5px 0;
    font-size: 13px;
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .agreeTitle {
      color: $text-color-base;
      font-weight: bold;
    }
  }

  .check-btn {
    width: 100%;
  }
}
</style>
