import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePathStore = defineStore('path', {
  state: () => {
    return {
      routerPath: ''
    }
  },
  actions: {
    setRouterPath(val:any) {
      this.routerPath = val
    },
    clearRouterPath(){
      this.routerPath = ''
    }
  },
  persist: {
    storage: sessionStorage,
  },
})
