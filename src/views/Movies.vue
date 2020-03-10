<template>
    <v-container fluid>
        <movies-save-movie-dialog v-model="isMovieSaveDialogOpen" :movie="openedMovie"
                                  @save:movie="movieSaved"></movies-save-movie-dialog>
        <v-layout column>
            <v-flex filter-row>
                <v-layout>
                    <v-text-field
                        v-model="movieSearchTerm"
                        single-line
                        hide-details
                        :placeholder="$tc('search', 1)"
                        prepend-inner-icon="search"
                        class="filter-row--search-term"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn v-if="can('create:movie')" @click="openSaveMovieDialog">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="movieHeader"
                    :items="movieList"
                    item-key="id"
                    disable-sort
                    :page="moviePage"
                    :items-per-page.sync="moviePerPage"
                    :footer-props.sync="moviePageFooterProps"
                    :server-items-length="movieCount"
                    :loading="movieListLoading"
                    class="v-data-table--full-page"
                >
                    <template v-slot:item.action="{ item }">
                        <template v-if="!item._is_loading_detail">
                            <v-icon
                                v-if="can('update:movie')"
                                small
                                @click="loadMovieDetail(item)"
                            >
                                create
                            </v-icon>
                            <v-icon
                                v-if="can('delete:movie')"
                                small
                                @click="deleteMovie(item)"
                            >
                                delete
                            </v-icon>
                        </template>
                        <v-progress-circular v-else-if="item._is_loading_detail" width="2" indeterminate
                                             size="16"></v-progress-circular>
                    </template>
                    <template v-slot:item.gender="{ item }">
                        <span>{{$tc(item.gender, 1)}}</span>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import AuthMixin from '@/mixins/AuthMixin';
    import MoviesSaveMovieDialog from "@/views/movies/MoviesSaveMovieDialog";
    import MovieApi from '@/api/movies';

    export default {
        name: "Movies",
        mixins: [AuthMixin],
        components: {MoviesSaveMovieDialog},
        data() {
            return {
                movieList: [],
                movieCount: 0,
                moviePerPage: 20,
                moviePage: 1,
                moviePageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                movieHeader: [
                    {text: this.$tc('title', 1), value: 'title'},
                    {text: this.$tc('release_date', 1), value: 'release_date'},
                    {text: this.$tc('action', 1), value: 'action', sortable: false},
                ],
                movieListLoading: false,
                movieListLoadingCount: 0,
                movieSearchTerm: '',
                filterCount: 0,
                isMovieSaveDialogOpen: false,
                openedMovie: null,
            }
        },
        watch: {
            moviePerPage() {
                this.loadMovies(true)
            },
            moviePage() {
                this.loadMovies();
            },
            movieSearchTerm() {
                this.filterMovies();
            },
        },
        created() {
            this.loadMovies();
        },
        methods: {
            async loadMovies(reset) {
                if (reset) {
                    this.movieList = [];
                }
                this.movieListLoading = true;
                let loadCount = ++this.movieListLoadingCount;
                let filter = {};
                if (this.movieSearchTerm) filter.searchTerm = this.movieSearchTerm;
                await MovieApi.requests.getMovies({}, filter, this.moviePage, this.moviePerPage)
                    .then(response => {
                        if (loadCount === this.movieListLoadingCount) {
                            this.movieList = response.data.items;
                            this.movieCount = response.data.total_items;
                        }
                    })
                    .catch(response => {
                        // TODO: Show snackbar error
                    });
                if (loadCount === this.movieListLoadingCount) {
                    this.movieListLoading = false;
                }
            },
            filterMovies() {
                let filterCount = ++this.filterCount;
                setTimeout(() => {
                    if (filterCount === this.filterCount)
                        this.loadMovies(true);
                }, 300);
            },
            movieSaved() {
                this.closeSaveMovieDialog();
                this.loadMovies();
            },
            async loadMovieDetail(movie) {
                this.$set(movie, '_is_loading_detail', true);
                await MovieApi.requests.getMovie(movie.id)
                    .then(response => {
                        this.openSaveMovieDialog(response.data);
                    })
                    .catch(response => {

                    });
                this.$set(movie, '_is_loading_detail', false);
            },
            async deleteMovie(movie) {
                this.$set(movie, '_is_loading_detail', true);
                await MovieApi.requests.deleteMovie(movie.id)
                    .then(response => {
                        this.loadMovies(true);
                    })
                    .catch(response => {

                    });
                this.$set(movie, '_is_loading_detail', false);
            },
            openSaveMovieDialog(movie) {
                if (movie) {
                    movie = Object.assign({}, movie)
                }
                this.openedMovie = movie;
                this.isMovieSaveDialogOpen = true;
            },
            closeSaveMovieDialog() {
                this.isMovieSaveDialogOpen = false;
            }
        },
    }
</script>

<style scoped>

</style>