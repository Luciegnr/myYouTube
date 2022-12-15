import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - youtube",
    title: "youtube",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  // ssr: true,
  // target: "server",
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "@/plugins/vuelidate.js", ssr: true }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/router",
    "vue-toastification/nuxt",
    "cookie-universal-nuxt",
    "@nuxtjs/auth-next",

    // You can also pass plugin options
    [
      "vue-toastification/nuxt",
      {
        timeout: 1000,
        draggable: false,
      },
    ],
  ],

  auth: {
    watchLoggedIn: true,
    resetOnError: true,
    cookie: false,
    localStorage: true,
    strategies: {
      local: {
        user: {
          property: "data",
          autoFetch: true

        },
        token: {
          property: 'data.token',
          maxAge: 1800,
          required: true,
          type: 'Bearer',
        },
        cookie: {
          options: {
            maxAge: 60 * 60 * 24 * 30,
          }
        },
        endpoints: {
          login: {
            url: "/login",
            method: "post",
          },
          logout: false,
          user: { url: "/user", method: "get" },
        },
        tokenRequired: true,
        tokenType: "bearer",
        autoLogout: true,
      },
    },
    redirect: {
      login: "/login",
      logout: "/",
      home: "/",
      callback: false,
    },
    // plugins: [{ src: "~/plugins/auth.js", ssr: true }],
  },

  axios: {
    // REVIEW : change base url
    // baseURL: "http://localhost:4000/"
    baseURL: "https://dev.api3.local/",
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vee-validate/dist/rules"],
  },
  server: {
    host: "0.0.0.0",
  },
};
