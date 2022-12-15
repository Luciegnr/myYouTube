<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="0">
          <div class="text-center">
            <h1 class="mb-2">Upload Video</h1>
          </div>
          <v-card-text>
            <v-form>
              <v-text-field label="Enter the name for the video" v-model='data.name' name="name"
                prepend-inner-icon="mdi-account" type="text" class="rounded-0" outlined></v-text-field>
              <v-file-input label="Upload video" v-model="data.source" name="source" class="rounded-0" outlined>
              </v-file-input>

              <v-btn class="rounded-0" color="#000000" x-large block dark @click="create()">Upload</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "app-login",
  middleware: 'auth',
  data() {
    return {
      data: {},
    };
  },
  computed: {
    getUserInfo() {
      return this.$store.getters.getUserInfo;
    },
  },
  methods: {
    create() {
      const payload = new FormData();
      for (let [key, value] of Object.entries(this.data)) {
        payload.append(key, value);
      }
      let id = this.$store.getters.getUserInfo.id
      this.$store.dispatch("video/create", { payload: payload, id: id }).then((response) => {
        console.log(response)
      })
    }
  }
};
</script>

<style lang="css" scoped>
</style>
