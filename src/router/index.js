import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/list",
      name: "list",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/ListIdx.vue"),
      children: [
        {
          path: "summary",
          name: "list-summary",
          component: () => import("@/views/SummaryView.vue"),
        },
      ],
    },
    {
      path: "/error",
      name: "error-admin",
      component: () => import("@/views/ErrorView.vue"),
    },
    {
      path: "/recipe",
      name: "recipe",
      component: () => import("@/views/RecipeView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],
});

// TODO:  add navigation guards
// TODO: route for recipes
// router.beforeEach((to, from, next) => {})

export default router;
