import Vue from "vue";
import Router from "vue-router";

import Signin from "./pages/auth/signin.vue";
import Signup from "./pages/auth/signup.vue";
import Update from "./pages/user/update.vue";
import Upload from "./pages/videos/upload.vue";
import ListVideo from "./pages/videos/list.vue";
import DetailsVideo from "./pages/videos/details.vue";
import SearchVideo from "./components/videos/search.vue";
Vue.use(Router);

export function createRouter() {
  // const router =
  return new Router({
    mode: "history",
    routes: [
      {
        name: "login",
        path: "/login",
        component: Signin,
      },
      {
        name: "signup",
        path: "/signup",
        component: Signup,
      },
      {
        name: "update",
        path: "/update",
        component: Update,
      },
      {
        name: "upload",
        path: "/upload",
        component: Upload,
      },
      {
        name: "home",
        path: "/",
        component: ListVideo,
      },
      {
        name: "details",
        path: "/video/:id",
        component: DetailsVideo,
      },
      {
        name: "search",
        path: "/search",
        component: SearchVideo,
      }
    ],
  });
}
