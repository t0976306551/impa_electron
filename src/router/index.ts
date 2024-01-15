import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    redirect: '/1', // 將首頁導向到 /1
    name:'main',
    component: () => import('@/view/share/LayoutView.vue'),
    children: [
      {
          path: "/:id",
          name: "Home",
          component: () => import('@/view/Home.vue'),
          meta: {
              title: "首頁",
              requiresAuth: true,
          },
      },
  
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;