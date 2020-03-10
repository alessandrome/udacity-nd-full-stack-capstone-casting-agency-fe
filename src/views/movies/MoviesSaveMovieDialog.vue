<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" v-on="$listeners">
        <v-card>
            <v-card-title>
                {{ $t(movieId ? 'save_movie' : 'create_movie')}}
            </v-card-title>
            <v-card-text>
                <v-form ref="movieDialogForm" @submit.prevent="() => false">
                    <v-layout input-container wrap>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="movieTitle"
                                :label="$tc('title', 1)"
                                :rules="[inputRules.required]"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-menu
                                ref="releaseDateMenu"
                                v-model="releaseDateMenu"
                                :close-on-content-click="false"
                                :return-value.sync="movieReleaseDate"
                                transition="scale-transition"
                                offset-y
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="movieReleaseDate"
                                        :label="$tc('release_date', 1)"
                                        :rules="[inputRules.required]"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="movieReleaseDate" no-title scrollable>
                                    <v-btn text color="primary" @click="releaseDateMenu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.releaseDateMenu.save(movieReleaseDate)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex v-if="can('read:actor')" xs12>
                            <v-autocomplete
                                v-model="movieActors"
                                :items="computedActorList"
                                item-value="id"
                                item-text="name"
                                :search-input.sync="actorsSearchInput"
                                multiple
                                return-object
                                :label="$tc('actor', 2)"
                                :rules="[inputRules.required]"
                            ></v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn @click="showDialog = false">{{$t('cancel')}}</v-btn>
                    <v-btn @click="saveMovie">{{$t(movieId ? 'save' : 'create')}}</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import AuthMixin from '@/mixins/AuthMixin';
    import InputRulesMixin from "@/mixins/InputRulesMixin";
    import VDialog from "@/mixins/VDialogComponentMixin";
    import MovieApi from "@/api/movies";
    import ActorApi from "@/api/actors";

    export default {
        name: "MoviesSaveMovieDialog",
        mixins: [AuthMixin, InputRulesMixin, VDialog],
        props: {
            movie: {
                type: Object,
            },
            vDialogProps: {
                type: Object,
                default: () => ({}),
            },
            value: {}
        },
        data() {
            return {
                movieId: 0,
                movieTitle: '',
                movieReleaseDate: '',
                movieActors: [],
                actorList: [],
                actorsSearchInput: null,
                actorSearchPage: 1,
                actorSearchPerPage: 20,
                actorLoadCounter: 0,
                isLoadingActors: false,
                releaseDateMenu: false,
                rules: {
                    required: (val) => !!val || this.$t('error_input_field_required')
                },
            }
        },
        computed: {
            computedActorList() {
                let computedList = [...this.movieActors, ...this.actorList];
                return computedList;
            },
            showDialog: {
                get() {
                    return this.value;
                },
                set(v) {
                    this.$emit('input', v);
                }
            },
        },
        watch: {
            value: {
                immediate: true,
                handler(isOpen) {
                    if (isOpen && this.can('read:actor') && !this.moviesSearchInput) {
                        this.$nextTick(() => {
                            this.moviesSearchInput = '';
                        });
                    }
                }
            },
            movie(newValue) {
                this.setMovieData(newValue);
            },
            actorsSearchInput(searchInput) {
                this.loadActors(true);
            },
        },
        methods: {
            saveMovie() {
                if (this.$refs.movieDialogForm.validate()) {
                    if (this.movieId) {
                        this.editMovie();
                    } else {
                        this.createMovie();
                    }
                }
            },
            async createMovie() {
                let data = {
                    title: this.movieTitle,
                    release_date: this.movieReleaseDate,
                };
                if (this.can('read:actor')) {
                    data.actors = this.movieActors.map(a => a.id);
                }
                await MovieApi.requests.createMovie(data)
                    .then(response => {
                        this.$emit('create:movie', response.data);
                        this.$emit('save:movie', response.data);
                    })
                    .catch(response => {

                    });
            },
            async editMovie() {
                let data = {
                    title: this.movieTitle,
                    release_date: this.movieReleaseDate,
                };
                if (this.can('read:actor')) {
                    data.actors = this.movieActors.map(a => a.id);
                }
                await MovieApi.requests.patchMovie(this.movieId, data)
                    .then(response => {
                        this.$emit('update:movie', response.data);
                        this.$emit('save:movie', response.data);
                    })
                    .catch(response => {

                    });
            },
            setMovieData(movie) {
                if (movie) {
                    this.movieId = movie.id || 0;
                    this.movieTitle = movie.title || '';
                    this.movieReleaseDate = movie.release_date || '';
                    this.movieActors = movie.actors || [];
                } else {
                    this.movieId = 0;
                    this.movieTitle = '';
                    this.movieReleaseDate = '';
                    this.movieActors = [];
                }
            },
            async loadActors(reset) {
                if (reset) {
                    this.movieList = []
                }
                let loadCounter = ++this.movieLoadCounter;
                this.isLoadingMovies = true;
                await ActorApi.requests.getActors({}, {search_term: this.moviesSearchInput}, this.movieSearchPage, this.movieSearchPerPage)
                    .then(response => {
                        this.actorList.push(...response.data.items);
                    })
                    .catch(response => {

                    });
                if (loadCounter === this.movieLoadCounter) {
                    this.isLoadingMovies = false;
                }
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .input-container
        > *
            padding 4px 8px

    .v-card
        &__text
            padding-left 16px
            padding-right 16px
</style>