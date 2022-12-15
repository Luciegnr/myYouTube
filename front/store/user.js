// import axios from "axios";
export const state = () => ({
  users: [],
  user: [],
});

export const getters = {
  getUsers(state) {
    return state.users;
  },
  getUser(state) {
    return state.user;
  },
};

export const mutations = {
  FIND_ONE(state, user) {
    state.user = user;
  },
  FIND_ALL(state, users) {
    state.users = users;
  },
};

export const actions = {
  async create({}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`${this.$axios.defaults.baseURL}user`, payload)
        .then((response) => {
          resolve(response);
          this.$toast.success("Check your mail", {
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
            rtl: false,
          });
        })
        .catch((error) => {
          reject(error.response);
          this.$toast.error(error.response.data.data.message, {
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
            rtl: false,
          });
        });
    });
  },
  async findOne({ commit }, { id }) {
    try {
      await this.$axios
        .get(`${this.$axios.defaults.baseURL}user/${id}`)
        .then((res) => {
          console.log(res);
          commit("FIND_ONE", res.data);
        });
    } catch (error) {
      throw error;
    }
  },
  async findAll({ commit }) {
    try {
      await this.$axios
        .get(`${this.$axios.defaults.baseURL}users`)
        .then((res) => {
          console.log(res);
          commit("FIND_ALL", res.data);
        });
    } catch (error) {
      throw error;
    }
  },
  async update({ commit }, { id, payload }) {
    await this.$axios
      .put(`${this.$axios.defaults.baseURL}user/${id}`, payload)
      .then((response) => {
        this.$auth.fetchUser();
        this.$toast.success("data saved", {
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
          rtl: false,
        });
      })
      .catch((error) => {
        this.$toast.error(error.response.data.data.message, {
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
          rtl: false,
        });
      });
  },
};
