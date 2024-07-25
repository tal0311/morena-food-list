import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user-store";
import { useListStore } from "@/stores/list-store";
import { useAppStore } from "@/stores/app-store";
import { useRecipeStore } from "@/stores/recipe-store";
import { showUserMsg, showSuccessMsg } from "@/services/event-bus.service";
import { userService } from "@/services/user.service";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/UserView.vue"),
    },
    {
      path: "/list/:listId?",
      name: "list",
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
      path: "/debug",
      name: "debug",
      component: () => import("@/views/DebugView.vue"),
    },
    {
      path: "/error",
      name: "error-admin",
      component: () => import("@/views/ErrorView.vue"),
    },
    {
      path: "/recipe",
      name: "recipe",
      component: () => import("@/components/RecipeView.vue"),
    },
    {
      path: '/test',
      component: () => import("@/views/TestView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },

  ],
});


const routeHistory = []
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const listStore = useListStore()
  
  routeHistory.push({ to, from, user: userStore.loggedUser })


  if (to.name === 'list') {
    await listStore.loadItems()
  }

  if (to.name === 'list-summary') {
    if (!listStore.getCurrList) {
      showSuccessMsg('Please select some items to see the summary')
      // to.meta = userStore.loggedUser.selectedItems
      next({ name: 'list' })
      return
    }

  }


  // default to the next route
  next();
})

export default router;
