<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="0">
          <div class="text-center">
            <h1 class="mb-2">Update Account</h1>
          </div>
          <v-card-text>
            <ValidationObserver ref="form">
              <v-form>
                <ValidationProvider rules="alpha" v-slot="{ errors }">
                  <div>
                    <v-text-field label="Enter your Username" :placeholder="getUserInfo.username"
                      v-model="user.username" name="username" prepend-inner-icon="mdi-account" type="text"
                      class="rounded-0" persistent-hint :hint="errors[0]" outlined></v-text-field>
                  </div>

                </ValidationProvider>
                <ValidationProvider rules="alpha" v-slot="{ errors }">

                  <v-text-field label="Enter your Pseudo" name="pseudo" :placeholder="getUserInfo.pseudo"
                    v-model="user.pseudo" prepend-inner-icon="mdi-account" type="text" persistent-hint :hint="errors[0]"
                    class="rounded-0" outlined></v-text-field>
                </ValidationProvider>
                <ValidationProvider rules="email" v-slot="{ errors }">

                  <v-text-field label="Enter your Email" name="email" :placeholder="getUserInfo.email"
                    v-model="user.email" prepend-inner-icon="mdi-email" type="email" class="rounded-0" persistent-hint
                    :hint="errors[0]" outlined></v-text-field>
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }">
                  <v-text-field label="Enter your Password" name="password" v-model="user.password"
                    prepend-inner-icon="mdi-lock" type="password" class="rounded-0" persistent-hint :hint="errors[0]"
                    outlined></v-text-field>
                </ValidationProvider>
                <v-btn class="rounded-0" color="#000000" @click="update" x-large block dark>Update</v-btn>
              </v-form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  middleware: 'auth',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  name: "app-register",
  data() {
    return {
      user: {}
    }
  },
  computed: {
    getUserInfo() {
      return this.$store.getters.getUserInfo;
    },
  },
  methods: {
    async update() {
      this.$refs.form.validate().then((success) => {
        //   if(success)
        if (success) {
          let payload = this.user
          this.$store.dispatch("user/update", { id: this.getUserInfo.id, payload }).then(() => {
            // TODO document why this arrow function is empty

          });
          this.reset()
        } else {
          this.$toast.error("Check the error messages some fields are not valid", {
            position: "bottom-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      });
    },
    reset() {
      this.user = {}
    },
  },
};

</script>

<style lang="css" scoped>
</style>
