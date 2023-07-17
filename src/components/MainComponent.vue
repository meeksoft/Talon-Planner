<template>
  <div class="fit row wrap justify-start items-start content-start">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="col-12">
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-6">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            default-opened
            expand-icon-toggle
            group="firstGroup"
            header-class="bg-primary text-white shadow-2 q-toolbar"
            expand-icon-class="text-white"
          >
            <template v-slot:header>
              <q-toolbar class="bg-primary text-white q-toolbar">
                <q-select
                  :key="store.archetypeModel"
                  ref="archetypeSelect"
                  rounded
                  standout
                  hide-dropdown-icon
                  v-model="store.archetypeModel"
                  :options="archetypeOptions"
                  @update:model-value="(value) => updatePowersets(value)"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-tooltip max-width="300px">{{
                        scope.opt.description
                      }}</q-tooltip>
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" size="xl" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-icon :name="store.archetypeModel.icon" size="xl">
                      <q-tooltip>{{ store.archetypeModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>

                <q-select
                  :key="store.primaryModel"
                  ref="primarySelect"
                  rounded
                  standout
                  hide-dropdown-icon
                  v-model="store.primaryModel"
                  :options="primaryOptions"
                  color="primary"
                  @update:model-value="(val) => updatePrimary(val)"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-tooltip max-width="300px">{{
                        scope.opt.description
                      }}</q-tooltip>
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-icon :name="store.primaryModel.icon" size="lg">
                      <q-tooltip>{{ store.primaryModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>

                <q-select
                  :key="store.secondaryModel"
                  ref="secondarySelect"
                  rounded
                  standout
                  hide-dropdown-icon
                  v-model="store.secondaryModel"
                  :options="secondaryOptions"
                  @update:model-value="(val) => updateSecondary(val)"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-tooltip max-width="300px">{{
                        scope.opt.description
                      }}</q-tooltip>
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-icon :name="store.secondaryModel.icon" size="lg">
                      <q-tooltip>{{ store.secondaryModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>

                <q-select
                  :key="store.epicModel"
                  ref="epicSelect"
                  rounded
                  standout
                  hide-dropdown-icon
                  v-model="store.epicModel"
                  :options="epicOptions"
                  @update:model-value="(val) => updateEpic(val)"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-tooltip max-width="300px">{{
                        scope.opt.description
                      }}</q-tooltip>
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-icon :name="store.epicModel.icon" size="lg">
                      <q-tooltip>{{ store.epicModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>
              </q-toolbar>
            </template>

            <div class="row">
              <div class="col-xs-12 col-sm-4 first-group-column">
                <powerset-card :powerset="primarySelected"></powerset-card>
              </div>
              <div class="col-xs-12 col-sm-4 first-group-column">
                <powerset-card :powerset="secondarySelected"></powerset-card>
              </div>
              <div class="col-xs-12 col-sm-4 first-group-column-long">
                <powerset-card :powerset="epicSelected"></powerset-card>
                <powerset-card
                  :key="poolPowersetCard1"
                  :powersets="poolOptions"
                  :selectModel="store.pool1Model"
                ></powerset-card>
                <powerset-card
                  :key="poolPowersetCard2"
                  :powersets="poolOptions"
                  :selectModel="store.pool2Model"
                ></powerset-card>
                <powerset-card
                  :key="poolPowersetCard3"
                  :powersets="poolOptions"
                  :selectModel="store.pool3Model"
                ></powerset-card>
                <powerset-card
                  :key="poolPowersetCard4"
                  :powersets="poolOptions"
                  :selectModel="store.pool4Model"
                ></powerset-card>
              </div>
            </div>
          </q-expansion-item>
          <multi-viewer
            title="Details"
            groupName="firstGroup"
            :defaultOpened="false"
          ></multi-viewer>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6">
          <multi-viewer title="Build" groupName="buildGroup"></multi-viewer>
          <multi-viewer title="Details" groupName="detailsGroup"></multi-viewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, toRef } from 'vue';
import { useQuasar } from 'quasar';
import { useTalonStore } from 'stores/talon-store';
import { PowersetType } from 'components/models';
import MultiViewer from 'components/MultiViewer.vue';
import PowersetCard from 'components/PowersetCard.vue';

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'MainComponent',
  components: { MultiViewer, PowersetCard },
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array,
      default: () => [],
    },
    meta: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    const store = useTalonStore();

    const bar = ref(null);

    const pt = PowersetType;

    const archetypeOptions = [];
    const primaryOptions = [];
    const secondaryOptions = [];
    const epicOptions = [];
    const poolOptions = [];

    return {
      store,
      bar,
      archetypeOptions,
      primaryOptions,
      secondaryOptions,
      epicOptions,
      poolOptions,
      poolPowersetCard1: ref({}),
      poolPowersetCard2: ref({}),
      poolPowersetCard3: ref({}),
      poolPowersetCard4: ref({}),
      primarySelected: ref({ icon: '', label: 'None' }),
      secondarySelected: ref({ icon: '', label: 'None' }),
      epicSelected: ref({ icon: '', label: 'None' }),
      pt,
      ...useClickCount(),
      ...useDisplayTodo(toRef(props, 'todos')),
    };
  },
  async mounted() {
    const $q = useQuasar();
    let notifyConfig = {
      type: 'ongoing',
      color: 'info',
      position: 'bottom-right',
      caption: '0%',
      message: '',
    };

    const steps = 7;

    /* BAR needs to track better */
    this.bar.start();

    const notif = $q.notify({ ...notifyConfig, message: 'Loading Boosts.' });
    await this.store.fetchBoosts();
    notif({
      caption: `${(100 / steps).toFixed(0)}%`,
      message: 'Loading Boost sets.',
    });
    await this.store.fetchBoostsets();

    notif({
      caption: `${(200 / steps).toFixed(0)}%`,
      message: 'Loading Archetypes.',
    });
    await this.store.fetchArchetypes();
    this.archetypeOptions = this.store.archetypes;
    this.store.archetypeModel = []; //Trigger Refreshes

    notif({
      caption: `${(300 / steps).toFixed(0)}%`,
      message: 'Loading Power sets.',
    });
    await this.store.fetchPowersets();
    this.store.primaryModel = []; //Trigger Refreshes
    this.store.secondaryModel = []; //Trigger Refreshes

    notif({
      caption: `${(400 / steps).toFixed(0)}%`,
      message: 'Loading Epics.',
    });
    await this.store.fetchEpics();
    this.store.epicModel = []; //Trigger Refreshes

    notif({
      caption: `${(500 / steps).toFixed(0)}%`,
      message: 'Loading Pools.',
    });
    await this.store.fetchPools();
    this.poolOptions = this.store.pools;

    notif({
      caption: `${(600 / steps).toFixed(0)}%`,
      message: 'Loading Inherits.',
    });
    await this.store.fetchInherits();

    notif({
      type: 'positive',
      color: 'positive',
      caption: '100%',
      message: 'Loading is Pau!',
    });

    /* Trigger Refreshes */
    this.poolPowersetCard1 = [];
    this.poolPowersetCard2 = [];
    this.poolPowersetCard3 = [];
    this.poolPowersetCard4 = [];

    this.bar.stop();
  },
  computed: {
    archetypeModel() {
      return this.store.archetypeModel;
    },
    primaryModel() {
      return this.store.primaryModel;
    },
    secondaryModel() {
      return this.store.secondaryModel;
    },
    epicModel() {
      return this.store.epicModel;
    },
  },
  watch: {
    archetypeModel: {
      deep: true,
      handler: function () {
        this.updatePowersets(this.store.archetypeModel);
      },
    },
    primaryModel: {
      deep: true,
      handler: function () {
        this.updatePrimary(this.store.primaryModel);
      },
    },
    secondaryModel: {
      deep: true,
      handler: function () {
        this.updateSecondary(this.store.secondaryModel);
      },
    },
    epicModel: {
      deep: true,
      handler: function () {
        this.updateEpic(this.store.epicModel);
      },
    },
  },
  methods: {
    updatePowersets(archetype) {
      if (archetype == undefined) return;
      this.primaryOptions = archetype.primaryPowersets;
      this.secondaryOptions = archetype.secondaryPowersets;
      this.epicOptions = archetype.epicPowersets;
    },
    updatePrimary(powerset) {
      this.primarySelected = powerset;
    },
    updateSecondary(powerset) {
      this.secondarySelected = powerset;
    },
    updateEpic(powerset) {
      this.epicSelected = powerset;
    },
  },
});
</script>

<style scoped>
.q-toolbar {
  height: 60px;
}

@media screen and (min-width: 600px) {
  .first-group-column {
    height: calc(60vh - 110px);
    overflow: auto;
  }
  .first-group-column-long {
    height: calc(100vh - 170px);
    overflow: auto;
  }
}
</style>
