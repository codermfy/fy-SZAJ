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
  getAuditCaseList(params: { caseBh: string, page: number,size:number,auditResult:string,downloadState:string|boolean }) {
    return http.get(`/getAuditCaseList`, params);
  },
  getRegister(params: any) {
    return http.get(`/getRegister`, params);
  },
  createTask(params: any) {
    return http.post(`/createTask`, params);
  },
  createTaskMult(params: any) {
    return http.postmult(`/createTask`, params);
  },
  downloadTemplate(params: any) {
    return http.get(`/downloadTemplate`, params);
  },
  getAuditDetails(params: any) {
    return http.get(`/getAuditDetails`, params);
  },
  getExportList(params: any) { 
    return http.get(`/getTaskList`, params);
  } 
};
