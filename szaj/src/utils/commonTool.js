// const crypto = require('./crypto.js');
// const util = require('./util')
// const log = require("./log");
import { http } from "@/utils/request";
// //正则
// let regs = {
//   moneyReg: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}|[0])))$/, // 金额正则
//   bdMoneyReg: /^(([1-9][0-9]{0,13})|(([0]\.\d{1,2}|[1-9][0-9]{0,13}\.\d{1,2}|[0])))$/, // 申请标的
//   zxbdMoneyReg: /^(([1-9][0-9]{0,15})|(([0]\.\d{1,2}|[1-9][0-9]{0,15}\.\d{1,2}|[0])))$/, // 申请标的
//   llbjMoneyReg: /^(([1-9][0-9]{0,13})|(([0]\.\d{1,2}|[1-9][0-9]{0,13}\.\d{1,2}|[0])))$/, // 利息计算器本金
//   llMoneyReg: /^(([1-9][0-9]{0,1}|100)|([0]\.\d{1,2}|[1-9][0-9]{0,1}\.\d{1,2}|[0]))$/, // 利息计算器 利率
//   numberReg: /^(\d?)+(\.\d{0,2})?$/,//数字正则
//   intReg: /^[1-9]\d*$/,//大于0正整数
//   bfMoneyReg: /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$/, // 大于0百分比
//   numberIntReg: /^\d+$/,//纯正整数数字正则
//   regEmail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 邮箱正则
//   regMobile: /^1\d{10}$/, // 手机号正则
//   regGddh1: /^\d{3,4}-\d{7,8}$|^\d{3,4}\d{7,8}$|^\d{7,8}$/, // 固定电话正则1
//   regSfz: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证证件号码正则
//   regYzbm: /^[1-9][0-9]{5}$/, // 邮政编码正则
//   regGddh: /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/, // 验证座机号码
//   phoneAndTelReg: /^((0\d{2,3}-[123456789]\d{4,7})(-\d{1,4})?|(1\d{10}))$/,//固定电话兼容分机号或手机号正则
//   tszfKgReg: /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g,//特殊字符及空格
//   regBase64: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/, // base64正则
//   ahReg: /^(（[1-9]\d{3}）|\([1-9]\d{3}\))[\u4e00-\u9fff]\d*[\u4e00-\u9fff]+\d+号$/,//案号正则
//   regShxydm: /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/, // 统一社会信用代码
//   xmReg: /^[\u4e00-\u9fa5•·A-Za-z\s]*$/,
//   timeReg:/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))) ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, //时间格式 2023-12-11 20:20:20
//   shtyshxydm: /^[ABCDEFGHJKLMNPQRTUWXY0-9]{18}$/, // 统一社会信用代码 同审判
//   zzjgdm: /^[A-Z0-9]{9}$/, //组织机构代码 同审判
//   r_y_nllReg: /^(([1-9][0-9]{0,3})|([0]\.\d{0,2})|([1-9][0-9]{0,3}\.\d{0,2}|[0]))$/, //利率转换
// }
// /**
//  * 功能说明：接口请求返回状态码
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  */
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
  STATUS_10001: 10001
}
// yh提供的厂商标识，用于接口鉴权及区分厂商
let yhCofig = { appcode: 'GeqX5acaH3fW5vfxHt6ji0rjJuiwT1vo' };
/**
 * 功能说明：根据文件fileid下载岩火文件
 * 责任公司：岩火
 * 开发人员：陈雯奇
 * 更新时间：2024/01/09
 * @param { Object } { needThumb: 1, fileId: 'xxx' } | needThumb：是否需要返回缩略图（1：是，0：否），fileid：文件Id
 * @return { Object } 文件信息
 */
