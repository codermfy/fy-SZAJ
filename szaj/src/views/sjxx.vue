<template>
  <div class="sjxx-page">
    <div class="container" ref="containerRef">
      <van-cell-group inset>
        <div class="title">{{ "案件信息" }}</div>
        <van-field
          v-model="caseStore.caseItem.caseName"
          label="案号"
          disabled
          placeholder="请输入"
          label-align="left"
        />
        <van-field
          v-model="caseStore.caseItem.caseAbbreviation"
          label="案件简称"
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
      <van-cell-group inset>
        <div class="title">{{ "登记信息" }}</div>
        <van-field
          label="姓名"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.partyName || caseForm.aduitPartyName }}
          </template>
        </van-field>
        <van-field
          label="公民身份号码"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditPartyIDNumber || caseForm.partyIDNumber }}
          </template>
        </van-field>
        <van-field
          label="手机号码"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            <span :class="caseForm.auditPartyPhone ? 'original' : ''">{{
              caseForm.auditPartyPhone || caseForm.partyPhone
            }}</span>
          </template>
        </van-field>
        <van-field
          label="实际居住地"
          disabled
          placeholder="请填写具体地址，例xx省xx市xx区(县)xx街道xx小区xx幢xx单元xx室"
          label-align="top"
          rows="2"
          autosize
          type="textarea"
        >
          <template #input>
            {{ caseForm.auditPartyAddress || caseForm.partyAddress }}
          </template>
        </van-field>
        <van-field
          label="是否在原数据库内"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.applyCaseType ? "否" : "是" }}
          </template>
        </van-field>
        <van-field
          label="投入总额（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditInputTotal ? 'original' : ''">{{
              caseForm.auditInputTotal || caseForm.inputTotal
            }}</span>
          </template>
        </van-field>
        <van-field
          label="投入现金（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditInputCash ? 'original' : ''">{{
              caseForm.auditInputCash || caseForm.inputCash
            }}</span>
          </template>
        </van-field>
        <van-field
          label="其他形式投入现金（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditOtherInputCash ? 'original' : ''">{{
              caseForm.auditOtherInputCash || caseForm.otherInputCash
            }}</span>
          </template>
        </van-field>
        <van-field
          label="提现金额（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditWithdrawCash ? 'original' : ''">{{
              caseForm.auditWithdrawCash || caseForm.withdrawCash
            }}</span>
          </template>
        </van-field>
        <van-field
          label="其他形式提现金额（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditOtherWithdrawCash ? 'original' : ''">{{
              caseForm.auditOtherWithdrawCash || caseForm.otherWithdrawCash
            }}</span>
          </template>
        </van-field>
        <van-field
          label="损失金额（人民币元）"
          disabled
          placeholder="请输入"
          label-align="top"
        >
          <template #input>
            <span :class="caseForm.auditLossCash ? 'original' : ''">{{
              caseForm.auditLossCash || caseForm.lossCash
            }}</span>
          </template>
        </van-field>
        <van-field
          label="备注"
          disabled
          placeholder="请输入"
          label-align="top"
          rows="2"
          autosize
          type="textarea"
        >
          <template #input>
            {{ caseForm.notes }}
          </template>
        </van-field>
        <van-field
          label="案件登记类型"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.applyCaseType }}
          </template>
        </van-field>
        <template
          v-if="caseForm.applyCaseType === '当事人姓名或证件号码已变更'"
        >
          <van-field
            label="当事人原姓名"
            disabled
            placeholder="请输入"
            label-align="left"
          >
            <template #input>
              {{ caseForm.originalName }}
            </template>
          </van-field>
          <van-field
            label="当事人原身份证号码"
            disabled
            placeholder="请输入"
            label-align="top"
          >
            <template #input>
              {{ caseForm.originalIDNumber }}
            </template>
          </van-field>
          <div class="m-cell">
            <div class="m-title">
              户口本身份信息变更登记页或派出所身份信息系变更证明
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.identityFile"
                @fileChange="handleFileChange($event, 'identityFile')"
              ></upload-com>
            </div>
          </div>
        </template>
        <template
          v-if="caseForm.applyCaseType === '原当事人死亡（以继承人名义登记）'|| caseForm.applyCaseType === '原当事人死亡（以继承人名义申报）'"
        >
          <van-field
            label="死亡当事人姓名"
            disabled
            placeholder="请输入"
            label-align="left"
          >
            <template #input>
              {{ caseForm.originalName }}
            </template>
          </van-field>
          <van-field
            label="死亡当事人证件号码"
            disabled
            placeholder="请输入"
            label-align="top"
          >
            <template #input>
              {{ caseForm.originalIDNumber }}
            </template>
          </van-field>
          <div class="m-cell">
            <div class="m-title">
              死亡证明
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.deathFiles"
                @fileChange="handleFileChange($event, 'deathFiles')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">
              有关部门出具的身份关系证明
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.identityRelationFiles"
                @fileChange="handleFileChange($event, 'identityRelationFiles')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">
              委托文书
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.entrustFiles"
                @fileChange="handleFileChange($event, 'entrustFiles')"
              ></upload-com>
            </div>
          </div>
        </template>
      </van-cell-group>
      <van-cell-group inset v-if="caseForm.auditpartyName">
        <div class="title">{{ "审计信息" }}</div>
        <van-field
          label="当事人姓名"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditpartyName  }}
          </template>
        </van-field>
        <van-field
          label="当事人身份号码"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditPartyIDNumber  }}
          </template>
        </van-field>
        <van-field
          label="确认投入现金"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditInputCash  }}
          </template>
        </van-field>
        <van-field
          label="确认提现金额"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditWithdrawCash  }}
          </template>
        </van-field>
        <van-field
          label="确认损失金额"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditLossCash  }}
          </template>
        </van-field>
        <van-field
          label="审计是否通过"
          disabled
          placeholder="请输入"
          label-align="left"
        >
          <template #input>
            {{ caseForm.auditResult  }}
          </template>
        </van-field>
        <van-field
          label="不通过/部分通过的原因"
          disabled
          placeholder="请输入"
          label-align="top"
          rows="2"
          autosize
          type="textarea"
        >
          <template #input>
            {{ caseForm.auditFailReason }}
          </template>
        </van-field>
        </van-cell-group>
        <van-cell-group inset >
          <div class="title">{{ "证据材料" }}</div>
          <div class="m-cell">
            <div class="m-title">
              身份证正反面
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.IDNumberArray"
                @fileChange="handleFileChange($event, 'IDNumberArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">
              银行流水凭证
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.bankArray"
                @fileChange="handleFileChange($event, 'bankArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">
              合同及其他证明材料
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.contractArray"
                @fileChange="handleFileChange($event, 'contractArray')"
              ></upload-com>
            </div>
          </div>
          <div class="m-cell">
            <div class="m-title">
              其他证明材料
            </div>
            <div class="file-content">
              <upload-com
                :isEdit="false"
                :uploadFileList="caseForm.materialArray"
                @fileChange="handleFileChange($event, 'materialArray')"
              ></upload-com>
            </div>
          </div>
        </van-cell-group>
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
const pathStore = usePathStore();

const containerRef = ref(null);
const caseForm: any = reactive({});
onMounted(() => {
  getAuditDetails();
});
const getAuditDetails = async () => {
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "加载中……",
  });
  let res = await caseApi.getAuditDetails({
    caseBh: caseStore.caseItem.caseBh,
    registerBh: caseStore.sjItem.partyBh,
  });
  if (!res) {
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
        key === "entrustFiles"||
        key === "IDNumberArray"||
        key === "bankArray"||
        key === "contractArray"||
        key === "materialArray"
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
};
const handleFileChange = (val, key) => {
  caseForm[key] = val;
};
</script>

<style scoped lang="scss">
.sjxx-page {
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
      color: $text-color-placeholder;
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
    .original {
      color: $color-warning;
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