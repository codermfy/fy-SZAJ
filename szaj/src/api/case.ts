import { http } from "@/utils/request";
export const caseApi = {
  getCaseList(params: { type: number, IDNumber: string }) {
    return http.get(`/getCaseList`, params);
  },
  getCaseDetails(params:any={}) {
    return http.get(`/getCaseDetails`, params);
  },
  stagingData(params:any={}){
    return http.postJSON(`/stagingData`, params);
  },
  getCaseDetailsNoStagingData(params:any={}){
    return http.get(`/getCaseDetailsNoStagingData`, params);
  },
  updatePartyData(params:any={}){
    return http.post(`/updatePartyData`, params);
  },
  addPartyData(params:any={}){
    return http.post(`/addPartyData`, params);
  },

};