export function downloadYhFile(param) {
  let needThumb = typeof (param.needThumb) === 'undefined' ? 0 : param.needThumb;
  return new Promise((resolve, reject) => {
    http.requestOrigin(
      {
      url: '/rmfyzxfw-uploadfile/api/v3/getFile',
      method: 'get',
      baseURL:`${import.meta.env.VITE_APP_APIHOST_ROOT}`,
      params: {
        "file_id": param.fileId,
        "needThumb": needThumb
      },
      header: {
        appCode: yhCofig.appcode,
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  ).then(res => {
    // res=res.data
      const resCode = parseInt(res?.code);
      if (resCode === 500) {
        showToast({
          message: res.message || '请求失败，请稍后再试',
          duration: 2000
        })
        reject({ status: 'fail', data: res, param });
      } else if (resCode === STATUS.STATUS_200) {
        if (res.data.url.indexOf('../') === -1 || res.data.thumbnail_url.indexOf('/..') === -1) {
          if (param.code) {
            param[param.code] = res.data.url
          } else {
            param["wjdz"] = res.data.url
          }
        } else {
          param[param.code] = ""
          param["wjdz"] = ""
          res.data.url = ""
          res.data.thumbnail_url = ""
          showDialog({
            title: '温馨提示',
            message: '文件路径存在非法内容！！！',
            showCancelButton: false,
          })
        }
        resolve({ status: 'success', data: res, param });
      } else {
        reject({ status: 'fail', data: res, param });
      }
    }).catch(err => {
      reject({ status: 'fail', data: err, param });
    })
  })
}
// /**
//  * 功能说明：下载文件到本地并返回本地文件路径
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/09
//  * @param { String } url 文件Url
//  * @return { String } 本地文件路径
//  */
// async function downloadFileStream(url) {
//   let app = getApp();
//   return new Promise(resolve => {
//     wx.downloadFile({
//       url: encodeURI(url),
//       header: {
//         'Content-Type': 'application/pdf',
//         'Cookie': 'temp_token_auth=' + app.globalData.temp_token_auth,
//         "userid": wx.getStorageSync("uid"),
//         "openid": app.globalData.openId,
//         'miniprogramcheck': 'true',
//         'Authorization': app.globalData.common.token,
//         'user-id': app.globalData["user-id"],
//         'gyid': app.globalData.common.baseFydm,
//         'current-role': app.globalData.common.targetRole
//       },
//       success: function (res) {
//         let filePath = res.tempFilePath;
//         resolve(filePath)
//       },
//       fail: function (res) {
//         resolve()
//       }
//     })
//   })
// }
// /**
//  * 功能说明：通过身份证号获取性别，年龄，出生日期
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param { String } idCard 身份证号
//  */
// function getDataBySfzh(idCard) {
//   let birthday = '';
//   let sex = '';
//   let age = '';
//   if (checkzjh(idCard)) {
//     birthday = idCard.substr(6, 4) + '-' + idCard.substr(10, 2) + '-' + idCard.substr(12, 2);
//     if (parseInt(idCard.substr(16, 1)) % 2 === 1) {
//       //男
//       sex = 1;
//     } else {
//       //女
//       sex = 2;
//     }
//     let myDate = new Date();
//     let month = myDate.getMonth() + 1;
//     let day = myDate.getDate();
//     age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
//     let flageId= idCard.substring(10, 12) < month || idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day
//     if (flageId) {
//       age++;
//     }
//   }
//   return {
//     birthday,
//     sex,
//     age
//   }
// }
// /**
//  * 功能说明：生成UUID
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  */
// function getUUID() {
//   let d = new Date().getTime();
//   let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     let r = (d + Math.random() * 16) % 16 | 0;
//     d = Math.floor(d / 16);
//     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
//   let uuidString = uuid.replace(/-/g, "");
//   return uuidString;
// }

// /**
//  * 功能说明：判断本地缓存文件是否超过5个,超过则清空本地文件缓存
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/09
//  * @param { Null }
//  * @return { Null }
//  */
// function clearFile() {
//   const fs = wx.getFileSystemManager();
//   fs.readdir({
//     dirPath: wx.env.USER_DATA_PATH,
//     success(res) {
//       let { files } = res;
//       if (files.length >= 5) {
//         for (let i = 0; i < files.length; i++) {
//           if (files[i] !== 'miniprogramLog') {
//             fs.unlink({
//               filePath: `${wx.env.USER_DATA_PATH}/${files[i]}`,
//             })
//           }
//         }
//       }
//     },
//     fail(res) {
//       console.error(res)
//     }
//   })
// }
// // 解析URL中的参数
// function getUrlParams(url) {
//   if (url.indexOf("?") != '-1') {
//     url = url.split('?')[1]
//   }
//   const arr = url.split('&');
//   let obj = {};
//   for (let item of arr) {
//     let temp = item.split('=');
//     if (temp[0]) {
//       if (temp[0] == 'r') {
//         temp[0] = 'range';
//       }
//       if (temp[0] == 'p') {
//         temp[0] = 'position';
//       }
//       if (temp[0] == 't') {
//         temp[0] = 'type';
//       }
//       let key = temp[0].trim();
//       let val = temp[1] ? temp[1].trim() : "";
//       obj[key] = val;
//     }
//   }
//   return obj;
// };

// /**
//  * 功能说明：调用微信API进行人脸识别
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/09
//  * @param { Object } { name: '张三', identityId: 'xxxxxxxxxxx' } 被识别者的用户信息，非必传，不传时默认为当前登录用户
//  * @return { Boolean } 识别结果
//  */
// async function faceRecognition(userInfo = {}) {
//   let app = getApp();
//   let currentUserInfo = await app.getCurrentUserInfo();
//   if (!currentUserInfo?.data?.identityId) {
//     return
//   }
//   let name = userInfo.name || currentUserInfo.data.userName;
//   let idCardNumber = userInfo.identityId || currentUserInfo.data.identityId;
//   return new Promise((resolve) => {
//     wx.checkIsSupportFacialRecognition({
//       complete: res => {
//         if (res.errMsg === "checkIsSupportFacialRecognition:ok") {
//           wx.startFacialRecognitionVerify({
//             name,
//             idCardNumber,
//             checkAliveType: 2,
//             success() {
//               resolve(true)
//             },
//             fail() {
//               wx.showModal({
//                 title: '提示',
//                 content: '人脸识别失败，请重试',
//                 confirmColor: '#aa2b24',
//                 showCancel: false,
//                 success: function (res) {
//                   if (res.confirm) {
//                     resolve(false)
//                   }
//                 }
//               })
//             }
//           })
//         } else {
//           wx.showModal({
//             title: '提示',
//             content: '您的设备暂不支持人脸识别',
//             confirmColor: '#aa2b24',
//             showCancel: false,
//             success: function (res) {
//               if (res.confirm) {
//                 resolve(false)
//               }
//             }
//           })
//         }
//       }
//     })
//   })
// }
// /**
//  * 功能说明：防多点
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {Function} fn 回调函数
//  * @param {String} gapTime 间隔时间
//  */
// function throttle(fn, gapTime) {
//   if (gapTime === null || gapTime === undefined) {
//     gapTime = 1500
//   }
//   let _lastTime = null
//   // 返回新的函数
//   return function () {
//     let _nowTime = +new Date()
//     if (_nowTime - _lastTime > gapTime || !_lastTime) {
//       fn.apply(this, arguments) //将this和参数传给原函数
//       _lastTime = _nowTime
//     }
//   }
// }
// /**
//  * 功能说明：补零
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  */
// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : `0${n}`
// }
// /**
//  * 功能说明：日期数据转化
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} number 时间戳
//  * @param {String} format 日期格式
//  */
// function formatTime2(number = Date.now(), format = 'Y-M-D h:m:s') {
//   let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
//   let returnArr = [];
//   let timeStamp = number;
//   let timeStampLen = number.toString().length
//   // 获取到的时间戳存在少一位 问题兼容
//   if (number.toString().indexOf('.') != -1) {
//     if (timeStampLen >= 10 && timeStampLen <= 14) {
//       timeStamp = number * 1000
//     }
//   } else {
//     if (timeStampLen === 10 || timeStampLen === 14) {
//       timeStamp = number * 1000
//     }
//   }
//   let date = new Date(timeStamp);
//   returnArr.push(date.getFullYear());
//   returnArr.push(formatNumber(date.getMonth() + 1));
//   returnArr.push(formatNumber(date.getDate()));
//   returnArr.push(formatNumber(date.getHours()));
//   returnArr.push(formatNumber(date.getMinutes()));
//   returnArr.push(formatNumber(date.getSeconds()));
//   for (let i in returnArr) {
//     format = format.replace(formateArr[i], returnArr[i]);
//   }
//   return format;
// }
// /**
//  * 功能说明：格式化时间8位至年月日开始
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} dateString 日期
//  * @param {String} seperator 年月日
//  */
// function getFormatDate(dateString, seperator) {
//   if (!dateString || dateString === "") {
//     return '';
//   }
//   let date = '-';
//   let year = seperator ? seperator : '年';
//   let month = seperator ? seperator : '月';
//   let day = seperator ? "" : '日';
//   if (dateString.indexOf("年") > -1 && dateString.indexOf("月") > -1 && dateString.indexOf("日") > -1) { //若是含有年月日的 例2021年07月20日,重组，重新赋值
//     dateString = dateString.replace('年', "-").replace('月', "-").replace('日', "");
//   }
//   if (dateString.indexOf("/") > -1) { //若是含有/的 例2021/07/20
//     let strArr = dateString.split("/");
//     date = strArr[0] + year + formatNumber(strArr[1]) + month + formatNumber(strArr[2]) + day;
//   } else if (dateString.indexOf("-") > -1) { //若是含有-的 例2021-07-20
//     let strArr = dateString.split("-");
//     date = strArr[0] + year + formatNumber(strArr[1]) + month + formatNumber(strArr[2]) + day;
//   } else if (dateString.length === 8) { //8位 例20210710
//     date = dateString.slice(0, 4) + year + dateString.slice(4, 6) + month + dateString.slice(6, 8) + day;
//   } else if (dateString.length === 17) { //17位 例20210710 14:27:21
//     date = dateString.slice(0, 4) + year + dateString.slice(4, 6) + month + dateString.slice(6, 8) + day;
//   } else if (dateString.length === 19) { //19位 例2021/07/10 14:27:21
//     date = dateString.slice(0, 4) + year + dateString.slice(5, 7) + month + dateString.slice(8, 10) + day;
//   } else if (dateString.length > 8) { //日期小于8位，则为非法日期,返回-
//     date = dateString;
//   }
//   return date;
// }
// /**
//  * 功能说明：获取时间（近7天、1个月、3个月，一个月后。。。）
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} dateNow 当前日期
//  * @param {Number} intervalDays 日期间隔
//  * @param {Boolean} isPastTime 当前日期前/后
//  */
// function getDateRange(dateNow, intervalDays, isPastTime) {
//   let list = [];
//   let lastDay;
//   let oneDayTime = 60 * 60 * 1000 * 24;
//   if (isPastTime) {
//     lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
//     list.push(formatDate(dateNow));
//     list.push(formatDate(lastDay));
//   } else {
//     lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
//     list.push(formatDate(dateNow));
//     list.push(formatDate(lastDay));
//   }
//   return list;
// }
// /**
//  * 功能说明：获取时间
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} time 
//  */
// function formatDate(time) {
//   let year = time.getFullYear();
//   let month = time.getMonth() + 1;
//   let day = time.getDate();
//   if (month < 10) {
//     month = '0' + month;
//   }
//   if (day < 10) {
//     day = '0' + day;
//   }
//   return year + '-' + month + '-' + day;
// }

