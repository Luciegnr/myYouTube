export const state = () => ({
  videos: [],
  video: [],
  search: [],
});

export const getters = {
  getVideos(state) {
    return state.videos;
  },
  getVideo(state) {
    return state.video;
  },
  searchVideo(state) {
    return state.search;
  },
  getVideos: (state) => state.videos,
};

export const mutations = {
  FIND_ONE(state, video) {
    state.video = video;
  },

  SET_VIDEOS(state, videos) {
    state.videos = videos;
  },
  SEARCH_VIDEO(state, search) {
    state.search = search;
  }
};

export const actions = {
  async create({ commit }, { id, payload }) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`${this.$axios.defaults.baseURL}user/${id}/video`, payload)
        .then((response) => {
          resolve(response);
          this.$toast.success("Video online and in the process of encoding", {
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

  async findAll({ commit }) {
    try {
      await this.$axios
        .get(`${this.$axios.defaults.baseURL}videos`)
        .then((res) => {
          // console.log(res.data.data);
          commit("SET_VIDEOS", res.data.data);
        });
    } catch (error) {
      throw error;
    }
  },

  async Search({ commit }, {name, date}) {
    console.log("uiiii", name)
    console.log(`${this.$axios.defaults.baseURL}videos/search?name=${name}&date=${date}`)
    try {
      await this.$axios
        .get(`${this.$axios.defaults.baseURL}videos/search?name=${name}&date=${date}`)
        .then((res) => {
          console.log(res.data.videos);
          commit("SEARCH_VIDEO", res.data.videos);
        });
    } catch (error) {
      throw error;
    }
  },

  async findOne({ commit }, { id }) {
    console.log("yes")
    try {
      await this.$axios
        .get(`${this.$axios.defaults.baseURL}video/${id}`)
        .then((res) => {
          // console.log(res.data.data.video);
          console.log(res.data.data.video)
          commit("FIND_ONE", res.data.data.video);
        });
    } catch (error) {
      throw error;
    }
  },
};
