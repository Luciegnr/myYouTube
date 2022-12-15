<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="0">
          <div class="text-center">
            <h1 class="mb-2">Login</h1>
          </div>
          <v-card-text>
            <v-text-field label="Enter your login" v-model="user.login" name="login" prepend-inner-icon="mdi-account"
              type="text" class="rounded-0" outlined></v-text-field>
            <v-text-field label="Enter your password" v-model="user.password" name="password" autoco
              prepend-inner-icon="mdi-lock" type="password" class="rounded-0" outlined></v-text-field>
            <v-btn class="rounded-0" @click="login" color="#000000" x-large block dark>Login</v-btn>
            <v-card-actions class="text--secondary">
              <v-spacer></v-spacer>
              No account ?
              <a href="/signup" class="pl-2" style="color: grey">Sign Up</a>
            </v-card-actions>
            {{ snackbarMessage }}

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  name: "app-login",
  data() {
    return {
      user: {
        login: '',
        password: ''
      },
      error: '',
      snackbarMessage: '',
    }
  },


  methods: {
    ...mapActions('user', {
      actionLogin: 'login'
    }),




    async login() {
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.user
        }).then((response) => {
          // this.$auth.strategy.token.set(response.data.token);


          // this.$auth.setUser(response.data);
          // this.$auth.$storage.setUniversal('user', response.data, true)

          this.$emit("connexionOk");
        }).catch((error) => {
          this.snackbarMessage = error.response.data.message;
        });
        console.log(response);
      } catch (err) {
        this.snackbarMessage = err.message;
        console.log(err);
      }
    }
  },


};

</script>

<style lang="css" scoped>

</style>
