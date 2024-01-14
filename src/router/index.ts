import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    name:'main',
    component: () => import('../view/share/LayoutView.vue'),
    children: [
      {
          path: "/",
          name: "Home",
          component: () => import('../view/Hellow.vue'),
          meta: {
              title: "首頁",
              requiresAuth: true,
          },
      },
      {
        path: '/hellow',
        name: 'hellow',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
            title: '測試',
            requiresAuth: true,
        },
      }
      // {
      //     path: "/camera-error-record",
      //     name: "camera-error-record",
      //     component: () => import('@/views/CameraErrorRecord.vue'),
      //     meta: {
      //         title: "故障紀錄",
      //         requiresAuth: true,
      //     },
      // },
      // {
      //     path: "/ai-camera-record",
      //     name: "ai-camera-record",
      //     component: () => import('@/views/AICameraRecord.vue'),
      //     meta: {
      //         title: "AI偵測紀錄",
      //         requiresAuth: true,
      //     },
      // },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;