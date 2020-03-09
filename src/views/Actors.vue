<template>
    <v-container fluid>
        <actors-save-actor-dialog v-model="isActorSaveDialogOpen" :actor="openedActor" @save:actor="closeSaveActorDialog"></actors-save-actor-dialog>
        <v-layout column>
            <v-flex filter-row>
                <v-layout>
                    <v-text-field
                        v-model="actorSearchTerm"
                        single-line
                        hide-details
                        :placeholder="$tc('search', 1)"
                        prepend-inner-icon="search"
                        class="filter-row--search-term"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn v-if="can('create:actor')" @click="openSaveActorDialog">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="actorHeader"
                    :items="actorList"
                    item-key="id"
                    disable-sort
                    :page="actorPage"
                    :items-per-page.sync="actorPerPage"
                    :footer-props.sync="actorPageFooterProps"
                    :server-items-length="actorCount"
                    :loading="actorListLoading"
                    class="v-data-table--full-page"
                >
                    <template v-slot:item.action="{ item }">
                        <v-icon
                            v-if="can('update:actor')"
                            small
                            @click="openSaveActorDialog(item)"
                        >
                            create
                        </v-icon>
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
    import ActorsSaveActorDialog from "@/views/actors/ActorsSaveActorDialog";
    import ActorApi from '@/api/actors';
    
    export default {
        name: "Actors",
        mixins: [AuthMixin],
        components: {ActorsSaveActorDialog},
        data() {
            return {
                actorList: [],
                actorCount: 0,
                actorPerPage: 20,
                actorPage: 1,
                actorPageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                actorHeader: [
                    {text: this.$tc('name', 1), value: 'name'},
                    {text: this.$tc('age', 1), value: 'age'},
                    {text: this.$tc('gender', 1), value: 'gender'},
                    {text: this.$tc('action', 1), value: 'action', sortable: false},
                ],
                actorListLoading: false,
                actorListLoadingCount: 0,
                actorSearchTerm: '',
                filterCount: 0,
                isActorSaveDialogOpen: false,
                openedActor: null,
            }
        },
         watch: {
            actorPerPage() {
                this.loadActors(true)
            },
            actorPage() {
                this.loadActors();
            },
            actorSearchTerm() {
                this.filterActors();
            },
        },
        created() {
            this.loadActors();
        },
        methods: {
            async loadActors(reset) {
                if (reset) {
                    this.actorList = [];
                }
                this.actorListLoading = true;
                let loadCount = ++this.actorListLoadingCount;
                let filter = {};
                if (this.actorSearchTerm) filter.searchTerm = this.actorSearchTerm;
                await ActorApi.requests.getActors({}, filter, this.actorPage, this.actorPerPage)
                    .then(response => {
                        if (loadCount === this.actorListLoadingCount) {
                            this.actorList = response.data.items;
                            this.actorCount = response.data.total_items;
                        }
                    })
                    .catch(response => {
                        // TODO: Show snackbar error
                    });
                if (loadCount === this.actorListLoadingCount) {
                    this.actorListLoading = false;
                }
            },
            filterActors() {
                let filterCount = ++this.filterCount;
                setTimeout(() => {
                    if (filterCount === this.filterCount)
                        this.loadActors(true);
                }, 300);
            },
            openSaveActorDialog(actor) {
                if (actor) {
                    actor = Object.assign({}, actor)
                }
                this.openedActor = actor;
                this.isActorSaveDialogOpen = true;
            },
            closeSaveActorDialog() {
                this.isActorSaveDialogOpen =false;
            }
        },
    }
</script>

<style scoped>

</style>