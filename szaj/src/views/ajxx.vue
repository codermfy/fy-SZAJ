<template>
  <div class="ajxx-page">
    <div class="container" ref="containerRef">
      <div class="tipsbox" v-if="edit && caseStore.caseItem.type !== '1'">
        <van-icon size="16" color="#9D9DA5" name="warning" />
        <span>点击重置将恢复原登记信息。</span>
        <div class="resetbtn" @click="reset">重置</div>
      </div>
      <van-cell-group inset>
        <div class="title">{{ edit ? "基本信息" : "案件信息" }}</div>
        <van-field
          v-model="caseStore.caseItem.caseAbbreviation"
          label="案件简称"
          disabled
          placeholder="请输入"
          label-align="left"
        />
        <van-field
          v-model="caseStore.caseItem.caseName"
          label="案号"
          disabled
          placeholder="请输入"
          label-align="left"
        />
        <van-field
          v-model="caseStore.caseItem.courtExecution"
          label="执行法院"
          disabled
          placeholder="请输入"
          label-align="left"
        />
      </van-cell-group>
      <template v-if="caseStore.caseItem.type === '4'">
        <van-cell-group inset>
          <div class="title">核查审计结果</div>
          <van-field
            v-model="caseForm.auditName"
            label="姓名"
            :required="edit"
            disabled
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="caseForm.auditIDNumber"
            label="公民身份号码"
            :required="edit"
            disabled
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="caseForm.auditInputCash"
            label="投入总额（人民币元）"
            :required="edit"
            type="number"
            disabled
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="
              handleInputChangeDigit($event, 'auditInputCash')
            "
          />
          <van-field
            v-model="caseForm.auditWithdrawCash"
            label="提现总额（人民币元）"
            :required="edit"
            type="number"
            disabled
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="
              handleInputChangeDigit($event, 'auditWithdrawCash')
            "
          />
          <van-field
            v-model="caseForm.auditStatus"
            label="核查审计状态"
            :required="edit"
            disabled
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-if="caseForm.auditStatus === '审计失败'"
            v-model="caseForm.reason"
            label="核查审计失败原因"
            :required="edit"
            disabled
            placeholder="请输入"
            label-align="top"
            rows="2"
            autosize
            type="textarea"
          />
        </van-cell-group>
      </template>
      <template v-else>
        <van-cell-group inset>
          <div class="title">当事人信息</div>
          <van-field
            v-model="caseForm.partyName"
            label="姓名"
            :required="edit"
            :disabled="!nameEdit"
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="caseForm.partyIDNumber"
            label="公民身份号码"
            :required="edit"
            :disabled="true"
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="caseForm.partyPhone"
            label="手机号码"
            :required="edit"
            type="tel"
            maxlength="11"
            :disabled="!nameEdit"
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="caseForm.partyAddress"
            label="实际居住地"
            :required="edit"
            :disabled="!edit"
            :placeholder="
              edit
                ? '请填写具体地址，例xx省xx市xx区(县)xx街道xx小区xx幢xx单元xx室'
                : ''
            "
            label-align="top"
            rows="2"
            autosize
            type="textarea"
          />
        </van-cell-group>
        <van-cell-group inset>
          <div class="title">投入总额</div>
          <van-field
            v-model="caseForm.inputCash"
            label="投入现金（人民币元）"
            type="number"
            :required="edit"
            :disabled="!edit"
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="handleInputChangeDigit($event, 'inputCash')"
          />
          <van-field
            v-model="caseForm.otherInputCash"
            label="其他形式投入金额（人民币元）"
            type="number"
            :required="edit"
            :disabled="!edit"
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="
              handleInputChangeDigit($event, 'otherInputCash')
            "
          />
          <div class="title">提取总额</div>
          <van-field
            v-model="caseForm.withdrawCash"
            label="提现金额（人民币元）"
            type="number"
            :required="edit"
            :disabled="!edit"
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="handleInputChangeDigit($event, 'withdrawCash')"
          />
          <van-field
            v-model="caseForm.otherWithdrawCash"
            label="其他形式提取金额（人民币元）"
            type="number"
            :required="edit"
            :disabled="!edit"
            :placeholder="edit ? '请输入' : '0'"
            label-align="top"
            @update:model-value="
              handleInputChangeDigit($event, 'otherWithdrawCash')
            "
          />
          <van-field
            v-model="caseForm.lossCash"
            label="损失金额（人民币元）"
            type="number"
            :disabled="true"
            :placeholder="edit ? '' : '0'"
            label-align="top"
            @update:model-value="handleInputChangeDigit($event, 'lossCash')"
          />
          <div class="tips">
            <van-icon size="16" color="#9D9DA5" name="warning" />
            <div class="tip-box">
              <div class="tip-item">1.损失金额=投入总额-提取总额</div>
              <div class="tip-item">2.投入总额=投入现金+其他形式投入金额</div>
              <div class="tip-item">3.提取总额=提现金额+其他形式提取金额</div>
            </div>
          </div>
        </van-cell-group>
        <van-cell-group inset>
          <div class="title">证据材料</div>
          <div class="m-cell">
            <div class="m-title" :class="edit ? 'required' : ''">
              身份证正反面
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="edit"
                :maxNum="2"
                :uploadFileList="caseForm.IDNumberArray"
                @fileChange="handleFileChange($event, 'IDNumberArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title" :class="edit ? 'required' : ''">
              银行流水凭证
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="edit"
                :uploadFileList="caseForm.bankArray"
                @fileChange="handleFileChange($event, 'bankArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">合同及其他证明材料</div>
            <div class="file-content">
              <upload-com
                :isEdit="edit"
                :uploadFileList="caseForm.contractArray"
                @fileChange="handleFileChange($event, 'contractArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">其他证明材料</div>
            <div class="file-content">
              <upload-com
                :isEdit="edit"
                :uploadFileList="caseForm.materialArray"
                @fileChange="handleFileChange($event, 'materialArray')"
              ></upload-com>
            </div>
          </div>
        </van-cell-group>
        <van-cell-group inset v-if="edit">
          <div class="title">备注栏</div>
          <van-field
            v-model="caseForm.notes"
            placeholder="请作简要说明..."
            label-align="top"
            maxlength="2000"
            rows="6"
            autosize
            type="textarea"
          />
        </van-cell-group>
      </template>
    </div>
    <div class="foot" v-if="needEdit">
      <van-button class="pre-btn" type="default" @click="cancel"
        >取消</van-button
      >
      <van-button class="next-btn" type="primary" @click="editsave"
        >确认提交</van-button
      >
    </div>
    <div
      class="foot"
      v-else-if="
        !edit &&
        caseStore.caseItem.type === '3' &&
        caseStore.caseItem.refund === 1 &&
        caseStore.caseItem.state === '已登记'
      "
    >
      <template v-if="caseForm.dsrComfirm">
        <van-button class="pre-btn" type="default" @click="back"
          >已确认 返回</van-button
        >
      </template>
      <template v-else>
        <van-button class="pre-btn" type="default" @click="backList"
          >已提交 返回</van-button
        >
        <van-button
          class="next-btn"
          type="primary"
          :disabled="!!expired"
          @click="openEdit"
          >可再次修改</van-button
        >
      </template>
    </div>
    <div class="foot" v-else-if="!edit && caseStore.caseItem.refund === 2">
      <van-button class="next-btn" type="primary" @click="toRefund"
        >登记退款账号</van-button
      >
    </div>
    <div class="foot" v-else-if="caseStore.caseItem.type === '3'"></div>
    <div
      class="foot"
      v-else-if="
        caseStore.caseItem.state === '登记时间已过，无法登记' ||
        caseStore.caseItem.state === '已登记，无法修改'
      "
    ></div>
    <div
      class="foot"
      v-else-if="
        caseStore.caseItem.type === '2' &&
        caseStore.caseItem.jurisdiction === '2'
      "
    >
      <van-button class="pre-btn" type="default" @click="openEdit"
        >有出入修改</van-button
      >
      <van-button class="next-btn" type="primary" @click="back"
        >无误确认</van-button
      >
    </div>
    <div
      class="foot"
      v-else-if="
        caseStore.caseItem.type === '2' &&
        caseStore.caseItem.jurisdiction == '3'
      "
    ></div>
    <div
      class="foot"
      v-else-if="
        caseStore.caseItem.type === '2' &&
        caseStore.caseItem.jurisdiction === '1'
      "
    >
      <van-button class="next-btn" type="primary" @click="back"
        >无误确认</van-button
      >
    </div>
    <div class="foot" v-else-if="caseStore.caseItem.type === '4'"></div>
    <div class="foot" v-else>
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
import uploadCom from "@/components/uploadCom.vue";
import * as commonTools from "@/utils/commonTool";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const caseStore = useCaseStore();
import { usePathStore } from "@/stores/routerPath";
const pathStore=usePathStore();
defineComponent({
  name: "ajxx",
});

