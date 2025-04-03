<template>
  <div class="sj-list-page">
    <van-search
      v-model="searchText"
      show-action
      placeholder="请输入申请编号、当事人姓名、身份证号"
      @search="onSearch"
    >
      <template #action>
        <div @click="openFilter" class="sort-filter">
          <img
            class="time-sort-icon"
            src="https://wfypublic-1254728086.cos.ap-shanghai.myqcloud.com/yh/shezong/timesort.png"
            alt=""
          />
          <span
            :style="{
              color:
                auditResult === '' && downloadState === '' ? '' : '#0096ff',
            }"
            >筛选</span
          >
        </div>
      </template>
    </van-search>
    <div class="export-box">
      <div @click="openExport" v-if="!checkBoxShow" class="export-btn">
        批量导出
      </div>
      <div v-else class="export-btns">
        <div @click="cancel" class="cancel-btn">取消</div>
        <div @click="sure" class="confirm-btn">确定</div>
        <div @click="allExport" class="all-export-btn">全量导出</div>
      </div>
      <div class="task-btn" @click="toExportList">任务列表</div>
    </div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
      class="list-box"
      :class="checkBoxShow ? 'move-right' : ''"
    >
      <div
        class="card"
        v-for="(item, index) in list"
        :key="item.partyBh"
        @click="gotoDetail(item)"
      >
        <img
          v-if="!item.flag"
          class="checkbox-icon"
          src="@/assets/images/unselected.png"
          alt=""
          @click.stop="selectCase(index)"
        />
        <img
          v-else
          class="checkbox-icon"
          src="@/assets/images/selected.png"
          alt=""
          @click.stop="selectCase(index)"
        />
        <div class="title-box">
          <div class="card-title">
            案件号：{{ caseStore.caseItem.caseName }}
          </div>
          <div
            class="label-text"
            style="color: #2a85fc"
            v-if="item.auditResult == '5'"
          >
            待审计
          </div>
          <div
            class="label-text"
            style="color: #11a885"
            v-if="item.auditResult == '6'"
          >
            已审计
          </div>
        </div>
        <div class="money-box">
          <div>
            <div class="tit">损失金额</div>
            <div class="tit">（人民币元）</div>
            <div class="money-tit">
              {{ item.auditLossCash || item.lossCash }}
            </div>
          </div>
          <div class="splitLine"></div>
          <div>
            <div class="tit">投资金额</div>
            <div class="tit">（人民币元）</div>
            <div class="money-tit">
              {{ item.auditInputCash || item.inputTotal }}
            </div>
          </div>
          <div>
            <div class="tit">提现金额</div>
            <div class="tit">（人民币元）</div>
            <div class="money-tit">
              {{ item.auditWithdrawCash || item.withdrawCash }}
            </div>
          </div>
        </div>
        <div class="tip-box">
          <span class="tip-tit">登记时间：</span>
          <span class="tip">{{ item.registerDate }}</span>
        </div>
        <div class="tip-box">
          <span class="tip-tit">当事人：</span>
          <span class="tip"
            >{{ item.auditpartyName || item.partyName }}，{{
              item.auditPartyIDNumber || item.partyIDNumber
            }}，{{ item.auditPartyPhone || item.partyPhone }}</span
          >
        </div>
      </div>
    </van-list>
    <div class="foot">
      <div class="download" @click="downloadTemplate">
        <img class="ztimage" src="@/assets/images/download.png" alt="" />
        <span>下载模版</span>
      </div>
      <div class="download" @click="auditResults">
        <img class="ztimage" src="@/assets/images/lists.png" alt="" />
        <span>审计结果库</span>
      </div>
      <div class="download" @click="auditDeclaration">
        <img class="ztimage" src="@/assets/images/prompt.png" alt="" />
        <span>内网审计失败</span>
      </div>
      <div class="import-btn" @click="apply">导入审计结果</div>
    </div>
    <van-popup
      v-model:show="filterShow"
      closeable
      round
      position="bottom"
      :close-on-click-overlay="false"
      :safe-area-inset-bottom="true"
      :style="{ height: '40%' }"
    >
      <div class="filter-box">
        <div class="filter-title">案件筛选</div>
        <div class="filter-content">
          <div class="select-title">审计状态</div>
          <div class="select-box">
            <div
              class="select-item"
              v-for="(item, index) in statusList"
              :key="index"
              @click="selectStatus(item)"
              :class="status == item ? 'checked' : ''"
            >
              {{ item }}
            </div>
          </div>
          <div class="select-title">下载类型</div>
          <div class="select-box">
            <div
              class="select-item"
              v-for="(item, index) in downloadList"
              :key="index"
              @click="selectDownload(item)"
              :class="download == item ? 'checked' : ''"
            >
              {{ item }}
            </div>
          </div>
          <div class="buttons">
            <div class="default-btn" @click="reset">重置</div>
            <div class="primary-btn" @click="save">确认</div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-dialog
      v-model:show="tipDialogShow"
      title="提示"
      width="100%"
      confirm-button-text="我知道了"
      @confirm="importConfirm"
    >
      <div class="import-rule-box">
        <div class="import-rule-title">导入规则</div>
        <div class="import-tip-item">1.姓名、身份证号不能为空。</div>
        <div class="import-tip-item">2.一个案件内身份证号不能重复。</div>
        <div class="import-tip-item">3.手机号不能超过11位。</div>
        <div class="import-tip-item">
          4.金额不能用千分位符号，所有涉众当事人金额不能为负数。
        </div>
        <div class="import-tip-item">
          5.损失金额与损失计算结果不一致，损失计算结果=投资金额-提现金额。
        </div>
        <div class="import-tip-item">
          6.审计状态只能输入：是、否或者部分通过。
        </div>
        <div class="import-tip-item">7.申请编号禁止修改。</div>
      </div>
    </van-dialog>
    <input
      type="file"
      :multiple="false"
      accept=".xls,.xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      class="upload_file"
      @change="chooseFiles($event)"
      ref="inputFile"
    />
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
  defineComponent
} from "vue";
import { caseApi } from "@/api/case";
import { useCaseStore } from "@/stores/caseItem";
import { useUserStore } from "@/stores/user";
import { copyToClipboard } from "@/utils/baseTool";

