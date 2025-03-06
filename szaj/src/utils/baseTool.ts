import crypto from "crypto-js";
export const formatDate = (value: number) => {
  if (!value) return "-";
  const date = new Date(value);
  // 这里假设你想要的日期格式是 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const generateUUID = () => {
  return (Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString(36);
}
export const FileUrlAndType= (files)=> {
  let urls = [];
  for (let item of files) {
    // const url = URL.createObjectURL(item);
    const suffix = item.name.split('.').pop().toLowerCase();
    const name =`${generateUUID()}.${suffix}`;
    const temp = {
      // url,
      suffix,
      file:item,
      // tempFilePath:url,
      fileName:name,
      name:item.name
    };
    urls.push(temp);
  }
  return urls;
};
// 创建UUID
export const generateUUID_1 = () => {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const parseToken = (token: string) => {
  let result;
  let slices = token.split(".");
  if (slices.length < 2) {
    return {};
  }
  let base64 = slices[1];
  let str = crypto.enc.Base64.parse(base64).toString(crypto.enc.Utf8);
  str = decodeURIComponent(str);
  try {
    result = JSON.parse(str);
  } catch (e) {
    result = {};
  }
  return result;
};
export const getToken = (tokenType: string) => {
  let token = window.localStorage.getItem(tokenType);
  if (!token) {
    return "";
  }
  let parsedToken = parseToken(token);
  if (parsedToken.exp * 1000 <= Date.now()) {
    window.localStorage.setItem(tokenType, "");
    token = "";
  }
  return token;
};
export const downFile = (url:string, linkDownload:string) => {
  fetch(url) //使用fetch函数发送一个GET请求到指定的URL，获取文件的响应对象。
    .then((response) => response.blob()) //通过.then方法链，将响应对象转换为Blob数据（文件的二进制数据）。
    .then((blob) => {
      //再次使用.then方法链，处理获取到的Blob数据。
      const link = document.createElement("a"); //使用document.createElement创建一个<a>节点。
      link.href = URL.createObjectURL(blob); //通过URL.createObjectURL方法，将Blob数据转换成URL对象，然后将该URL赋值给link的href属性。这一步相当于生成了一个临时URL，供下载使用。
      link.download = linkDownload; // 替换为你要保存的文件名和扩展名(设置用户下载文件时使用的文件名和扩展名)
      link.click(); //调用click方法模拟用户点击链接，从而触发浏览器的文件下载行为。

      URL.revokeObjectURL(link.href); // 释放URL对象资源(使用URL.revokeObjectURL方法释放之前创建的URL对象资源，避免内存泄漏)
    })
    .catch((error) => {
      console.error("下载失败:", error);
    });
};
 /**
   * 深拷贝对象
   * @param { Object } obj
   * @return { Object } 
   */
export const copyObj=(obj:any = {})=> {
  let newObj:any = null
  // 判断是否需要继续进行递归
  if (typeof obj === 'object' && obj !== null) {
    newObj = obj instanceof Array ? [] : {}
    // 进行下一层递归克隆
    for (let i in obj) {
      newObj[i] = copyObj(obj[i])
    }
  } else {
    newObj = obj
  }
  return newObj
};