const REQUEST_SUCCESS = 200;
const TYPE_ONE = "1";
const TYPE_TWO = "2";

const edit = ref(false);
const needEdit = ref(false);
const nameEdit = ref(false);
const expired = ref(false);
const containerRef = ref(null);
let timeout = ref(null);

const caseForm: any = reactive({
  applyCaseType: "当事人本人登记",
  identityFile: [],
  deathFiles: [],
  identityRelationFiles: [],
  entrustFiles: [],
  originalName: "",
  originalIDNumber: "",
  //核查审计结果
  auditName: "",
  auditIDNumber: "",
  auditInputCash: "",
  auditWithdrawCash: "",
  auditStatus: "",
  reason: "",
  // 当事人信息
  partyName: "",
  partyIDNumber: "",
  partyPhone: "",
  partyAddress: "",
  //投入总额
  inputCash: "",
  otherInputCash: "",
  withdrawCash: "",
  otherWithdrawCash: "",
  lossCash: "",
  //证据材料
  IDNumberArray: [],
  bankArray: [],
  contractArray: [],
  materialArray: [],
  notes: "",
});

onMounted(() => {
  edit.value = route.query.edit ? true : false;
  if (
    caseStore.caseItem.hesitateEndTime &&
    caseStore.caseItem.hesitateEndTime < new Date().getTime()
  ) {
    expired.value = true;
  }
  getCaseDetails();
});
const getCaseDetails = async () => {
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let partyIDNumber =userStore.userInfo.identityId;;
  let res = await caseApi.getCaseDetails({
    type: caseStore.caseItem.type,
    bh: caseStore.caseItem.bh,
    refund: caseStore.caseItem.refund,
    caseBh: caseStore.caseItem.caseBh,
    partyIDNumber,
  });
  if (!res) {
    closeToast();
    return false;
  }
  closeToast();
  for (let key in res) {
    let arr = res[key];
    if (
      Array.isArray(arr) &&
      !(
        key === "identityFile" ||
        key === "deathFiles" ||
        key === "identityRelationFiles" ||
        key === "entrustFiles"
      )
    ) {
      let obj = reactive([]);
      for (let item of arr) {
        let f = await commonTools
          .downloadYhFile({
            fileId: item.file_id,
            needThumb: 1,
          })
          .then((res) => res)
          .catch((err) => err);
        if (f.status === "success") {
          obj.push({
            fileUrl: f.data.data.url,
            picUrl: f.data.data.thumbnail_url,
            fileId: item.file_id,
            type: item.type,
          });
      
        }
      }
      caseForm[key] = obj;
    } else {
      caseForm[key] = res[key];
    }
  }

  if (!res.partyName) {
    caseForm.partyName = userStore.userInfo.name;
  }
  if (!res.partyIDNumber || caseStore.caseItem.type === TYPE_ONE) {
    caseForm.partyIDNumber =userStore.userInfo.starIdentityId
  }
  if (!res.partyPhone || caseStore.caseItem.type === TYPE_ONE) {
    caseForm.partyPhone = userStore.userInfo.starPhone;
  }
  if (!res.otherInputCash) {
    caseForm.otherInputCash = 0;
  }
  if (!res.otherWithdrawCash) {
    caseForm.otherWithdrawCash = 0;
  }
  if (caseStore.caseItem.type === TYPE_ONE) {
    caseForm.caseBh = caseStore.caseItem.caseBh;
  }
};
const reset = async () => {
  let confirm = await showConfirmDialog({
    title: "提示",
    message: "重置将清除暂存信息，是否继续？",
    showCancelButton: true,
  })
    .then(() => true)
    .catch(() => false);
  if (confirm) {
  
    let res = await getOriginalCaseDetails();

    if (!res) {
      return;
    }
    saveTemp();
  }
};
const getOriginalCaseDetails = async () => {
  showLoadingToast({
      duration: 30000,
      forbidClick: true,
      message: "加载中……",
    });
  let partyIDNumber =userStore.userInfo.identityId;
  let res = await caseApi.getCaseDetailsNoStagingData({
    type: caseStore.caseItem.type,
    bh: caseStore.caseItem.bh,
    refund: caseStore.caseItem.refund,
    caseBh: caseStore.caseItem.caseBh,
    partyIDNumber,
  });
  if (!res) {
    closeToast();
    return false;
  }
  closeToast();
  for (let key in res) {
    let arr = res[key];
    if (
      Array.isArray(arr) &&
      !(
        key === "identityFile" ||
        key === "deathFiles" ||
        key === "identityRelationFiles" ||
        key === "entrustFiles"
      )
    ) {
      let obj = reactive([]);
      for (let item of arr) {
        let f = await commonTools
          .downloadYhFile({
            fileId: item.file_id,
            needThumb: 1,
          })
          .then((res) => res)
          .catch((err) => err);
        if (f.status === "success") {
          obj.push({
            fileUrl: f.data.data.url,
            picUrl: f.data.data.thumbnail_url,
            fileId: item.file_id,
            type: item.type,
          });
        }
      }
      caseForm[key] = obj;
    } else {
      caseForm[key] = res[key];
    }
  }
  if (!res.partyName) {
    caseForm.partyName = userStore.userInfo.name;
  }
  if (!res.partyIDNumber || caseStore.caseItem.type === TYPE_ONE) {
    caseForm.partyIDNumber =userStore.userInfo.starIdentityId
  }
  if (!res.partyPhone || caseStore.caseItem.type === TYPE_ONE) {
    caseForm.partyPhone = userStore.userInfo.starPhone;
  }
  if (!res.otherInputCash) {
    caseForm.otherInputCash = 0;
  }
  if (!res.otherWithdrawCash) {
    caseForm.otherWithdrawCash = 0;
  }
  if (caseStore.caseItem.type === TYPE_ONE) {
    caseForm.caseBh = caseStore.caseItem.caseBh;
  }

  return true;
};
const saveTemp = async () => {

  // console.log('saveTemp')
  if(timeout.value){
    clearTimeout(timeout.value)
  }
  timeout.value=setTimeout(() => {
      // caseForm.lossCash=(Number(caseForm.inputCash)+Number(caseForm.otherInputCash)-Number(caseForm.withdrawCash)-Number(caseForm.otherWithdrawCash)).toFixed(2);
      let data=Object.assign({},copyObj(caseForm));
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
      data.lossCash = data.lossCash + ""
      data.inputCash = data.inputCash + ""
      data.otherInputCash = data.otherInputCash + ""
      data.withdrawCash = data.withdrawCash + ""
      data.otherWithdrawCash = data.otherWithdrawCash + ""
      data.partyIDNumber = userStore.userInfo.identityId;
      data.partyPhone = userStore.userInfo.phone;
      data.caseBh = caseStore.caseItem.caseBh
      data.partyBh = data.partyBh || ""
      caseStore.setTempCase(data);
      caseStore.setCaseForm(caseForm);
      caseApi.stagingData({
        ...data
      })
  }, 1000);
};