// /**
//  * 功能说明：根据文件路径获取文件名称和后缀名
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/17
//  * @param { String } param 文件路径
//  * @return { Object } { wjgs: 文件后缀, wjmc: 文件名称 }
//  */
// function getFile(param) {
//   param = param || '';
//   let path = param.split("?")[0] || '';
//   let pathArr = path.split('/');
//   path = pathArr[pathArr.length - 1];
//   let suffix = '', fileName = '';
//   if (path.indexOf('.') > -1) {
//     let hzmArr = path.split('.');
//     suffix = hzmArr[hzmArr.length - 1];
//     fileName = hzmArr[hzmArr.length - 2] + '.' + suffix;
//   }
//   suffix = suffix.toLocaleLowerCase();
//   return ({ wjgs: suffix, wjmc: fileName });
// };
// // 文件类型
// const FILEMAT = {
//   FILE: 'file',
//   IMAGE: 'image',
//   VIDEO: 'video',
//   AUDIO: 'audio',
//   UNKNOWN: 'unknown'
// }
// /**
//  * 功能说明：根据文件后缀名判断文件类型
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/17
//  * @param { String } wjgs 文件后缀名
//  * @return { Object } { wjgs: 文件后缀名, format: 文件类型 }
//  */
// function getFilemat(wjgs) {
//   wjgs = wjgs.toLowerCase();
//   const FILE_FORMAT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
//   const IMAGE_FORMAT = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
//   const VIDEO_FORMAT = ['mp4', 'avi', 'mpeg', 'baiavi', 'navi', 'asf', 'mov', '3gp', 'wmv', 'divx', 'xvid', 'rm', 'rmvb', 'flv', 'f4v'];
//   const AUDIO_FORMAT = ['mp3', 'wma', 'wav', 'm4a', 'flac', 'amr'];
//   if (FILE_FORMAT.indexOf(wjgs) > -1) {
//     return {
//       wjgs,
//       format: FILEMAT.FILE
//     };
//   } else if (IMAGE_FORMAT.indexOf(wjgs) > -1) {
//     return {
//       wjgs,
//       format: FILEMAT.IMAGE
//     };
//   } else if (VIDEO_FORMAT.indexOf(wjgs) > -1) {
//     return {
//       wjgs,
//       format: FILEMAT.VIDEO
//     };
//   } else if (AUDIO_FORMAT.indexOf(wjgs) > -1) {
//     return {
//       wjgs,
//       format: FILEMAT.AUDIO
//     };
//   } else {
//     return {
//       wjgs,
//       format: FILEMAT.UNKNOWN
//     };
//   }
// }
// /**
//  * 功能说明：下载并打开文件
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/09
//  * @param { Object } { path: '', wjgs: '', picArr: '', isShowMenu: '', openNow: '' } | isShowMenu：是否显示右上角菜单
//  * @return { Boolean } 预览结果
//  */
// function downloadFile(argu) {
//   let app = getApp();
//   argu = argu || {};
//   let { path = '', wjgs = '', picArr = [], isShowMenu = false } = argu;
//   wjgs = wjgs.toLowerCase();
//   let fileName = getUUID() + '.' + wjgs; // 生成文件名
//   let filemat = getFilemat(wjgs).format;
//   return new Promise((resolve, reject) => {
//     if (filemat === FILEMAT.FILE) {
//       if ((path.indexOf('http:') > -1 || (path.indexOf('https:') > -1)) && !argu.openNow) {
//         wx.showLoading({
//           title: '下载中',
//         });
//         clearFile();
//         wx.downloadFile({
//           url: path,
//           header: {
//             'Authorization': app.globalData.common.token,
//             'user-id': app.globalData['user-id'],
//             'gyid': app.globalData.common.baseFydm,
//             'current-role': app.globalData.common.targetRole,
//             'openid': app.globalData.openId
//           },
//           filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
//           success: function (res) {
//             if (parseInt(res.statusCode) === STATUS.STATUS_200) {
//               const filePath = res.filePath;
//               wx.openDocument({
//                 filePath: filePath,
//                 fileType: wjgs,
//                 showMenu: isShowMenu,
//                 success: function (res) {
//                   wx.hideLoading()
//                   resolve({
//                     status: "success",
//                     wjgs,
//                     filemat,
//                     filePath
//                   });
//                 },
//                 fail: function (err) {
//                   const systemInfo = wx.getSystemInfoSync();
//                   wx.hideLoading()
//                   if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
//                     wx.previewImage({
//                       urls: [filePath],
//                       current: filePath,
//                       fail() {
//                         wx.showModal({
//                           title: '温馨提示',
//                           content: 'PC端暂不支持PDF预览',
//                           showCancel: false,
//                           confirmColor: "#aa2b24",
//                         });
//                       }
//                     })
//                   } else {
//                     wx.showModal({
//                       title: '温馨提示',
//                       content: '文档打开失败，请稍后再试',
//                       showCancel: false,
//                       confirmColor: "#aa2b24",
//                     });
//                   }
//                   resolve({
//                     status: "fail",
//                     wjgs,
//                     filemat
//                   });
//                 }
//               })
//             } else {
//               wx.hideLoading()
//               resolve({
//                 status: "fail",
//                 wjgs,
//                 filemat
//               });
//             }
//           },
//           fail: function (err) {
//             wx.hideLoading()
//             wx.showModal({
//               title: '温馨提示',
//               content: '文档打开失败，请稍后再试',
//               showCancel: false,
//               confirmColor: "#aa2b24",
//             })
//             resolve({
//               status: "fail",
//               wjgs,
//               filemat
//             });
//           }
//         })
//       } else {
//         wx.openDocument({
//           filePath: path,
//           fileType: wjgs,
//           showMenu: isShowMenu,
//           success: function (res) {
//             resolve({
//               status: "success",
//               wjgs,
//               filemat,
//               filePath: path
//             });
//           },
//           fail: function () {
//             resolve({
//               status: "fail",
//               wjgs,
//               filemat
//             });
//             const systemInfo = wx.getSystemInfoSync();
//             if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
//               wx.previewImage({
//                 urls: [path],
//                 current: path,
//                 fail() {
//                   wx.showModal({
//                     title: '温馨提示',
//                     content: 'PC端暂不支持PDF预览',
//                     showCancel: false,
//                     confirmColor: "#aa2b24",
//                   });
//                 }
//               })
//             } else {
//               wx.showModal({
//                 title: '温馨提示',
//                 content: '文档打开失败，请稍后再试',
//                 showCancel: false,
//                 confirmColor: "#aa2b24",
//               });
//             }
//           }
//         })
//       }
//     } else if (filemat === FILEMAT.IMAGE || wjgs === FILEMAT.IMAGE) {
//       if (picArr.length <= 0) {
//         picArr = [path];
//       }
//       wx.previewImage({
//         current: path,
//         urls: picArr
//       });
//       resolve({
//         status: "success",
//         wjgs,
//         filemat,
//         filePath: path
//       });
//     } else if (filemat === FILEMAT.AUDIO) {
//       const audio = wx.getBackgroundAudioManager();
//       audio.epname = '音频文件';
//       audio.singer = '音频文件';
//       audio.title = '音频文件';
//       audio.src = path;
//       resolve({
//         status: "success",
//         wjgs,
//         filemat,
//         filePath: path
//       });
//     } else {
//       resolve({
//         status: "fail",
//         wjgs,
//         filemat,
//         msg: "暂不支持格式"
//       });
//     }
//   });
// };

