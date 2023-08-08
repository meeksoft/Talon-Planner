<template>
  <div class="fit row wrap justify-start items-start content-start">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
      aria-label="Progress Bar"
    />
    <div class="col-12">
      <div class="row">
        <div class="col-xs-12 col-sm-5 col-md-5">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            default-opened
            expand-icon-toggle
            group="firstGroup"
            header-class="bg-primary text-white shadow-2 q-toolbar"
            expand-icon-class="text-white"
            role="region"
            aria-label="Powerset Selection"
          >
            <template v-slot:header>
              <q-toolbar
                class="bg-primary text-white q-toolbar"
                role="toolbar"
                aria-label="Select Toolbar"
              >
                <q-select
                  :key="archetypeModel"
                  ref="archetypeSelect"
                  rounded
                  borderless
                  hide-dropdown-icon
                  v-model="store.archetypeModel"
                  :options="archetypeOptions"
                  @update:model-value="(value) => updatePowersets(value)"
                  role="select"
                  aria-label="Select Archetype"
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
                        <q-icon :name="scope.opt.icon" size="56px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-icon :name="store.archetypeModel.icon" size="56px">
                      <q-tooltip>{{ store.archetypeModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>

                <q-select
                  :key="store.primaryModel"
                  ref="primarySelect"
                  rounded
                  borderless
                  hide-dropdown-icon
                  v-model="store.primaryModel"
                  :options="primaryOptions"
                  color="primary"
                  @update:model-value="(val) => updatePrimary(val)"
                  role="select"
                  aria-label="Select Primary"
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
                  borderless
                  hide-dropdown-icon
                  v-model="store.secondaryModel"
                  :options="secondaryOptions"
                  @update:model-value="(val) => updateSecondary(val)"
                  role="select"
                  aria-label="Select Secondary"
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
                  borderless
                  hide-dropdown-icon
                  v-model="store.epicModel"
                  :options="epicOptions"
                  @update:model-value="(val) => updateEpic(val)"
                  role="select"
                  aria-label="Select Epic"
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

                <q-select
                  :key="store.originModel"
                  rounded
                  borderless
                  hide-dropdown-icon
                  v-model="store.originModel"
                  :options="store.originOptions"
                  role="select"
                  aria-label="Select Origin"
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
                    <q-icon :name="store.originModel.icon" size="md">
                      <q-tooltip>{{ store.originModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>

                <q-select
                  :key="store.alignmentModel"
                  rounded
                  borderless
                  hide-dropdown-icon
                  v-model="store.alignmentModel"
                  :options="store.alignmentOptions"
                  role="select"
                  aria-label="Select Alignment"
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
                    <q-icon :name="store.alignmentModel.icon" size="md">
                      <q-tooltip>{{ store.alignmentModel.label }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>
              </q-toolbar>
            </template>

            <div class="row num-columns first-group-body">
              <div class="col-xs-12 col-xsm-6">
                <powerset-card :powerset="primarySelected"></powerset-card>
              </div>
              <div class="col-xs-12 col-xsm-6">
                <powerset-card :powerset="secondarySelected"></powerset-card>
              </div>
              <div class="col-xs-12 col-xsm-6">
                <powerset-card :powerset="epicSelected"></powerset-card>
              </div>
              <div class="col-xs-12 col-xsm-6">
                <div class="col-xs-12">
                  <powerset-card
                    :key="poolPowersetCard1"
                    :powersets="poolOptions"
                    :selectModel="store.pool1Model"
                    @onSelectModelUpdate="
                      val = updateModel(store.pool1Model, val)
                    "
                  ></powerset-card>
                </div>
                <div class="col-xs-12">
                  <powerset-card
                    :key="poolPowersetCard2"
                    :powersets="poolOptions"
                    :selectModel="store.pool2Model"
                    @onSelectModelUpdate="
                      val = updateModel(store.pool2Model, val)
                    "
                  ></powerset-card>
                </div>
                <div class="col-xs-12">
                  <powerset-card
                    :key="poolPowersetCard3"
                    :powersets="poolOptions"
                    :selectModel="store.pool3Model"
                    @onSelectModelUpdate="
                      val = updateModel(store.pool3Model, val)
                    "
                  ></powerset-card>
                </div>
                <div class="col-xs-12">
                  <powerset-card
                    :key="poolPowersetCard4"
                    :powersets="poolOptions"
                    :selectModel="store.pool4Model"
                    @onSelectModelUpdate="
                      val = updateModel(store.pool4Model, val)
                    "
                  ></powerset-card>
                </div>
                <!-- <div class="col-xs-12 first-group-column">
                <powerset-card :powerset="inherentSelected"></powerset-card>
              </div -->
              </div>
            </div>
          </q-expansion-item>
          <multi-viewer
            title="Details"
            groupName="firstGroup"
            :defaultOpened="false"
          ></multi-viewer>
        </div>

        <div class="col-xs-12 col-sm-7 col-md-7">
          <multi-viewer title="Build" groupName="secondGroup"></multi-viewer>
          <multi-viewer
            title="Details"
            groupName="secondGroup"
            :defaultOpened="false"
          ></multi-viewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, toRef } from 'vue';
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
      inherentSelected: ref({ icon: '', label: 'None' }), //For Testing.
      pt,
      ...useClickCount(),
      ...useDisplayTodo(toRef(props, 'todos')),
    };
  },
  async mounted() {
    /* BAR needs to track better */
    this.bar.start();

    if (window.__TAURI__) {
      this.store.fetchLoadType = 1;
    } else {
      this.store.fetchLoadType = -1;
    }
    await this.store.fetchDatabase();

    /* Trigger Refreshes */
    this.archetypeOptions = this.store.archetypes;
    let tempModel = this.store.archetypeModel;
    this.store.archetypeModel = []; //Trigger Refreshe
    this.store.archetypeModel = tempModel;
    this.poolOptions = this.store.pools;
    this.inherentSelected = this.store.inherents[0];
    //console.log(this.store.inherents);
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
      deep: false,
      handler: function () {
        this.updatePowersets(this.store.archetypeModel);
      },
    },
    primaryModel: {
      deep: false,
      handler: async function () {
        await this.store.fetchPowerset(this.store.primaryModel, 1);
        this.updatePrimary(this.store.primaryModel);
      },
    },
    secondaryModel: {
      deep: false,
      handler: async function () {
        await this.store.fetchPowerset(this.store.secondaryModel, 1);
        this.updateSecondary(this.store.secondaryModel);
      },
    },
    epicModel: {
      deep: false,
      handler: async function () {
        await this.store.fetchPowerset(this.store.epicModel, 1);
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
    async updatePrimary(powerset) {
      this.primarySelected = powerset;
    },
    async updateSecondary(powerset) {
      this.secondarySelected = powerset;
    },
    async updateEpic(powerset) {
      this.epicSelected = powerset;
    },
    updateModel(model, value) {
      model = value;
    },
  },
});
</script>

<style scoped>
.q-toolbar {
  height: 60px;
}

.num-columns {
  display: block;
  column-gap: 0;
  columns: 1;
}

@media screen and (min-width: 450px) {
  .num-columns {
    columns: 2;
  }
}

@media screen and (min-width: 600px) {
  .num-columns {
    columns: auto;
  }

  .first-group-body {
    height: calc(var(--vh, 1vh) * 100 - 170px);
    overflow: auto;
  }
}

@media screen and (min-width: 1024px) {
  .num-columns {
    columns: 2;
  }
}
@media screen and (min-width: 1440px) {
  .num-columns {
    columns: 2;
  }
}
</style>
