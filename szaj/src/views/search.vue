<template>
  <div class="search-list-page">
    <van-search
      v-model="searchText"
      show-action
      :placeholder="name === '模糊查询' ? '案号、案件简称搜索' : '案件简称搜索'"
      @search="onSearch"
    >
      <template #action>
        <van-button
          @click="onSearch"
          class="search-btn"
          size="medium"
          type="primary"
          >搜索</van-button
        >
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
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
} from "vue";
import { commonApi } from "@/api/common";
import { useCaseStore } from "@/stores/caseItem";
import { formatDate } from "@/utils/baseTool";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();

const searchText = ref("");
const list = ref([]);
const tempList = ref([]);

const name = ref("");
const fycx = ref("");

onMounted(() => {
  name.value = route.query.name as string;
  fycx.value = (route.query.fycx || "") as string;
  document.title = name.value;
  if (fycx.value) {
    findCourtCase();
  }
});

const onSearch = () => {
  if (name.value == "法院查询") {
    list.value = tempList.value.filter((res) => {
      return res.caseAbbreviation.includes(searchText.value);
    });
  } else {
    if (!searchText.value) {
      showToast("请先输入查询信息");
      return;
    }
    findVagueCase();
  }
};
const findVagueCase = async () => {
  let res = await commonApi.findVagueCase({
    IDNumber:userStore.userInfo.identityId,
    code: searchText.value,
  });
  if (!res) {
    return;
  }
  if (res.length) {
    list.value = res;
    tempList.value = res;
  } else {
    showToast("无案件");
  }
};
const findCourtCase = async () => {
  let res = await commonApi.findCourtCase({
    IDNumber:userStore.userInfo.identityId,
    code: fycx.value,
  });
  if (!res) {
    return;
  }
  // console.log(res)
  if (res.length) {
    list.value = res;
    tempList.value = res;
  } else {
    showToast("无案件");
  }
};
const toDetail = async (item) => {
  caseStore.setCaseItem(item);
  let confirm = await showConfirmDialog({
    title: "提示",
    message: "请如实登记，非案件当事人登记或虚假登记将追究法律责任！",
    showCancelButton: false,
  })
    .then(() => true)
    .catch(() => false);
  if (confirm) {
    commonApi.statistics({
      method: "dsrView",
      xm: userStore.userInfo.name,
      zjhm: userStore.userInfo.identityId,
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
</script>

<style scoped lang="scss">
.search-list-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .search-btn {
    width: 60px;
    margin: 0 4px 0 4px;
  }
  .list-box {
    height: calc(100% - 63px);
    padding-bottom: 50px;
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
}
</style>

