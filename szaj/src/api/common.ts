import { http } from "@/utils/request";
export const commonApi = {
  getToken(params: {
    zjhm: string;
  }) {
    return http.get(`/getToken`, params);
  },
  getUserInfo(params: {
    code: string;
  }) {
    return http.get(`/getUserInfo`, params);
  },
  statistics(params: {
    method: string;
    xm: string;
    zjhm: string;
    fydm: string;
    ajbh: string;
    date: string;
  }) {
    return http.post(`/statistics`, params);
  },
  findCourtCase(params: {
    IDNumber: string;
    code: string;
  }) {
    return http.get(`/findCourtCase`, params);
  },
  findVagueCase(params: {
    IDNumber: string;
    code: string;
  }) {
    return http.get(`/findVagueCase`, params);
  },
};