const next = async () => {
  if (!caseForm.partyName) {
    showToast("请输入姓名");
    return;
  }
  if (caseForm.partyIDNumber.length !== 18) {
    showToast("请输入正确公民身份号码");
    return;
  }
  if (caseForm.partyPhone.length !== 11) {
    showToast("请输入正确手机号码");
    return;
  }
  if (!caseForm.partyAddress) {
    showToast("请输入实际居住地");
    return;
  }

  if (!caseForm.inputCash) {
    showToast("请输入投入现金");
    return;
  }
  if (caseForm.otherInputCash === "") {
    showToast("请输入其他形式投入金额");
    return;
  }
  if (caseForm.withdrawCash === "") {
    showToast("请输入提现金额");
    return;
  }
  if (caseForm.otherWithdrawCash === "") {
    showToast("请输入其他形式提取金额");
    return;
  }

  if (caseForm.IDNumberArray.length < 1) {
    showToast("请上传身份证正反面");
    return;
  }
  if (caseForm.IDNumberArray.length !== 2) {
    showToast("请上传身份证正反面2份");
    return;
  }
  if (caseForm.bankArray.length < 1) {
    showToast("请上传银行流水凭证");
    return;
  }



  caseForm.lossCash=(Number(caseForm.inputCash)+Number(caseForm.otherInputCash)-Number(caseForm.withdrawCash)-Number(caseForm.otherWithdrawCash)).toFixed(2);
  router.push({
      path: "/confirm",
      query: {
      },
    });
};
const editsave = async () => {
  saveTemp();
  if (!caseForm.partyName) {
    showToast("请输入姓名");
    return;
  }
  if (caseForm.partyIDNumber.length !== 18) {
    showToast("请输入正确公民身份号码");
    return;
  }
  if (caseForm.partyPhone.length !== 11) {
    showToast("请输入正确手机号码");
    return;
  }
  if (!caseForm.partyAddress) {
    showToast("请输入实际居住地");
    return;
  }

  if (!caseForm.inputCash) {
    showToast("请输入投入现金");
    return;
  }
  if (caseForm.otherInputCash === "") {
    showToast("请输入其他形式投入金额");
    return;
  }
  if (caseForm.withdrawCash === "") {
    showToast("请输入提现金额");
    return;
  }
  if (caseForm.otherWithdrawCash === "") {
    showToast("请输入其他形式提取金额");
    return;
  }

  if (caseForm.IDNumberArray.length < 1) {
    showToast("请上传身份证正反面");
    return;
  }
  if (caseForm.IDNumberArray.length !== 2) {
    showToast("请上传身份证正反面2份");
    return;
  }
  if (caseForm.bankArray.length < 1) {
    showToast("请上传银行流水凭证");
    return;
  }



  // caseForm.lossCash=(Number(caseForm.inputCash)+Number(caseForm.otherInputCash)-Number(caseForm.withdrawCash)-Number(caseForm.otherWithdrawCash)).toFixed(2);

  router.push({
      path: "/confirm",
      query: {
        inherit: caseStore.caseItem.inherit,
        type: "update",
      },
    });
};
const back = () => {
  saveTemp();
  commonApi.statistics({
    method: "dsrComfirm",
    dsrbh: caseForm.partyBh,
    fydm: caseStore.caseItem.fydm,
    ajbh: caseStore.caseItem.caseBh,
    date: formatDate(Date.now()),
  });
  if (caseStore.caseItem.type === TYPE_TWO) {
    router.push({
      path: "/confirm",
      query: {
        inherit: caseStore.caseItem.inherit,
        type: "update",
        confirm: 1,
      },
    });
  } else {
    pathStore.setRouterPath('case-list');
    router.go(-1);
  }
};
const backList = () => {
  pathStore.setRouterPath('case-list');
  router.go(-1);
};
const handleFileChange = (val, key) => {
  caseForm[key] = val;
};
const openEdit = () => {
  if (expired.value) {
    return;
  }
  backTop();
  edit.value = true;
  needEdit.value = true;
  nameEdit.value = true;
};
const cancel = () => {
  edit.value = false;
  needEdit.value = false;
  nameEdit.value = false;
};
const toRefund = () => {};
const backTop = () => {
  let top = containerRef.value.scrollTop; //获取点击时页面的滚动条纵坐标位置
  const timeTop = setInterval(() => {
    containerRef.value.scrollTop = top -= 50; //一次减50往上滑动
    if (top <= 0) {
      clearInterval(timeTop);
    }
  }, 10); //定时调用函数使其更顺滑
};
const handleInputChangeDigit = (value, key) => {
  let dat =
    ("" + value) // 第一步：转成字符串
      .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
      .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
      .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
  // 限制输入最大值为100
  // if (Number(dat) >= 100) {
  //         return;
  // }
  // this.dialogFromDate.requiredDuration=dat;

  caseForm[key] = dat;
};
watch(caseForm,(post,pre)=>{
  caseForm.lossCash=(Number(caseForm.inputCash)+Number(caseForm.otherInputCash)-Number(caseForm.withdrawCash)-Number(caseForm.otherWithdrawCash)).toFixed(2);
  saveTemp();
})
</script>