const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
const userStore = useUserStore();
defineComponent({
  name: "sjlist",
});
const searchText = ref("");

const checkBoxShow = ref(false);
const filterShow = ref(false);
const tipDialogShow = ref(false);
const errorCount = ref(0);
const inputFile = ref(null);

const statusList = ["全部", "待审计", "已审计"];
const downloadList = ["全部", "已下载", "未下载"];
const statusMap = new Map([
  ["全部", ""],
  ["待审计", "5"],
  ["已审计", "6"],
]);
const downloadMap = new Map<string, string | boolean>([
  ["全部", ""],
  ["已下载", true],
  ["未下载", false],
]);
const download = ref("全部");
const status = ref("全部");
const downloadState = ref<string | boolean>(""); // 定义为 string 或 boolean 类型的响应式变量
const auditResult = ref("");

interface ListItem {
  partyBh: string;
  flag?: boolean;
  auditResult: string | number;
  auditLossCash?: string;
  lossCash?: string;
  auditInputCash?: string;
  inputTotal?: string;
  auditWithdrawCash?: string;
  withdrawCash?: string;
  registerDate?: string;
  auditpartyName?: string;
  partyName?: string;
  auditPartyIDNumber?: string;
  partyIDNumber?: string;
  auditPartyPhone?: string;
  partyPhone?: string;
  // 其他属性
}

const list = ref<ListItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const size = ref(20);

