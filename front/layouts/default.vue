<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list v-if="isAuthenticated">
        <v-list-item @click="logout" router exact>
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-for="(item, i) in itemsAuth" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-container>
      <div class="wrapperr">
        <div class="search-input">
          <a href="" target="_blank" hidden></a>
          <input type="text" v-model="searchTxt" placeholder="Rechercher" autofocus />

          <div class="icon">
            <v-icon color="black" @click="search()" >
              mdi-magnify
            </v-icon>
          </div>
        </div>
      </div>
    </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async logout() {
      await this.$auth.logout().then(() => {
        this.$router.push('/login')
      })
    },
    async search() {
      this.$router.push({ path: 'search', query: { video: this.searchTxt } }).then(() => {
          window.location.reload(true)
      }).catch(() => {
      })
    }
  },
  data() {
    return {
      searchTxt: '',
      watch: {
        items: () => {
          if (isAuthenticated) {
            this.items.push({
              to: '/logout',
              icon: 'mdi-logout',
              title: 'Logout'
            })
          }

        }
      },
      clipped: false,
      drawer: false,
      fixed: false,
      items: [

        {
          icon: "mdi-account",
          title: "Login",
          to: "/login",
        },
        {
          icon: "mdi-account-plus",
          title: "Register",
          to: "/signup",
        },
        {
          icon: "mdi-video-account",
          title: "List vidéos",
          to: "/",
        },
      ],
      itemsAuth: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "Update Account",
          to: "/update",
        },
        {
          icon: "mdi-video-plus",
          title: "Upload Vidéo",
          to: "/upload",
        },
        {
          icon: "mdi-video-account",
          title: "List vidéos",
          to: "/",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },

}
</script>

<style>
.wrapperr {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.wrapperr .search-input {
  background: rgb(20, 19, 19);
  min-width: 150px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.12);
}

.search-input input {
  color: rgb(220, 212, 200);
  height: 55px;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 0 60px 0 20px;
  font-size: 18px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}

.search-input.active input {
  border-radius: 5px 5px 0 0;
}

.search-input .autocom-box {
  padding: 0;
  opacity: 0;
  pointer-events: none;
  max-height: 280px;
  overflow-y: auto;
}

.search-input.active .autocom-box {
  padding: 10px 8px;
  opacity: 1;
  pointer-events: auto;
}

.autocom-box li {
  list-style: none;
  padding: 8px 12px;
  display: none;
  width: 100%;
  cursor: default;
  border-radius: 3px;
}

.search-input.active .autocom-box li {
  display: block;
}

.autocom-box li:hover {
  background: #efefef;
}

.search-input .icon {
  position: absolute;
  right: 0px;
  top: 0px;
  height: 55px;
  width: 55px;
  text-align: center;
  line-height: 55px;
  font-size: 20px;
  color: #644bff;
  cursor: pointer;
}
</style>