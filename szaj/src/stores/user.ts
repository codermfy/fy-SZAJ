import { defineStore } from 'pinia'

export const useUserStore = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: {
        name:'',
        identityId:'',
        phone:'',
        starIdentityId:'',
        starPhone:''
      } 
    }
  },
  actions: {
    setUserInfo(val:any) {
      this.userInfo = val
    },
  },
  persist: {
    storage: sessionStorage,
  }
})