const onSearch = async () => {
  auditResult.value = "";
  downloadState.value = "";
  if (!searchText.value) {
    await getCaseList(true);
    return;
  }
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res: ListItem[] = await caseApi.getRegister({
    caseBh: caseStore.caseItem.caseBh,
    code: searchText.value,
  });
  if (!res) {
    return;
  }
  closeToast();
  list.value = res;
  finished.value = true;
};
const getCaseList = async (reset = false) => {
  if (reset) {
    page.value = 1;
    list.value = [];
    finished.value = false;
  }
  loading.value = true;
  let res: ListItem[] = await caseApi.getAuditCaseList({
    caseBh: caseStore.caseItem.caseBh,
    page: page.value,
    size: size.value,
    auditResult: auditResult.value,
    downloadState: downloadState.value,
  });
  loading.value = false;
  if (!res) {
    errorCount.value++;
    return;
  }
  errorCount.value = 0;

  list.value.push(...res);
  // console.log(list.value)
  if (res.length < size.value) {
    finished.value = true;
  }
};
const selectCase = (index: number) => {
  list.value[index].flag = !list.value[index].flag;
};
const resetSelect=()=>{
  list.value.forEach((item) => {
    item.flag = false;
  });
}
const loadMore = async () => {
  // console.log('loadMore')
  if (finished.value) {
    return;
  }
  if (errorCount.value > 5) {
    return;
  }
  page.value++;
  await getCaseList();
};
const openFilter = () => {
  status.value =
    auditResult.value === ""
      ? "全部"
      : auditResult.value === "5"
      ? "待审计"
      : "已审计";
  download.value =
    downloadState.value === ""
      ? "全部"
      : downloadState.value
      ? "已下载"
      : "未下载";
  filterShow.value = true;
};
const gotoDetail = (item) => {
  caseStore.setSjItem(item);
  router.push("/sjxx");
};
const toExportList = () => {
  router.push("/exportList");
};
const openExport = () => {
  checkBoxShow.value = true;
};
const cancel = () => {
  checkBoxShow.value = false;
};
const sure = async () => {
  let checkedList = list.value
    .filter((item) => item.flag)
    .map((item) => item.partyBh);
  if (checkedList.length < 1) {
    showToast("请勾选");
    return;
  }
  let IDNumber = userStore.userInfo.identityId;
  // IDNumber = "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res = await caseApi.createTask({
    caseBh: caseStore.caseItem.caseBh,
    taskType: 3,
    partyBh: JSON.stringify(checkedList),
    IDNumber: IDNumber,
    auditor: userStore.userInfo.name,
  });
  if (!res) {
    return false;
  }
  closeToast();
  showDialog({
    title: "提示",
    message: "选定导出任务已提交，请前往任务列表查看进度",
    showCancelButton: false,
  });
  resetSelect();
  cancel();
};
const allExport = async () => {
  let confirm = await showConfirmDialog({
    title: "提示",
    message: "是否确定全量导出",
    showCancelButton: true,
  })
    .then(() => true)
    .catch(() => false);
  if (confirm) {
    let IDNumber = userStore.userInfo.identityId;
    // IDNumber =
    //   "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
    showLoadingToast({
      duration: 30000,
      forbidClick: true,
      message: "加载中……",
    });
    let res = await caseApi.createTask({
      caseBh: caseStore.caseItem.caseBh,
      taskType: 2,
      IDNumber: IDNumber,
      auditor: userStore.userInfo.name,
    });
    if (!res) {
      return false;
    }
    closeToast();
    showDialog({
      title: "提示",
      message: "全量导出任务已提交，请前往导出列表查看进度",
      showCancelButton: false,
    });
    resetSelect();
    cancel();
  }
};

const downloadTemplate = async () => {
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res = await caseApi.downloadTemplate({
    caseBh: caseStore.caseItem.caseBh,
  });
  if (!res) {
    return;
  }
  closeToast();
  copyToClipboard(res.url);
  showDialog({
    title: "提示",
    message: "链接已复制到剪贴板",
    showCancelButton: false,
  });
};
const auditResults = async () => {
  let IDNumber = userStore.userInfo.identityId;
  // IDNumber = "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res = await caseApi.createTask({
    caseBh: caseStore.caseItem.caseBh,
    IDNumber: IDNumber,
    auditor: userStore.userInfo.name,
    taskType: 4,
  });
  if (!res) {
    return;
  }
  closeToast();
  await showDialog({
    title: "提示",
    message: "导出审计结果库任务已提交，请前往任务列表查看进度",
    showCancelButton: false,
  });
};
const auditDeclaration = async () => {
  let IDNumber = userStore.userInfo.identityId;
  // IDNumber = "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res = await caseApi.createTask({
    caseBh: caseStore.caseItem.caseBh,
    IDNumber: IDNumber,
    auditor: userStore.userInfo.name,
    taskType: 5,
  });
  if (!res) {
    return;
  }
  closeToast();
  await showDialog({
    title: "提示",
    message: "导出审计失败数据任务已提交，请前往任务列表查看进度",
    showCancelButton: false,
  });
};
const apply = () => {
  tipDialogShow.value = true;
};
const selectStatus = (item: string) => {
  status.value = item;
};
const selectDownload = (item: string) => {
  download.value = item;
};
const reset = () => {
  status.value = "全部";
  download.value = "全部";
};
const save = async () => {
  auditResult.value = statusMap.get(status.value) || "";
  downloadState.value = downloadMap.get(download.value) ?? "";
  getCaseList(true);
  filterShow.value = false;
};
const importConfirm = () => {
  nextTick(() => {
    inputFile.value.click();
  });
  tipDialogShow.value = false;
};
const chooseFiles = async (e: Event) => {
  let IDNumber = userStore.userInfo.identityId;
  // IDNumber = "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  const target = e.target as HTMLInputElement;
  const file = ref<File>();
  if (target.files) {
    file.value = target.files[0];
  }
  const allowedTypes = [
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  // 验证文件类型
  if (!file.value || !allowedTypes.includes(file.value.type)) {
    showToast("仅支持Excel文件（.xls 或 .xlsx）");
    target.value = ""; // 清空已选文件
    return;
  }
  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("IDNumber", IDNumber);
  formData.append("caseBh", caseStore.caseItem.caseBh);
  formData.append("taskType", "1");
  formData.append("auditor", userStore.userInfo.name);
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });

  let res = await caseApi.createTaskMult(formData);
  if (!res) {
    return;
  }
  closeToast();
  await showDialog({
    title: "提示",
    message: "导入审计任务已提交，请前往任务列表查看进度",
    showCancelButton: false,
  });
  target.value = ""; // 清空已选文件
  getCaseList(true);
};
 