// /**
//  * 功能说明：跳转总入口小程序认证
//  * 责任公司：岩火
//  * 开发人员：陈雯奇
//  * 更新时间：2024/01/09
//  * @param { String } navigateType 跳转类型
//  * @return { Null }
//  */
// function carryTokenFromSupremeCourtMp(navigateType = "") {
//   wx.showLoading({
//     title: "跳转中...",
//     mask: true,
//   });
//   getApp().checkUasProInfo(getApp().globalData.openId).then((res) => {
//     let extraData = {};
//     let extra = {
//       navigateType
//     };
//     extraData = (res && res.ticket) ? Object.assign(extra, { ticket: res.ticket }) : extra;
//     wx.hideLoading();
//     wx.navigateToMiniProgram({
//       appId: "wx182be45f90ffbf3d",
//       path: "pages/index/index",
//       extraData,
//       // envVersion: 'trial',
//       fail: () => {
//         wx.hideLoading();
//       },
//       success: () => {
//         wx.hideLoading({
//           complete: () => {
//             wx.reLaunch({
//               url: '/pages/index/index',
//             })
//           },
//         });
//       }
//     });
//   });
// };

// //微信提示
// function showToast(msg, mask, icon) {
//   let m = false;
//   if (mask) {
//     m = true;
//   }
//   let i = 'none';
//   if (icon) i = icon;
//   wx.showToast({
//     title: msg,
//     mask: m,
//     icon: i,
//     duration: 2000
//   })
// }
// //跳转工单
// function toErrOrder(params) {
//   wx.showModal({
//     title: '提示信息',
//     content: params.content,
//     confirmColor: '#C3120E',
//     confirmText: '报错工单',
//     success: function (res) {
//       if (res.confirm) {
//         wx.setStorageSync('err_order_system_code', params.systemCode)  // 模块编号
//         wx.setStorageSync('err_order_app_sn', params.appSn)  // 流水号(应用)
//         wx.setStorageSync('err_order_case_code', params.caseCode ? params.caseCode : '')  // 案号
//         wx.setStorageSync('err_order_description', params.errOrderDescription)  // 问题描述
//         wx.setStorageSync('err_order_remark', params.errOrderRemark)  // 补充说明(隐藏提交后台，用户不可见)
//         wx.setStorageSync('err_order_request_id', params.requestId)  // 接口返回的requestId字段值
//         wx.navigateTo({
//           url: '/pages/order/errorder/edit',
//         })
//       }
//     },
//   })
// }
// /*
//   * @description    根据某个字段实现对json数组的排序
//   * @param   array  要排序的json数组对象
//   * @param   field  排序字段（此参数必须为字符串）
//   * @param   reverse 是否倒序（默认为false）
//   * @return  array  返回排序后的json数组
//   */
// function jsonSort(array, field, reverse) {
//   //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
//   if (array.length < 2 || !field || typeof array[0] !== "object") return array;
//   //数字类型排序
//   if (typeof array[0][field] === "number" || /^\d+(\.\d+)?$/.test(array[0][field])) {
//     array.sort(function (x, y) { return Number(x[field]) - Number(y[field]) });
//   } else if (typeof array[0][field] === "string") {//字符串类型排序
//     array.sort(function (x, y) { return x[field].localeCompare(y[field]) });
//   }
//   //倒序
//   if (reverse) {
//     array.reverse();
//   }
//   return array;
// }
// /**
//  * 功能说明：身份证号严格校验
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} idCard 身份证号
//  */
// function checkzjh(idCard) {
//   let aCity = {
//     11: "北京",
//     12: "天津",
//     13: "河北",
//     14: "山西",
//     15: "内蒙古",
//     21: "辽宁",
//     22: "吉林",
//     23: "黑龙江",
//     31: "上海",
//     32: "江苏",
//     33: "浙江",
//     34: "安徽",
//     35: "福建",
//     36: "江西",
//     37: "山东",
//     41: "河南",
//     42: "湖北",
//     43: "湖南",
//     44: "广东",
//     45: "广西",
//     46: "海南",
//     50: "重庆",
//     51: "四川",
//     52: "贵州",
//     53: "云南",
//     54: "西藏",
//     61: "陕西",
//     62: "甘肃",
//     63: "青海",
//     64: "宁夏",
//     65: "新疆",
//     71: "台湾",
//     81: "香港",
//     82: "澳门",
//     91: "国外"
//   };
//   if (idCard === "") {
//     return false;
//   }
//   let iSum = 0;
//   if (!/^\d{17}(\d|x)$/i.test(idCard)) {
//     return false;
//   }
//   idCard = idCard.replace(/x$/i, "a");
//   if (aCity[parseInt(idCard.substr(0, 2))] === null) {
//     return false;
//   }
//   let sBirthday = idCard.substr(6, 4) + "-" + Number(idCard.substr(10, 2)) + "-" + Number(idCard.substr(12, 2));
//   let d = new Date(sBirthday.replace(/-/g, "/"));
//   if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
//     return false;
//   }
//   for (let i = 17; i >= 0; i--)
//     iSum += (Math.pow(2, i) % 11) * parseInt(idCard.charAt(17 - i), 11);
//   if (iSum % 11 != 1) {
//     return false;
//   }
//   return true;
// }
// function showTips() {
//   wx.showModal({
//     title: '温馨提示',
//     content: '强提醒是指发送“人民法院在线服务”消息时，按优先级从高到低会依次以公众号消息、服务通知消息、短信消息方式对接收方进行强制消息提醒，直至某种消息提醒发送成功为止',
//     showCancel: false,
//     confirmColor: '#aa2b24'
//   })
// }
// //掌上法庭临时通知队列
// class Queue {
//   constructor() {
//     let items = [];
//     //入队
//     this.enqueue = function (ele) {
//       items.push(ele);
//     };
//     //出队
//     this.dequeue = function () {
//       items.shift();
//     };
//     //返回首元素
//     this.front = function () {
//       return items[0];
//     };
//     //是否空
//     this.isEmpty = function () {
//       return items.length == 0;
//     };
//     //清空队列
//     this.clear = function () {
//       items = [];
//     };
//     //返回队列长度
//     this.size = function () {
//       return items.length;
//     };
//     this.showQueue = function () {
//       return items;
//     };
//   }
// }
// let hyPzTokenConfig = {
//   //  生产
//   grant_type: "client_credentials",
//   scope: "all",
//   client_secret: "123456",
//   client_id: "client_650000"
// }
// /**
//  * 功能说明：获取当前用户信息
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {Object} params 密文用户信息
//  * @param {Boolean} mwFlage 是否获取明文
//  */
// async function getCurrentUserInfo(params = {}, mwFlage = false) {
//   let app = getApp();
//   let result = await app.getCurrentUserInfo()
//   let resObj = {}
//   if (result && result.status === "OK") {
//     resObj = result.data || {}
//   } else {
//     if (params) {
//       toErrOrder({
//         ...params,
//         errOrderRemark: `获取用户明文信息出参：${JSON.stringify(result)}；原传参：${JSON.stringify(params)};用户信息：${JSON.stringify(app.globalData.common.userInfo)}`,//补充说明(隐藏提交后台，用户不可见)
//         requestId: result.requestId
//       });
//     }
//   }
//   if (mwFlage) {
//     resObj = {
//       ...app.globalData.common.userInfo,
//       ...resObj,
//     }
//   }
//   return resObj;
// }
// /**
//  * 功能说明：司法码颜色匹配//0-灰，1-红码，2-黄码，3-绿码，4-蓝码，5-金码
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  */
// let sfmColor = {
//   "0": {
//     code: "0",
//     color: "grey",
//     name: "灰码"
//   },
//   "1": {
//     code: "1",
//     color: "#FF0000",
//     name: "红码"
//   },
//   "2": {
//     code: "2",
//     color: "#F0CE46",
//     name: "黄码"
//   },
//   "3": {
//     code: "3",
//     color: "#008800",
//     name: "绿码"
//   },
//   "4": {
//     code: "4",
//     color: "#1E90FF",
//     name: "蓝码"
//   },
//   "5": {
//     code: "5",
//     color: "#FFD700",
//     name: "金码"
//   }
// }
// /**
//  * 功能说明：格式化时间8位至年月日开始
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} dateString 
//  * @param {String} format 年月日
//  */
// function dateFormat8(dateString, format) {
//   if (!dateString || dateString === "") {
//     return '';
//   }
//   let date = '-';
//   let year = format ? format : '年';
//   let month = format ? format : '月';
//   let day = format ? "" : '日';
//   if (dateString.indexOf("年") > -1 && dateString.indexOf("月") > -1 && dateString.indexOf("日") > -1) {//若是含有年月日的 例2021年07月20日,重组，重新赋值
//     dateString = dateString.replace('年', "-").replace('月', "-").replace('日', "");
//   }
//   if (dateString.indexOf("/") > -1) {//若是含有/的 例2021/07/20
//     let strArr = dateString.split("/");
//     date = strArr[0] + year + two(strArr[1]) + month + two(strArr[2]) + day;
//   } else if (dateString.indexOf("-") > -1) {//若是含有-的 例2021-07-20
//     let strArr = dateString.split("-");
//     date = strArr[0] + year + two(strArr[1]) + month + two(strArr[2]) + day;
//   } else if (dateString.length === 8) {//8位 例20210710
//     date = dateString.slice(0, 4) + year + dateString.slice(4, 6) + month + dateString.slice(6, 8) + day;
//   } else if (dateString.length === 17) {//17位 例20210710 14:27:21
//     date = dateString.slice(0, 4) + year + dateString.slice(4, 6) + month + dateString.slice(6, 8) + day;
//   } else if (dateString.length === 19) {//19位 例2021/07/10 14:27:21
//     date = dateString.slice(0, 4) + year + dateString.slice(5, 7) + month + dateString.slice(8, 10) + day;
//   } else if (dateString.length > 8) {//日期小于8位，则为非法日期,返回-
//     date = dateString;
//   }
//   return date;
// }
// // 防连点
// function tapTime(selt) {
//   return new Promise(resolve => {
//     let nowTime = new Date().getTime();
//     if (selt.data.tapTime && (nowTime - selt.data.tapTime < 500)) {
//       resolve(false);
//     }
//     selt.setData({
//       tapTime: nowTime,
//     });
//     resolve(true)
//   })
// }

