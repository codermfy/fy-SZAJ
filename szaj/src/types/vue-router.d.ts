import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        // 在这里添加需要的类型
        // 有些页面是没有标题的，所以 title 是可选参数
        title?: string;
    }
}
