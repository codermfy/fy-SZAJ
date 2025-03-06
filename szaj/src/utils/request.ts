// import { showToast, showSuccessToast, showFailToast,showLoadingToast  } from "vant";
import axios from "axios";
import { getToken } from "./baseTool";
import router from '@/router'
import type { AxiosInstance, AxiosError } from "axios";
import { usePathStore } from "@/stores/routerPath";




const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_APIHOST + "/api/v3",
  timeout: 10000,
});
request.interceptors.request.use(
  (config) => {
    const thirdtoken = getToken("THIRD-TOKEN");
    config.headers["appCode"] = `${import.meta.env.VITE_APP_APPCODE}`;
    if (thirdtoken) {
      config.headers["Authorization"] = `${thirdtoken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    showFailToast("网络异常");
    // 对请求错误做些什么
    return Promise.resolve(false);
  }
);
request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code == 200) {
        return response.data.data;
      }
      //  else if (response.data.code == 1012) {
      //   showFailToast(response.data.msg)
      //   localStorage.setItem('YH-TOKEN', '')
      //   localStorage.setItem('THIRD-TOKEN', '')
      //   router.replace('/login')
      //   return Promise.resolve(false);
      // }
      else {
        showFailToast(response.data.msg ||response.data.message || "请求失败，请稍后再试");
        return Promise.resolve(false);
      }
    } else {
      showFailToast("网络异常");

      return Promise.resolve(false);
    }
    // 对响应数据做点什么
  },
  (error: AxiosError | any) => {
    const pathStore=usePathStore();
    if (error?.response?.data?.code == 500) {
      if (error?.response?.data?.data?.gw_code === 401) {
        closeToast();
        showFailToast("认证失效,请重新登陆");
        pathStore.setRouterPath('case-list');
        router.go(-1);
        return Promise.resolve(false);
      }
    }
    // console.log(error)
    showFailToast(error?.response?.data?.msg || "网络异常");
    // 对响应错误做点什么
    return Promise.resolve(false);
  }
);
const requestOrigin: AxiosInstance = axios.create({
  timeout: 10000,
});
requestOrigin.interceptors.request.use(
  (config) => {
    const thirdtoken = getToken("THIRD-TOKEN");
    config.headers["appCode"] = `${import.meta.env.VITE_APP_APPCODE}`;
    if (thirdtoken) {
      config.headers["Authorization"] = `${thirdtoken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    showFailToast("网络异常");
    // 对请求错误做些什么
    return Promise.resolve(false);
  }
);
requestOrigin.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError | any) => {
    const pathStore=usePathStore();
    if (error?.response?.data?.code == 500) {
      if (error?.response?.data?.data?.gw_code === 401) {
        closeToast();
        showFailToast("认证失效,请重新登陆");
        pathStore.setRouterPath('case-list');
        router.go(-1);
        return Promise.resolve(false);
      }
    }
    // console.log(error)
    showFailToast(error?.response?.data?.msg || "网络异常");
    // 对响应错误做点什么
    return Promise.resolve(false);
  }
);
// GET 请求封装
const get = (url: string, params?: object) => {
  return request({
    method: "get",
    url,
    params,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });
};
// POST 请求封装
const post = (url: string, data?: object) => {
  return request({
    method: "post",
    url,
    data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};

const postJSON = (url: string, data?: object) => {
  return request({
    method: "post",
    url,
    data: data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
};

const postmult = (url: string, data?: object) => {
  return request({
    method: "post",
    url,
    data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "multipart/form-data;",
    },
  });
};

const put = (url: string, data?: object) => {
  return request({
    method: "put",
    url,
    data: data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
};

const del = (url: string, data?: object) => {
  return request({
    method: "delete",
    url,
    data: data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
};

const patch = (url: string, data?: object) => {
  return request({
    method: "patch",
    url,
    data: data,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
};

export const http = {
  get,
  post,
  postJSON,
  postmult,
  put,
  del,
  patch,
  requestOrigin,
};