// function znzxEncrypt(str) {
//   let CryptoJS = crypto.CryptoJS;
//   let aseKey = "g3q6or3da5pgblny";
//   let _IV = '';
//   let key = CryptoJS.enc.Utf8.parse(aseKey);
//   let iv = CryptoJS.enc.Utf8.parse(_IV);
//   let encrypted = '';
//   let srcs = CryptoJS.enc.Utf8.parse(str);
//   encrypted = CryptoJS.AES.encrypt(srcs, key, {
//     iv: iv,
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   })
//   return encrypted.toString();
// }
// function rqCheck(time = "") {
//   let result = time.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
//   if (result == null) {
//     return false;
//   }
//   let d = new Date(result[1], result[3] - 1, result[4]);
//   return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
// }
// /**
//  * 功能说明：检测输入的表情包
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} value 
//  */
// function isEmojiCharacter(value = "") {
//   if (value && util.isEmojiCharacter(value)) {
//     wx.showModal({
//       title: '提示',
//       content: '当前输入不支持表情符号。',
//       showCancel: false,
//       confirmColor: '#aa2b24'
//     })
//     return true
//   }
//   return false
// }
// /**
//  * 功能说明：获取指定日期的前一天
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {String} date 
//  */
// function getYesterday(date) {
//   date = date.split('-')
//   let today = new Date().setFullYear(+date[0], +date[1] - 1, +date[2])
//   let yesterday = new Date(today - 24 * 60 * 60 * 1000);
//   let y = yesterday.getFullYear();
//   let m = yesterday.getMonth() + 1;
//   let d = yesterday.getDate();
//   if (m < 10) {
//     m = '0' + m;
//   }
//   if (d < 10) {
//     d = '0' + d;
//   }
//   return y + '-' + m + '-' + d;
// }
// /**
//  * 功能说明：获取字典表数据
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  * @param {Object} argu 
//  */
// function requestDictionary(argu={}) {
//   let app = getApp();
//   let type = argu.type || ''
//   let requestData = app.globalData.cApi.getTsGbdmByDmlxApi(argu);
//   if (type === 'tsdm') requestData = app.globalData.cApi.getTsDmInfosByKindApi(argu);
//   if (type === 'bzdm') requestData = app.globalData.cApi.getTsBzDmInfosByKindApi(argu);
//   requestData.hideModal = argu.hideModal || false//是否隐藏“系统异常,请稍后再试”提示
//   return new Promise((resolve, reject) => {
//     app.requestLoading(requestData).then(result => {
//       if (result.code === STATUS.STATUS_200) {
//         result.data = result.data || [];
//         let resData = result.data.filter(node => {
//           return Number(node.sfjy) === 0;
//         });
//         if (type === 'bzdm') {
//           resData.forEach(ele => {
//             ele.code = ele.gbcode || ele.code || '';
//           });
//         }
//         resolve({ lb: 'arr', argu: argu, data: resData });
//       } else {
//         resolve({ status: 'fail', msg: result.msg, data: result });
//         log.error(`sjzd:获取基础数据${argu.mc}信息失败 [err:${JSON.stringify(result)}]`, result);
//       }
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
// /* 防抖函数封装 */
// function debounce(fn, interval) {
//   let timer;
//   let delay = interval || 1000; // 间隔的时间，如果interval不传，则默认1秒
//   return function () {
//     let that = this;
//     let args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
//     if (timer) {
//       clearTimeout(timer);
//     }
//     timer = setTimeout(function () {
//       fn.apply(that, args); // 用apply指向调用debounce的对象，相当于this.fn(args);
//     }, delay);
//   };
// }
// /**
//  * 功能说明：ocr状态码
//  * 责任公司：通达海
//  * 开发人员：赵利山
//  * 更新时间：2024/01/19
//  */
// const OCRSTATUS = {
//   // 识别成功
//   OCR_0: "0",
//   // 识别中
//   OCR_1: "1",
//   // 识别失败
//   OCR_2: "2",
//   // 未识别
//   OCR_3: "3",
// }

