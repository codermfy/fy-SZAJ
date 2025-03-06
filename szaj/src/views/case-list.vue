<template>
  <div class="case-list-page">
    <van-search
      v-model="searchText"
      show-action
      placeholder="请输入案号"
      @search="onSearch"
    >
      <template #action>
        <div @click="timeSort" class="sort-filter">
          <img
            class="time-sort-icon"
            src="https://wfypublic-1254728086.cos.ap-shanghai.myqcloud.com/yh/shezong/timesort.png"
            alt=""
          />
          <span>时间排序</span>
        </div>
      </template>
    </van-search>
    <div class="list-box">
      <div
        class="card"
        v-for="(item, index) in list"
        :key="index"
        @click="toDetail(item)"
      >
        <div class="title-box">
          <div class="card-title">
            {{ item.caseAbbreviation }}
          </div>

          <div
            class="label-text"
            v-if="item.state === '未登记' && item.jurisdiction != '3'"
          >
            {{ "未登记" }}
          </div>
          <div class="label-text" v-else-if="item.state === '已登记'">
            {{ "已登记" }}
          </div>
          <div class="label-text" v-else-if="item.state === '已登记，无法修改'">
            {{ "已登记，无法修改" }}
          </div>
          <div
            class="label-text"
            v-else-if="item.state === '登记时间已过，无法登记'"
          >
            {{ "登记时间已过，无法登记" }}
          </div>
          <div class="label-text" v-else-if="item.state === '请登记退款信息'">
            {{ "请登记退款信息" }}
          </div>
        </div>
        <div class="tip-box">
          <div class="tip-tit">案号</div>
          <div class="tip">{{ item.caseName }}</div>
        </div>
        <div class="tip-box">
          <div class="tip-tit">执行法院</div>
          <div class="tip">{{ item.courtExecution || "" }}</div>
        </div>
      </div>
      <div class="empty" v-if="!list.length">
        <img
          src="https://wfypublic-1254728086.cos.ap-shanghai.myqcloud.com/yh-baoquan/img/2.jpg"
          alt=""
        />
        <span>暂无数据</span>
      </div>
    </div>
    <div class="foot">
      <template v-if="sj && type === '审计人员'">
        <div class="block-btn"></div>
        <van-button class="switch-btn" @click="changeDSR" type="default"
          >切换当事人</van-button
        >
      </template>
      <template v-else-if="sj && type !== '审计人员'">
        <van-button class="apply-btn" @click="apply" type="primary"
          >登记</van-button
        >
        <van-button class="switch-btn" @click="changeSJ" type="default"
          >切换审计员</van-button
        >
      </template>

      <template v-else>
        <van-button class="apply-btn" @click="apply" type="primary"
          >登记</van-button
        >
      </template>
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
  onActivated,
} from "vue";
import { caseApi } from "@/api/case";
import { commonApi } from "@/api/common";
import { useCaseStore } from "@/stores/caseItem";
import { useUserStore } from "@/stores/user";
import { formatDate, getToken } from "@/utils/baseTool";
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
const userStore = useUserStore();

