import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user-store";
import { useListStore } from "@/stores/list-store";
import { showUserMsg, showSuccessMsg } from "@/services/event-bus.service";



const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/UserView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/list/:listId?",
      name: "list",
      component: () => import("@/views/ListIdx.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "summary",
          name: "list-summary",
          component: () => import("@/views/SummaryView.vue"),
          meta: { requiresAuth: true }
        },
      ],
    },
    {
      path: "/debug",
      name: "debug",
      component: () => import("@/views/DebugView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/error",
      name: "error-admin",
      component: () => import("@/views/ErrorView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/recipe",
      name: "recipe",
      component: () => import("@/components/RecipeView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/test',
      component: () => import("@/views/TestView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
      component: () => import("@/views/ErrorView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import("@/views/AdminView.vue"),
      meta: { requiresAuth: true }
    },
  
  ],
});


const routeHistory = []





router.beforeEach(async (to, from, next) => {
  const user  = JSON.parse(localStorage.getItem('loggedUser'))
console.log('USER IN ROUTER', user);


  
  const confirmRefresh = ['list'];
  routeHistory.push({ to, from, user: user || {}});

  if(to.matched.some(record => record.meta.requiresAuth) && !user) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }


  if(confirmRefresh.includes(to.name)) {
    window.addEventListener('beforeunload', (ev) => {
    
      
      ev.preventDefault();
      ev.returnValue = '';
      
      
    });
    
  }
  
  next();
});

export default router;