// const LOCK_STATUS = {
//   LOCK_OPEN: '1',  // 密码锁开启
//   LOCK_CLOSE: '2',  // 密码锁关闭
//   TIP_SHOW: '2', // 显示密码锁上线提示
//   TIP_HIDE: '1'  // 不显示密码锁上线提示
// }

// module.exports = {
  // getDataBySfzh,
  // getUUID,
  // toErrOrder,
  // regs,
  // downloadYhFile,
  // downloadFileStream,
  // formatTime2,
  // formatNumber,
  // getDateRange,
  // clearFile,
  // getUrlParams,
  // faceRecognition,
  // getFormatDate,
  // formatDate,
  // getFile,
  // getFilemat,
  // downloadFile,
  // carryTokenFromSupremeCourtMp,
  // showToast,
  // jsonSort,
  // checkzjh,
  // showTips,
  // Queue,
  // throttle,
  // hyPzTokenConfig,
  // getCurrentUserInfo,
  // sfmColor,
  // dateFormat8,
  // tapTime,
  // znzxEncrypt,
  // rqCheck,
  // isEmojiCharacter,
  // getYesterday,
  // yhCofig,
  // requestDictionary,
  // debounce,
  // STATUS,
  // OCRSTATUS,
  // LOCK_STATUS
// }
