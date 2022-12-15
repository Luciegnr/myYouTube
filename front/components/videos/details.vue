<template>
    <div v-if="video && Source && videoSource" class="Parent">
        <div class="child1">
            <div class="video-container">
                <video style="width: -webkit-fill-available; height: -webkit-fill-available;" controls autoplay loop=""
                    :src="`https://dev.api3.local/video?path=${videoSource}`" alt="" muted="muted" />
            </div>
            <div class="video-information">


                <div class="mb-2 d-flex flex-row">
                    <v-avatar class="mr-3 mt-2" :color="getRandomColor()" size="36">
                        <span class="white--text text-h5">{{
                        getFirstChar(video.user.pseudo)
                        }}</span>
                    </v-avatar>
                    <h1>{{video.name}}</h1>

                    <div class="d-flex flex-row ml-auto">
                        <div class="mx-1" v-for="(single, index1) in video.formats">
                            <div v-for="(key, value, index2) in single">
                                <v-btn depressed @click="OnChangeFormat(key)">
                                    {{ value }}
                                </v-btn>

                            </div>

                        </div>
                    </div>
                </div>
                <div class="mb-2">
                    {{ getRandomNumber() }} vues - {{ dateToString(video.created_at) }}
                </div>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                    in reprehenderit in voluptate velit Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit</p>
            </div>
        </div>
        <div class="child2">
            <v-card class="mx-auto" max-width="344" outlined v-for="(videos, i) in videos" :key="i"
                v-if="videos._id != video._id">
                <v-list-item style="text-decoration: none;" :to="{ name: 'details', params: { id: videos._id } }" class="px-0 py-2" three-line>
                    <video :controls="false" loop="" style="height: 30% !important; width: 50% !important;"
                        :src="`https://dev.api3.local/video?path=${videos.source}`" alt="" muted="muted" />
                    <v-list-item-content class="ml-2">     
                        <v-list-item-title class="text-overline mb-4">
                            {{video.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle>orem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            videoSource: ''
        }
    },
    mounted() {
        this.$store.dispatch('video/findOne', { id: this.$route.params.id });
        let source = this.$store.state.video.video.source
        this.videoSource = source
    },
    async created() {
        this.$store.dispatch("video/findAll");
    },
    computed: {
        video() {
            return this.$store.state.video.video
        },
        Source() {
            return this.videoSource = this.$store.state.video.video.source
        },
        videos() {
            return this.$store.state.video.videos;
        },
    },
    methods: {
        OnChangeFormat(source) {
            this.videoSource = source
        },
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
};
</script>

<style>
.Parent {
    display: flex;
    flex-direction: row;
}

.video-container {
    height: 60%;
    margin: 2rem;
    text-align: right;
    color: white;
}

.video-information {
    height: auto;
    text-align: left;
    margin: 2rem;
    color: rgb(255, 255, 255);
}

.child1 {
    width: 75%;
    height: auto;
    margin: 2rem;
    text-align: right;
    color: white;
}

.child2 {
    margin-top: 4rem;
    width: 25%;
    color: green;
    height: auto;
}
</style>