const searchText = ref("");
const list = ref([]);
const sj = ref(false);
const isSort = ref(false);
const tempList = ref([]);
const type = ref("");
const onSearch = () => {
  list.value = tempList.value.filter((res) => {
    return res.caseName.includes(searchText.value);
  });
};
const getCaseList = async (options?: Number) => {
  // let IDNumber =
  //   "a430e62f76cd317cf81c406aeac41a3b2edbba69eda0fef98afeef3b5b7adcf9";
  // IDNumber = "799053e6b2eb0db09818a5660a3c0677d77c5635797283b6eb03d5151430658d";
  let IDNumber = userStore.userInfo.identityId;

  let res = await caseApi.getCaseList({
    type: options === 1 ? 1 : 2,
    IDNumber: IDNumber,
  });
  if (!res) {
    return;
  }
  if (res.type === "审计人员") {
    sj.value = true;
  }
  tempList.value = res.list;
  list.value = res.list;
  type.value = res.type;
};
const timeSort = () => {
  if (isSort.value) {
    list.value.sort((a, b) => {
      let t1 = new Date(a.startTime);
      let t2 = new Date(b.startTime);
      if (t1 > t2) return -1;
      if (t1 < t2) return 1;
      return 0;
    });
  } else {
    list.value.sort((b, a) => {
      let t1 = new Date(a.startTime);
      let t2 = new Date(b.startTime);
      if (t1 > t2) return -1;
      if (t1 < t2) return 1;
      return 0;
    });
  }
  isSort.value = !isSort.value;
};
const changeSJ = () => {
  getCaseList(2);
};
const changeDSR = () => {
  getCaseList(1);
};
const toDetail = (item) => {
  caseStore.setCaseItem(item);
  if (type.value === "审计人员") {
    router.push('/sjlist')
  } else {
    commonApi.statistics({
      method: "dsrView",
      xm: userStore.userInfo.name,
      zjhm:userStore.userInfo.identityId,
      fydm: item.fydm,
      ajbh: item.caseBh,
      date: formatDate(Date.now()),
    });
    const { caseNotice, state, type } = item;
    const isTypeOne = type == "1";
    const isRegistrationExpired = state === "登记时间已过，无法登记";
    const baseUrl = caseNotice
      ? "/announcement"
      : isTypeOne && !isRegistrationExpired
      ? "/ajsb"
      : "/ajxx";
    const editParam = isTypeOne ? "1" : "";

    if (isRegistrationExpired) {
      router.push({
        path: baseUrl,
        query: {
          edit: editParam,
        },
      });
      return;
    }
    router.push({
      path: baseUrl,
      query: {
        edit: editParam,
      },
    });
  }
};

const apply = () => {
  router.push({
    path: "/ajdj",
  });
};
const getToken_http = async () => {
  const thirdtoken = getToken("THIRD-TOKEN");
  if (!thirdtoken) {
    let res = await commonApi.getToken({
      zjhm: userStore.userInfo.identityId,
    });
    if (!res) {
      return;
    }
    localStorage.setItem("THIRD-TOKEN", res);
  }
};
const getUserInfo = async () => {
  if (route.query.code && !userStore.userInfo.name) {
    let res = await commonApi.getUserInfo({
      code: route.query.code as string,
    });
    if (!res) {
      return;
    }
    userStore.setUserInfo(res);
  }
};

onMounted(async () => {
  await getUserInfo();
  await getToken_http();
  await getCaseList();
});
</script>

<style scoped lang="scss">
.case-list-page {
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
  .list-box {
    height: calc(100% - 136px);
    overflow-y: auto;
    .card {
      background-color: #ffffff;
      border-radius: 6px;
      margin: 15px 15px 0px;
      padding: 15px;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0 1px 4px 0 #0000000a;
      .title-box {
        display: flex;
        align-items: center;
        .card-title {
          color: $text-color-base;
          font-size: 16px;
          font-weight: bold;
          flex: 1;
        }
        .label-text {
          color: $color-tips;
          font-size: 12px;
          line-height: 1;
          padding: 0 14px;
          height: 22px;
          display: flex;
          align-items: center;
          background-color: $color-primary5;
          border-radius: 29px;
          white-space: nowrap;
        }
      }
      .tip-box {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .tip-tit {
          font-size: 14px;
          color: $text-color-placeholder;
          width: 100px;
        }
        .tip {
          font-size: 14px;
          color: $text-color-base;
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
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 80px;

    width: 100%;
    display: flex;
    padding: 5px 15px 0px 15px;
    box-sizing: border-box;
    .block-btn {
      flex: 2;
      padding: 0 15px;
    }
    .switch-btn {
      flex: 1;
      margin-left: 15px;
    }
    .apply-btn {
      flex: 2;
    }
  }
}
</style>


