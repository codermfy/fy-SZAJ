export type CaseItem = {
  caseAbbreviation:string,
  caseBh:string,
  caseName:string,
  courtExecution:string,
  startTime:string,
  state: string,

  bh?:string
  endTime?:string
  fydm?:string,
  hesitateDay?:string,
  hesitateEndTime?:string,
  inherit?:string,
  jurisdiction?:string,
  caseNotice?:string,
  refund?:number,
  type?:string

}