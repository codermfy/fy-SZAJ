<template>
  <div class="export-list-page">
    <div class="export-title">任务列表</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="refresh-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
      class="list-box"
    >
      <div class="card" v-for="item in list" :key="item.taskId" @click="getDownload(item)">
        <div class="title-box">
          <div class="card-title">
            任务类型：{{ item.taskName }}
          </div>
          <div
            class="label-text"
            :class="'label-status'+item.status"
          >
            {{ statusMap.get(item.status) }}
          </div>
        </div>
        <div class="tip-box">
          <span class="tip-tit">任务ID：</span>
          <span class="tip">{{item.taskId}}</span>
        </div>
        <div class="tip-box">
          <span class="tip-tit">创建时间：</span>
          <span class="tip">{{formatDate(item.startTime)}}</span>
        </div>
        <div class="tip-box" v-if="item.endTime">
          <span class="tip-tit">{{item.taskType===1?'导入时间：':'导出时间（有效期7天）：'}}</span>
          <span class="tip">{{formatDate(item.endTime)}}</span>
        </div>

        <div class="tip-box" v-if="item.reason&&item.status===4">
          <span class="tip-tit">失败原因：</span>
          <span class="tip">{{item.reason||''}}</span>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
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
  onActivated,
  nextTick,
  defineComponent,
} from "vue";
import { caseApi } from "@/api/case";
import { useCaseStore } from "@/stores/caseItem";
import { useUserStore } from "@/stores/user";
import { formatDate,copyToClipboard } from "@/utils/baseTool";

const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
const userStore = useUserStore();
defineComponent({
  name: "exportList",
});
interface ListItem {
  taskId: string;
  IDNumber: string;
  taskType: number;
  taskName: string;
  auditor: string;
  caseBh: string;
  status: number;
  create_time: number;
  update_time: number;
  startTime: number;
  endTime: number;
  reason: string;
}
const list = ref<ListItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const errorCount = ref(0);
const statusMap=new Map([
  [1,'排队中'],
  [2,'处理中'],
  [3,'处理成功'],
  [4,'处理失败'],
])

const onRefresh = async () => {

  finished.value = false;
  await loadMore();
  refreshing.value = false;
};
const loadMore = async () => {

  if (finished.value) {
    return;
  }
  if (errorCount.value > 5) {
    return;
  }

  await getExportList();
};
const getExportList = async () => {
  let IDNumber = userStore.userInfo.identityId;
  // IDNumber = "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  loading.value = true;
  let res = await caseApi.getExportList({
    caseBh: caseStore.caseItem.caseBh,
    IDNumber: IDNumber,
  });
  loading.value = false;
  if (!res) {
    errorCount.value++;
    return false;
  }
  errorCount.value = 0;

  finished.value = true;
  // console.log(res);
  list.value=res.list;
};
const getDownload=(item:ListItem)=>{
  // console.log(item)
  if(item.taskType==1||item.status===1||item.status===2||item.status===4){
    return;
  }else{
    copyToClipboard(item.fileUrl);
    showDialog({
    title: "提示",
    message: "链接已复制到剪贴板",
    showCancelButton: false,
  });
  }

}
onMounted(async () => {
  await getExportList();
});
</script>

<style scoped lang="scss">
.export-list-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .export-title {
    font-size: 12px;
    color: $text-color-placeholder;
    padding: 10px 15px;
    display: inline-block;
    height: 35px;
    box-sizing: border-box;
  }
  .refresh-list {
    height: calc(100% - 60px);
  }
  .list-box {
    // height: calc(100% - 171px);
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .card {
      background-color: #ffffff;
      border-radius: 5px;
      margin: 0px 15px 10px;
      padding: 15px;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0 1px 4px 0 #0000000a;
      transform: translateX(0); /* 初始位置 */
      transition: transform 0.2s linear;
      .checkbox-icon {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -30px;
      }
      .title-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .card-title {
          color: $text-color-base;
          font-size: 16px;
          font-weight: bold;
          flex: 1;
        }
        .label-text {
          flex: 0 0 70px;
          font-size: 14px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .label-status1{
          color:$color-tips;
        }
        .label-status2{
          color:$color-tips;
        }
        .label-status3{
          color:$color-success;
        }
        .label-status4{
          color:$color-danger;
        }
      }
      .money-box {
        display: flex;
        justify-content: space-around;
        text-align: center;
        margin: 15px 0;
        .splitLine {
          width: 1px;
          background: $text-color-placeholder;
        }
        .tit {
          font-size: 12px;
          line-height: 19px;
          color: $text-color-placeholder;
        }
        .money-tit {
          font-size: 16px;
          font-weight: bold;
          margin-top: 5px;
          color: $color-primary;
          line-height: 25px;
        }
      }
      .tip-box {
        display: flex;
        // align-items: center;
        line-height: 25px;
        .tip-tit {
          font-size: 12px;
          white-space: nowrap;
          color: $text-color-placeholder;
        }
        .tip {
          font-size: 12px;
          color: $text-color-regular;
        }
      }
    }
    .empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100%);
      span {
        font-size: 12px;
        margin-top: 15px;
        color: $text-color-placeholder;
      }

      img {
        width: 68px;
        height: 54px;
      }
    }
  }
}
</style>