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
    import InputRulesMixin from "@/mixins/InputRulesMixin";
    import VDialog from "vuetify/lib/components/VDialog/index";
    import ActorApi from "@/api/actors";

    export default {
        name: "ActorsSaveActorDialog",
        mixins: [InputRulesMixin],
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
                rules: {
                    required: (val) => !!val || this.$t('error_input_field_required')
                },
            }
        },
        computed: {
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
            actor(newValue) {
                this.setActorData(newValue);
            }
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
                let result = await ActorApi.requests.createActor(data);
                console.log({result});
                this.$emit('create:actor', result.data);
                this.$emit('save:actor', result.data);
            },
            async editActor() {
                let data = {
                    name: this.actorName,
                    age: this.actorAge,
                    gender: this.actorGender,
                };
                let result = await ActorApi.requests.patchActor(this.actorId, data);
                console.log({result});
                this.$emit('update:actor', result.data);
                this.$emit('save:actor', result.data);
            },
            setActorData(actor) {
                if (actor) {
                    this.actorId = actor.id || 0;
                    this.actorName = actor.name || '';
                    this.actorAge = actor.age || 0;
                    this.actorGender = actor.gender || 0;
                } else {
                    this.actorId = 0;
                    this.actorName = '';
                    this.actorAge = 0;
                    this.actorGender = '';
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
            padding-right  16px
</style>