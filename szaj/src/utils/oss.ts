import { http } from "@/utils/request";
import { generateUUID } from "./baseTool";
import "./cos-auth.min";
import axios from "axios";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const STATUS = {
  // 成功
  STATUS_SUCCESS: "success",
  // 200
  STATUS_200: 200,
  // 201
  STATUS_201: 201,
  // 0
  STATUS_0: 0,
  // 1
  STATUS_1: 1,
  // 1005
  STATUS_1005: 1005,
  // 403
  STATUS_403: 403,
  // 406
  STATUS_406: 406,
  // 100
  STATUS_100: 100,
  // 421
  STATUS_421: 421,
  // 1000
  STATUS_1000: 1000,
  //  4002
  STATUS_4002: 4002,
  // 204
  STATUS_204: 204,
  // 450
  STATUS_450: 450,
  // 400
  STATUS_400: 400,
  // 1007
  STATUS_1007: 1007,
  //500
  STATUS_500: 500,
  // -1
  STATUS_DEC1: -1,
  //终本约谈判断是否需要报错工单
  STATUS_RMFY300917: "RMFY300917",
  //终本约谈判断是否需要报错工单
  STATUS_MFY300207: "RMFY300207",
  //10001
  STATUS_10001: 10001,
};
const FILE_FORMAT_LIMIT = [
  "mp4",
  "mov",
  "avi",
  "jpg",
  "jpeg",
  "png",
  "tif",
  "pdf",
  "doc",
  "docx",
  "mp3",
  "wav",
  "m4a",
  "amr",
];
const CLOUD_TYPE = {
  COS: "cos",
  OBS: "obs",
  OOS: "oos",
  OSS: "oss",
};
export async function cosUpload({ moduleCode = "", caseNo = "" }) {
  try{
    let res = await http.requestOrigin({
      url: "/rmfyzxfw-uploadfile/api/v3/s3UploadToken",
      method: "get",
      baseURL: `${import.meta.env.VITE_APP_APIHOST_ROOT}`,
      params: {
        code: moduleCode,
      },
      header: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    // res = res.data;
    // console.log(res,'111')
    if (parseInt(res?.code) !== STATUS.STATUS_200 || !res?.data) {
      showToast(`获取上传信息失败，请稍后再试！`);
      return false;
    }
    return res.data;
  }catch(error){
    console.error('Failed to upload file:', error);
      return false;
  }

}

export async function cosUploadFiles(
  fileList,
  moduleCode = "wjsc",
  step = "",
  upDatabase = true,
  needThumb = true
) {
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "正在上传……",
  });
  let res = await cosUpload({ moduleCode });
  if (!res?.objectStorage) {
    closeToast();
    return;
  }
  let param = [];
  let headersInfo = new Map(); // 头部信息
  let fileKeys = []; // 上传文件的objectName
  let formatFlag = true; // 文件格式是否支持上传
  for (const item of fileList) {
    if (item.tempFilePath) {
      let fileSuffix = item.suffix;
      if (!FILE_FORMAT_LIMIT.includes(fileSuffix.toLocaleLowerCase())) {
        showToast(`该文件格式不支持上传`);
        formatFlag = false;
        break;
      }
      let uuid = generateUUID();
      let objName = `${uuid}.${item.suffix}`;
      let fileName = item.fileName || objName;
      let upRes;

      if (
        !res.objectStorage ||
        res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.COS
      ) {
        upRes = await cosWxUpload({
          objName,
          tempFilePath: item.tempFilePath,
          res,
          largeFile: false,
        });
        res.objectStorage = CLOUD_TYPE.COS;
      } else if (
        res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.OBS ||
        res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.OOS
      ) {
        upRes = await obsWxUpload({
          objName,
          tempFilePath: item.tempFilePath,
          res,
          largeFile: false,
        });
      } else if (res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.OSS) {
        res.objectStorage = CLOUD_TYPE.OSS;
      }
      if (!upRes?.key) {
        closeToast();
        showToast(`文件上传失败，请稍后再试！`);
        break;
      }
      fileKeys.push({ key: upRes.key });
    }
  }
  if (!formatFlag) {
    return;
  }
  // 不上传数据库，直接返回objectName数组
  if (!upDatabase) {
    closeToast();
    return fileKeys;
  }
  closeToast();
}
async function cosWxUpload({ objName, tempFilePath, res, largeFile }) {
  try{
    return new Promise((resolve) => {
      const key = res.dir + objName;
      const Authorization = window.CosAuth({
        SecretId: res.credentials.tmpSecretId,
        SecretKey: res.credentials.tmpSecretKey,
        Method: "POST",
        Pathname: "/",
        StartTime: res.expiredTime,
        ExpiredTime: res.startTime,
      });
      const fd = new FormData();
      fd.append("key", key);
      fd.append("signature", Authorization);
      // fd.append('Content-Type', '');
      fd.append("x-cos-security-token", res.credentials.sessionToken);
      fd.append("file", tempFilePath);
      axios
        .post(res.host, fd)
        .then((response) => {
          if (
            response.status === STATUS.STATUS_200 ||
            response.status === STATUS.STATUS_204
          ) {
            resolve({ key });
          }
          resolve();
        })
        .catch((err) => {
          resolve();
        });
    });
  }catch(error){
    return null
  }
 
}
async function obsWxUpload({ objName, tempFilePath, res, largeFile }) {
  try{
    return new Promise((resolve) => {
      const key = res.dir + objName;
  
      const fd = new FormData();
      fd.append("key", key);
      fd.append("bucket", res.fields.bucket);
      fd.append("X-Amz-Algorithm", res.fields["X-Amz-Algorithm"]);
      fd.append("X-Amz-Credential", res.fields["X-Amz-Credential"]);
      fd.append("X-Amz-Date", res.fields["X-Amz-Date"]);
      fd.append("Policy", res.fields.Policy);
      fd.append("X-Amz-Signature", res.fields["X-Amz-Signature"]);
      fd.append("X-Amz-Security-Token", res.fields["X-Amz-Security-Token"] || "");
      fd.append("file", tempFilePath);
      axios
        .post(res.host, fd)
        .then((response) => {
          if (
            response.status === STATUS.STATUS_200 ||
            response.status === STATUS.STATUS_204
          ) {
            resolve({ key });
          }
          resolve();
        })
        .catch((err) => {
          resolve();
        });
    });
  }catch(error){
    return null
  }
  
}
export async function fileToPdf({
  files,
  moduleCode = "wjsc",
  customName,
  caseinfo = {},
  otherParams = {},
  needThumb = false,
}) {
  //   showLoadingToast({
  //     duration: 0,
  //     forbidClick: true,
  //     message: "文件转换中",
  //   });
  //   let caseInfo ={};
  //   let userInfo =
  //   // app.globalData.common.userInfo ||
  //    {};
  //   let param = {
  //     files: files,
  //     code: moduleCode,
  //     cert_no: '799053e6b2eb0db09818a5660a3c0677d77c5635797283b6eb03d5151430658d'||userInfo.identityIdEnc,
  //     caseId:  '',
  //     courtId:  '',
  //     caseNo:  '',
  //     step:  '',
  //     needThumb: Number(needThumb)
  //   }
  //   if (customName) {
  //     param.customName = customName
  //   }
  //    // 先转pdf
  //   let pdfRes = await http.requestOrigin({
  //     url: "/rmfyzxfw-uploadfile/api/v3/toPDF",
  //     method: "post",
  //     baseURL: `${import.meta.env.VITE_APP_APIHOST_ROOT}`,
  //     data: param,
  //     header: {
  //       "X-Requested-With": "XMLHttpRequest",
  //       "Content-Type": "application/json; charset=UTF-8",
  //     },
  //   });
  //   pdfRes = pdfRes.data;
  //   if (parseInt(pdfRes?.code) !== STATUS.STATUS_200 || !pdfRes?.data) {
  //     closeToast();
  //     showToast(`文件转换失败，请稍后再试`);
  //     return false;
  //   }
  //   pdfRes.data.category = 'file';
  //   closeToast();
  //   return { ...pdfRes.data }
}
export async function cosUploadFile(
  { tempFilePath, fileName, suffix = "", needThumb = true },
  moduleCode = "wjsc",
  step = "",
  upDatabase = true,
  largeFile = false
) {
  let fileSuffix = suffix;
  if (!FILE_FORMAT_LIMIT.includes(fileSuffix.toLocaleLowerCase())) {
    showToast(`该文件格式不支持上传`);
    return;
  }
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "正在上传……",
  });
  let res = await cosUpload({ moduleCode });
  if (!res?.objectStorage) {
    // closeToast();
    return;
  }
  let uuid = generateUUID();
  let objName = `${uuid}.${suffix}`;
  fileName = fileName || objName;
  let upRes;

  if (
    !res.objectStorage ||
    res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.COS
  ) {
    upRes = await cosWxUpload({ objName, tempFilePath, res, largeFile: false });
    res.objectStorage = CLOUD_TYPE.COS;
  } else if (res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.OBS) {
    upRes = await obsWxUpload({ objName, tempFilePath, res, largeFile: false });
  } else if (res.objectStorage.toLocaleLowerCase() === CLOUD_TYPE.OSS) {
    // res.objectStorage = CLOUD_TYPE.OSS;
  }
  if (!upRes?.key) {
    closeToast();
    showToast(`文件上传失败，请稍后再试！`);
    return;
  }
  if (!upDatabase) {
    closeToast();
    return upRes;
  }
  let param = [
    {
      caseNo: "",
      caseId: "",
      object_name: upRes.key, //对象名称
      file_name: fileName, //文件名
      isLargeFile: largeFile,
    },
  ];
  if (largeFile) {
    closeToast();
  }
  showLoadingToast({
    duration: 30000,
    forbidClick: true,
    message: "正在请求……",
  });
  let upDataRes = await uploadFileData({
    moduleCode,
    files: param,
    needThumb,
  });
  if (!upDataRes?.length) {
    // closeToast();
    return;
  }
  let item = upDataRes[0];
  let format = getFilemat(getFile(item.url).wjgs);
  closeToast();
  return {
    fileUrl: item.url,
    fileId: item.file_id,
    fileName: item.file_name,
    objectName: item.object_name,
    category: format.format || "",
    picUrl: item.picUrl || "",
    isLargeFile: item.isLargeFile || largeFile || false,
  };
}
async function uploadFileData({
  moduleCode = "",
  files = [],
  needThumb = false,
}) {
  // let userInfo = app.globalData.common.userInfo || {};  // 用户信息
  // let caseInfo = wx.getStorageSync("caseInfo") || {};  // 案件信息
  // let caseNo = caseInfo.caseNo || '';
  try{

  
  let saveRes = await http.requestOrigin({
    url: "/rmfyzxfw-uploadfile/api/v3/obtainFileId",
    method: "post",
    baseURL: `${import.meta.env.VITE_APP_APIHOST_ROOT}`,
    data: {
      code: moduleCode,
      cert_no:userStore.userInfo.identityId,
      // ||userInfo.identityIdEnc,
      files,
      needThumb: Number(needThumb),
    },
    header: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  // saveRes = saveRes.data;
  if (
    parseInt(saveRes?.code) !== STATUS.STATUS_200 ||
    !saveRes?.data ||
    !saveRes?.data?.length
  ) {
    showToast(`文件存储失败，请稍后再试！`);

    return false;
  }
  return saveRes.data;
}catch(error){
  return false
}
}
function getFile(param) {
  param = param || "";
  let path = param.split("?")[0] || "";
  let pathArr = path.split("/");
  path = pathArr[pathArr.length - 1];
  let suffix = "",
    fileName = "";
  if (path.indexOf(".") > -1) {
    let hzmArr = path.split(".");
    suffix = hzmArr[hzmArr.length - 1];
    fileName = hzmArr[hzmArr.length - 2] + "." + suffix;
  }
  suffix = suffix.toLocaleLowerCase();
  return { wjgs: suffix, wjmc: fileName };
}
// 文件类型
const FILEMAT = {
  FILE: "file",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  UNKNOWN: "unknown",
};
/**
 * 功能说明：根据文件后缀名判断文件类型
 * 责任公司：岩火
 * 开发人员：陈雯奇
 * 更新时间：2024/01/17
 * @param { String } wjgs 文件后缀名
 * @return { Object } { wjgs: 文件后缀名, format: 文件类型 }
 */
function getFilemat(wjgs) {
  wjgs = wjgs.toLowerCase();
  const FILE_FORMAT = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
  const IMAGE_FORMAT = ["png", "jpg", "jpeg", "bmp", "gif"];
  const VIDEO_FORMAT = [
    "mp4",
    "avi",
    "mpeg",
    "baiavi",
    "navi",
    "asf",
    "mov",
    "3gp",
    "wmv",
    "divx",
    "xvid",
    "rm",
    "rmvb",
    "flv",
    "f4v",
  ];
  const AUDIO_FORMAT = ["mp3", "wma", "wav", "m4a", "flac", "amr"];
  if (FILE_FORMAT.indexOf(wjgs) > -1) {
    return {
      wjgs,
      format: FILEMAT.FILE,
    };
  } else if (IMAGE_FORMAT.indexOf(wjgs) > -1) {
    return {
      wjgs,
      format: FILEMAT.IMAGE,
    };
  } else if (VIDEO_FORMAT.indexOf(wjgs) > -1) {
    return {
      wjgs,
      format: FILEMAT.VIDEO,
    };
  } else if (AUDIO_FORMAT.indexOf(wjgs) > -1) {
    return {
      wjgs,
      format: FILEMAT.AUDIO,
    };
  } else {
    return {
      wjgs,
      format: FILEMAT.UNKNOWN,
    };
  }
}