onMounted(async () => {});
</script>

<style scoped lang="scss">
.sj-list-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .sort-filter {
    // font-size: 12px;
    color: $text-color-regular;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .time-sort-icon {
      width: 12px;
      height: 14px;
      margin-right: 4px;
    }
  }
  .export-box {
    display: flex;
    .export-btn {
      color: $color-primary;
      font-size: 12px;
      padding: 10px 15px;
      height: 35px;
      box-sizing: border-box;
      width: 180px;
    }
    .export-btns {
      display: flex;
      .cancel-btn {
        font-size: 12px;
        color: $text-color-placeholder;
        margin-left: 8px;
        padding: 10px 7px;
        display: inline-block;
        height: 35px;
        box-sizing: border-box;
      }
      .confirm-btn {
        font-size: 12px;
        color: $color-primary;
        padding: 10px 7px;
        height: 35px;
        box-sizing: border-box;
      }
      .all-export-btn {
        font-size: 12px;
        color: $color-primary;
        margin-left: 8px;
        padding: 10px 7px;
        display: inline-block;
        height: 35px;
        box-sizing: border-box;
      }
    }
    .task-btn {
      font-size: 12px;
      color: $color-primary;
      margin-left: auto;
      padding: 10px 15px;
      display: inline-block;
      height: 35px;
      box-sizing: border-box;
    }
  }
  .list-box {
    height: calc(100% - 171px);
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

          color: $text-color-placeholder;
          white-space: nowrap;
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
  .list-box.move-right {
    .card {
      transform: translateX(30px);
    }
  }
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 80px;

    width: 100%;
    display: flex;
    font-size: 12px;
    box-sizing: border-box;
    background: #fff;
    color: $text-color-placeholder;

    .download {
      width: 90px;
      display: flex;
      flex-direction: column;

      align-items: center;
      margin-top: 5px;
    }
    .ztimage {
      width: 17px;
      height: 17px;
      margin-top: 4.5px;
      margin-bottom: 4.5px;
    }
    .import-btn {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: $color-primary;
      margin: 5px 15px 0;
      width: 135px;
      border-radius: 2.5px;
      font-size: 14px;
    }
  }
  .filter-box {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    .filter-title {
      font-size: 16px;
      color: $text-color-base;
      padding: 16px 15px;
      font-weight: bold;
      text-align: center;
      border-bottom: $border;
      margin-bottom: 15px;
    }
    .filter-content {
      .select-title {
        font-size: 14px;
        margin: 10px 0;
      }
      .select-box {
        display: flex;
        .select-item {
          margin-right: 10px;
          border-radius: 2.5px;
          color: $text-color-regular;
          border: $border;
          height: 35px;
          line-height: 35px;
          width: 80px;
          text-align: center;
          box-sizing: border-box;
          font-size: 14px;
          &.checked {
            background: $color-primary;
            color: #fff;
          }
        }
      }
      .buttons {
        display: flex;
        .default-btn {
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: $text-color-base;
          background: #fff;
          width: 80px;
          border-radius: 2.5px;
          font-size: 14px;
          border: $border;
          margin: 35px 15px 0 0;
        }
        .primary-btn {
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          background: $color-primary;
          border-radius: 2.5px;
          font-size: 14px;
          margin: 35px 0 0;
          flex: 1;
        }
      }
    }
  }
  .import-rule-box {
    padding: 15px;
    .import-rule-title {
      font-size: 16px;
      color: $text-color-base;
      margin-bottom: 10px;
    }
    .import-tip-item {
      font-size: 12px;
      color: $text-color-placeholder;
      line-height: 19px;
    }
  }
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
</style>