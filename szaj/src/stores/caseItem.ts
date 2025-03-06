import { defineStore } from 'pinia'
import type { CaseItem } from '@/types/case'

export const useCaseStore = defineStore('case', {
  state: () => {
    return {
      caseItem: {} as CaseItem,
      tempCase:{},
      caseForm:{},
    }
  },
  actions: {
    setCaseItem(val:CaseItem) {
      this.caseItem = val
    },
    setTempCase(val:any){
      this.tempCase=val;
    },
    setCaseForm(val:any){
      this.caseForm=val;
    }
  },
  persist: {
    storage: sessionStorage,
  }
})