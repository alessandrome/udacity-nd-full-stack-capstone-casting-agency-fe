<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" v-on="$listeners">
        <v-card>
            <v-card-title>
                {{ $t(actorId ? 'save_actor' : 'create_actor')}}
            </v-card-title>
            <v-card-text>
                <v-form ref="actorDialogForm" @submit.prevent="() => false">
                    <v-layout input-container wrap>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="actorName"
                                :label="$tc('name', 1)"
                                :rules="[inputRules.required]"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="actorAge"
                                :label="$tc('age', 1)"
                                type="number"
                                :rules="[inputRules.required]"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                v-model="actorGender"
                                :items="['male', 'female', 'other']"
                                :label="$tc('gender', 1)"
                                :rules="[inputRules.required]"
                            ></v-select>
                        </v-flex>
                        <v-flex v-if="can('read:movie')" xs12>
                            <v-autocomplete
                                v-model="actorMovies"
                                :items="computedMovieList"
                                item-value="id"
                                item-text="title"
                                :search-input.sync="moviesSearchInput"
                                multiple
                                return-object
                                :label="$tc('movie', 2)"
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
                    <v-btn @click="saveActor">{{$t(actorId ? 'save' : 'create')}}</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import AuthMixin from '@/mixins/AuthMixin';
    import InputRulesMixin from "@/mixins/InputRulesMixin";
    import VDialog from "@/mixins/VDialogComponentMixin";
    import ActorApi from "@/api/actors";
    import MovieApi from "@/api/movies";

    export default {
        name: "ActorsSaveActorDialog",
        mixins: [AuthMixin, InputRulesMixin, VDialog],
        props: {
            actor: {
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
                actorId: 0,
                actorName: '',
                actorAge: 0,
                actorGender: '',
                actorMovies: [],
                movieList: [],
                moviesSearchInput: null,
                movieSearchPage: 1,
                movieSearchPerPage: 20,
                movieLoadCounter: 0,
                isLoadingMovies: false,
                rules: {
                    required: (val) => !!val || this.$t('error_input_field_required')
                },
            }
        },
        computed: {
            computedMovieList() {
                let computedList = [...this.actorMovies, ...this.movieList];
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
                    if (isOpen && this.can('read:movie') && !this.moviesSearchInput) {
                        this.$nextTick(() => {this.moviesSearchInput = '';});
                    }
                }
            },
            actor(newValue) {
                this.setActorData(newValue);
            },
            moviesSearchInput(searchInput) {
                this.loadMovies(true);
            },
        },
        methods: {
            saveActor() {
                if (this.$refs.actorDialogForm.validate()) {
                    if (this.actorId) {
                        this.editActor();
                    } else {
                        this.createActor();
                    }
                }
            },
            async createActor() {
                let data = {
                    name: this.actorName,
                    age: this.actorAge,
                    gender: this.actorGender,
                };
                if (this.can('read:movie')) {
                    data.movies = this.actorMovies.map(m => m.id);
                }
                await ActorApi.requests.createActor(data)
                    .then(response => {
                        this.$emit('create:actor', response.data);
                        this.$emit('save:actor', response.data);
                    })
                    .catch(response => {

                    });
            },
            async editActor() {
                let data = {
                    name: this.actorName,
                    age: this.actorAge,
                    gender: this.actorGender,
                };
                if (this.can('read:movie')) {
                    data.movies = this.actorMovies.map(m => m.id);
                }
                await ActorApi.requests.patchActor(this.actorId, data)
                    .then(response => {
                        this.$emit('update:actor', response.data);
                        this.$emit('save:actor', response.data);
                    })
                    .catch(response => {

                    });
            },
            setActorData(actor) {
                if (actor) {
                    this.actorId = actor.id || 0;
                    this.actorName = actor.name || '';
                    this.actorAge = actor.age || 0;
                    this.actorGender = actor.gender || 0;
                    this.actorMovies = actor.movies || [];
                } else {
                    this.actorId = 0;
                    this.actorName = '';
                    this.actorAge = 0;
                    this.actorGender = '';
                    this.actorMovies = [];
                }
            },
            async loadMovies(reset) {
                if (reset) {
                    this.movieList = []
                }
                let loadCounter = ++this.movieLoadCounter;
                this.isLoadingMovies = true;
                await MovieApi.requests.getMovies({}, {search_term: this.moviesSearchInput}, this.movieSearchPage, this.movieSearchPerPage)
                    .then(response => {
                        this.movieList.push(...response.data.items);
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