<script setup lang="ts">
import { RouterLink,useRouter, RouterView } from "vue-router";
import { ref } from "vue";

let transitionName = ref();

let router = useRouter();
router.beforeEach((to, from) => {
  // 根据路由标记判断触发哪个动画
  if (to.meta.index > from.meta.index) {
    // 从右往左动画
    transitionName.value = "slide-right";
  } else if (to.meta.index < from.meta.index) {
    // 从左往右动画
    transitionName.value = "slide-left";
  } else {
    transitionName.value = "";
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="animation">
      <RouterView v-slot="{ Component }">
        <Transition :name="transitionName">
          <KeepAlive :include="['sjlist']">
            <component :is="Component"></component>
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

  
<style lang="scss" scoped>
.wrapper {
  overflow-x: hidden;
  .animation {
    display: flex;
    width: 200%;
    & > div {
      width: 50%;
    }
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
      transition: transform 0.3s;
    }

    .slide-right-enter-from {
      transform: translateX(0);
    }
    .slide-right-enter-to {
      transform: translateX(-100%);
    }
    .slide-right-leave-from {
      transform: translateX(0);
    }
    .slide-right-leave-to {
      transform: translateX(-100%);
    }

    .slide-left-enter-from {
      transform: translateX(-200%);
    }
    .slide-left-enter-to {
      transform: translateX(-100%);
    }
    .slide-left-leave-from {
      transform: translateX(0);
    }
    .slide-left-leave-to {
      transform: translateX(100%);
    }
  }
}
</style>
