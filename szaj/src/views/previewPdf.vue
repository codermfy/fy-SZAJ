<template>
<div class="pdf-viewer" ref="pdfContent">
  <template v-for="page in state.pdfPages" :key="page">
          <canvas :id="`page-${page}`" class="pdf-page" />
        </template>
        <div id="text-view"></div>
        <van-empty
          v-if="loadError"
          image="error"
          description="PDF加载出错了..."
        />
</div>
</template>

<script setup lang="ts">
import {
  ref,
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  nextTick,
  onUnmounted,
} from "vue";

import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.js";
import "pdfjs-dist/web/pdf_viewer.css";
import * as PDF from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
PDF.GlobalWorkerOptions.workerSrc = pdfjsWorker;
defineComponent({
  name: "previewPdf",
});
const loadError = ref(false);
const state = reactive({
  // 文件路径
  pdfPath: "",
  // 总页数
  pdfPages: 1,
  // 页面缩放
  pdfScale: 2,
});

onMounted(() => {
  state.pdfPath = localStorage.getItem("pdfUrl") || "";
  loadFile(state.pdfPath);
});

let pdfDoc = null;

function loadFile(url) {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: "加载中",
  });
  PDF.getDocument({
      url,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/",
      cMapPacked: true,
    })
    .promise.then((pdf) => {
      closeToast();
      pdfDoc = pdf;
      // 获取pdf文件总页数
      state.pdfPages = pdf.numPages;
      nextTick(() => {
        renderPage(1); // 从第一页开始渲染
      });
    })
    .catch(() => {
      closeToast();
      loadError.value = true;
    });
}

function renderPage(num) {
  pdfDoc.getPage(num).then((page) => {
    const canvas = document.getElementById(`page-${num}`);
    const ctx = canvas.getContext("2d");
    const viewport = page.getViewport({
      scale: state.pdfScale
    });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    page.render(renderContext);
    if (num < state.pdfPages) {
      renderPage(num + 1);
    }
  });
}

</script>

<style scoped>
.pdf-viewer {
  padding-right: 20px;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

​.pdf-viewer::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
