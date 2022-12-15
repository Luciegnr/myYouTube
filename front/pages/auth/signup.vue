<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="0">
          <div class="text-center">
            <h1 class="mb-2">Register</h1>
          </div>
          <v-card-text>
            <ValidationObserver ref="form">
              <v-form lazy-validation v-model="valid">

                <ValidationProvider rules="required|alpha" v-slot="{ errors }">
                  <div>
                    <v-text-field label="Enter your Username" v-model="user.username" name="username"
                      prepend-inner-icon="mdi-account" type="text" class="rounded-0" persistent-hint :hint="errors[0]"
                      outlined></v-text-field>
                  </div>

                </ValidationProvider>
                <ValidationProvider rules="required|alpha" v-slot="{ errors }">

                  <v-text-field label="Enter your Pseudo" name="pseudo" v-model="user.pseudo"
                    prepend-inner-icon="mdi-account" type="text" persistent-hint :hint="errors[0]" class="rounded-0"
                    outlined></v-text-field>
                </ValidationProvider>
                <ValidationProvider rules="required|email" v-slot="{ errors }">

                  <v-text-field label="Enter your Email" name="email" v-model="user.email"
                    prepend-inner-icon="mdi-email" type="email" class="rounded-0" persistent-hint :hint="errors[0]"
                    outlined></v-text-field>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors }">
                  <v-text-field label="Enter your Password" name="password" v-model="user.password"
                    prepend-inner-icon="mdi-lock" type="password" class="rounded-0" persistent-hint :hint="errors[0]"
                    outlined></v-text-field>
                </ValidationProvider>


                <v-btn class="rounded-0" color="#000000" x-large block dark @click="register">Register</v-btn>
                <v-card-actions class="text--secondary">
                  <v-spacer></v-spacer>
                  Already have an account?
                  <a href="/signin" class="pl-2" style="color: grey">Sign In</a>
                </v-card-actions>
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
  components: {
    ValidationProvider,
    ValidationObserver
  },
  name: "app-register",
  data() {
    return {
      valid: true,
      user: {},
    };
  },
  methods: {
    

    async register() {
      this.$refs.form.validate().then(async (success) => {
        //   if(success)
        if (success) {
          let payload = this.user
          this.$store.dispatch("user/create", payload).then((response) => {
            if (response.status == 201) {
              setTimeout(() => {
                this.$router.push("/login");
              }, 2000);
            }

          })
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
  },
};
</script>
<style>
.v-main__wrap {
  display: contents;
}
</style>
