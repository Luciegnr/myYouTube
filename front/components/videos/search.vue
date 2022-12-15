<template lang="">
    <div v-if="loaded">
    <div v-if="video && video.length" >
        <div style="max-width: max-content" class="mx-14">

        <v-select
                v-model="date"
                :items="dateList"
                label="DATE D'AJOUT"
                append-icon="mdi-calendar"
                chips
                color="black"
              />
        </div>

        <div class="mx-14" v-for="(type, index) in video" :key="index" >
            <v-card class="mx-auto mt-2 d-flex" style="border: 0px; box-shadow: none; background: transparent;">
                <router-link :to="{ name: 'details', params: { id: type._source.data.id } }" class="d-flex"
                    style="text-decoration: none;">
                    <section
                        style="background: black; min-width: 360px; min-height: 202px; text-align: center; padding-bottom: -12px">
                        <video class="myvideos" :controls="false" loop=""
                            style="position: absolute; top: 0;right: 0;bottom: 0;left: 0;"
                            :src="`https://dev.api3.local/video?path=${type._source.data.source}`" alt="" muted="muted"></video>
                    </section>
                    <section>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title class="text-h5 mb-1">
                                    {{ type._source.data.name }}
                                </v-list-item-title>

                                <div class="mb-2">
                                    {{ getRandomNumber() }} vues - {{ dateToString(type._source.data.created_at) }}
                                </div>
                                <div class="mb-2">
                                    <v-avatar :color="getRandomColor()" size="36">
                                        <span class="white--text text-h5">
                                            {{
                                               getFirstChar(type._source.data.user.pseudo)
                                         }}
                                        </span>
                                    </v-avatar>
                                </div>

                                <v-list-item-subtitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                    in reprehenderit in voluptate velit Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis aute irure dolor in reprehenderit in
                                    voluptate velit</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </section>
                </router-link>
            </v-card>
        </div>
    </div> 
    <div v-else>
        <h1>Aucun résultat trouvé</h1>
        <h3>Essayez d'autres mots clés ou supprimez les filtres de recherche</h3>
    </div>
</div>
<div v-else>
    <v-progress-circular
      :size="100"
      :width="7"
      color="red"
      indeterminate
    ></v-progress-circular>
</div>
</template>
<script>
export default {
    data() {
        return {
            dateList: ["hour", "today", "week", "month", "year"],
            date: '',
            loaded: false

        }
    },
    watch: {
        date: {
            handler: function (val) {
                this.$router.push({ path: 'search', query: { video: this.$route.query.video, date: val } }).then(() => {
                    this.$store.dispatch('video/Search', { name: this.$route.query.video, date: this.date });

                }).catch(() => {
                })
            },
            immediate: true

        }
    },


    async created() {
        this.$store.dispatch('video/Search', { name: this.$route.query.video, date: this.date }).then(() => {
            this.loaded = true;
        }).catch(() => {
            this.loaded = true;
        })
    },
    computed: {
        video() {
            return this.$store.state.video.search
        },
    },
    methods: {
        // return random color
        getRandomColor() {
            let letters = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        // return random number of view 
        getRandomNumber() {
            return Math.floor(Math.random() * 100);
        },

        // return first char of string
        getFirstChar(string) {
            return string.charAt(0);
        },
        dateToString(date) {
            const today = new Date()
            const toDate = new Date(date)

            const difference = Math.abs(today - toDate)
            const days = Math.round(difference / (1000 * 3600 * 24))
            const hours = Math.round(difference / (1000 * 3600))
            const minutes = Math.round(difference / (1000 * 60))
            const seconds = Math.round(difference / 1000)

            if (seconds < 60) {
                return seconds <= 1 ? `Il y a ${seconds} seconde` : `Il y a ${seconds} secondes`
            }
            if (minutes < 60) {
                return minutes <= 1 ? `Il y a ${minutes} minute` : `Il y a ${minutes} minutes`
            }
            if (hours < 24) {
                return hours <= 1 ? `Il y a ${hours} heure` : `Il y a ${hours} heures`
            }
            if (days < 8) {
                return days <= 1 ? `Il y a ${days} jour` : `Il y a ${days} jours`
            } else if (days < 31) {
                const week = Math.round(days / 7)
                return week === 1 ? `Il y a ${week} semaine` : `Il y a ${week} semaines`
            } else if (days < 365) {
                const month = Math.round(days / 30)
                return `Il y a ${month} mois`
            } else {
                const year = Math.round(days / 365)
                return year === 1 ? `Il y a ${year} an` : `Il y a ${year} ans`
            }
        }
    },
}
</script>
<style lang="">
    
</style>