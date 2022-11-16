import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import Verification from "../views/Verification.vue";
import { app } from "@/firebase/config";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/Verification",
    name: "Verification",
    component: Verification,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      verified: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.verified)) {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          next();
        } else {
          next({
            path: "/Verification",
          });
        }
      } else {
        next({
          path: "/login",
        });
      }
    });
  } else {
    next();
  }
});

export default router;