<style scoped lang="scss">
.ajxx-page {
  height: 100vh;
  position: relative;
  overflow-y: auto;
  background: $background;
  .container {
    height: calc(100% - 80px);
    overflow-y: auto;
    .tipsbox {
      margin: 16px 16px 0;
      display: flex;
      font-size: 12px;
      color: $text-color-placeholder;
      align-items: center;
      .resetbtn {
        color: $color-primary;
        font-size: 12px;
        box-sizing: border-box;
        margin-left: 15px;
      }
    }
    .title {
      color: $text-color-base;
      font-size: 16px;
      font-weight: bold;
      padding-top: 16px;
      padding-left: 16px;
    }
    .van-cell-group {
      margin-top: 16px;
    }
    .tips {
      margin-top: 5px;
      display: flex;
      color: $text-color-placeholder;
      font-size: 12px;
      padding-bottom: 10px;
      padding-left: 16px;
      .tip-box {
        flex: 1;
        margin-left: 4px;
        line-height: 18px;
      }
    }
    .m-cell {
      padding: 16px;
      font-size: 14px;
      position: relative;
      color: $text-color-base;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: var(--van-padding-md);
        bottom: 0;
        left: var(--van-padding-md);
        border-bottom: 1px solid var(--van-cell-border-color);
        transform: scaleY(0.5);
      }
      .m-title {
        margin-bottom: 10px;
      }
      .tip-box {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 10px;
        .tip-txt {
          margin-left: 4px;
          color: $text-color-placeholder;
        }
      }
      .required::before {
        content: "* ";
        color: var(--van-field-required-mark-color);
      }
      .file-content {
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