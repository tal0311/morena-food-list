import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user-store";
import { useListStore } from "@/stores/list-store";
import { useAppStore } from "@/stores/app-store";
import { useRecipeStore } from "@/stores/recipe-store";
import { showUserMsg, showSuccessMsg } from "@/services/event-bus.service";

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
      component: () => import("@/components/RecipeView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],
});


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const listStore = useListStore()
  const recipeStore = useRecipeStore()
  const { logError } = useAppStore()
  userStore.loggedUser




  if (to.name === "recipe") {
    if (to.query.inspiration) {
      // next({ name: "list" });
      // listStore.loadList()
      showSuccessMsg("Select a recipe to add products to the list");
    } else {
      recipeStore.loadMatches();
    
    }
    
  }

 

  if (to.name === "list") {
    if (!listStore.getList) {
      listStore.loadList()
    }
  }

  next();
})

export default router;
