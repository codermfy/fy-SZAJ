import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useReadFileStore = defineStore('readFile', {
  state: () => {
    return {
      readFile: []
    }
  },
  actions: {
    setReadFile(val:any) {
      this.readFile = val
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
