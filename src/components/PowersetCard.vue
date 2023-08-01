<!---------------------------------------
 | If used as a dropdown, assign property powersets.
 | If used to show a single powerset, assign property powerset.
 | Do not assign both powersets and powerset.
 |
 | Assign property selectModel to: assign dropdown, and trigger actions.
 ---------------------------------------->
<template>
  <q-list bordered class="rounded-borders powerset-card-list no-page-break">
    <q-expansion-item
      ref="PowersetExpansionItem"
      dense
      dense-toggle
      expand-separator
      :default-opened="powerset && !$q.platform.is.mobile"
      expand-icon-toggle
      :icon="powerset ? powerset.icon : powersetModel.icon"
      :label="powerset ? powerset.label : powersetModel.label"
      header-class="bg-light-blue text-white"
      expand-icon-class="text-white"
      class="powerset-card-expansion-item"
      active-class="powerset-card-expansion-item-active"
    >
      <template v-slot:header v-if="!powerset">
        <q-select
          :key="powersetModel"
          rounded
          standout
          hide-dropdown-icon
          v-model="powersetModel"
          :options="powersets"
          @update:model-value="(val) => updatePowerset(val)"
          class="powerset-card-select text-white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
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
            <div
              style="margin-top: -30px; text-wrap: nowrap; overflow: hidden"
              class="text-white"
            >
              <q-icon :name="powersetModel.icon" size="sm">
                <q-tooltip>{{ powersetModel.label }}</q-tooltip>
              </q-icon>
              {{ powersetModel.label }}
            </div>
          </template>
        </q-select>
      </template>

      <q-card class="no-border-radius q-pa-md no-margin">
        <q-list dense class="text-primary">
          <div
            style="overflow: auto"
            v-if="!powerset"
            :key="powersetPowersModel"
          >
            <div v-for="(power, index) in powers" :key="index">
              <powerset-slot
                :power="power"
                @mouseenter="mouseenter($event, power)"
              ></powerset-slot>
            </div>
          </div>
          <div style="overflow: auto" v-if="powerset">
            <div v-for="(power, index) in powerset.powers" :key="index">
              <powerset-slot
                :power="power"
                @mouseenter="mouseenter($event, power)"
              ></powerset-slot>
            </div>
          </div>
        </q-list>
      </q-card> </q-expansion-item
  ></q-list>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useTalonStore } from 'stores/talon-store';
import PowersetSlot from 'components/PowersetSlot.vue';

export default defineComponent({
  name: 'PowersetCard',
  components: { PowersetSlot },
  emits: ['onSelectModelUpdate'],
  props: {
    powersets: {
      type: Array,
    },
    powerset: {
      type: Object,
    },
    selectModel: {
      type: Object,
    },
  },
  setup() {
    const store = useTalonStore();
    const powers = [];

    const powersetModel = ref({ icon: '', label: 'Select' });
    const powersetPowersModel = ref(null);

    return {
      store,
      powers,
      powersetModel,
      powersetPowersModel,
    };
  },
  mounted() {
    //
  },
  // computed: {
  //   powersetModel: {
  //     get() {
  //       if (this.selectModel != undefined && this.selectModel != null) {
  //         return this.selectModel;
  //       }
  //       return this.powersetModelHolder;
  //     },
  //     // set(value) {
  //     //   console.log('set');
  //     //   console.log(value);
  //     //   console.log(this.selectModel);
  //     //   console.log(this.powersetModelHolder);
  //     //   if (this.selectModel != undefined && this.selectModel != null) {
  //     //     console.log('1');
  //     //     this.selectModel = value;
  //     //     return;
  //     //   }
  //     //   console.log('2');
  //     //   this.powersetModelHolder = value;
  //     // },
  //   },
  // },
  watch: {
    selectModel: {
      deep: false,
      handler: async function () {
        this.powersetModel = this.selectModel;
        this.updatePowerset(this.selectModel);
      },
    },
    powersetModel: {
      deep: false,
      handler: function () {
        this.$refs.PowersetExpansionItem.show();
      },
    },
  },
  methods: {
    guessIcon(powerName) {
      var names = powerName.toLowerCase().replace(/_/g, '').split('.');
      //return 'img:/icon/' + names[1] + '_' + names[2] + '.png';
      return (
        'img:/icon/powers/' +
        names[1] +
        '/' +
        names[1] +
        '_' +
        names[2] +
        '.png'
      );
    },
    mouseenter(e, power) {
      this.store.uiSelectedPower = power;
    },
    async updatePowerset(powerset) {
      console.log('updatePowerset');
      await this.store.fetchPowerset(powerset);
      this.powers = powerset.powers;
      this.powersetPowersModel = []; //Trigger refresh
    },
    onSelectModelUpdate() {
      this.$emit('onSelectModelUpdate', this.powersetModel);
    },
  },
});
</script>

<style>
.no-page-break {
  page-break-inside: avoid;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  /* width: 100%; */
}

.powerset-card-expansion-item {
  overflow: hidden;
}

.powerset-card-expansion-item .q-item {
  padding: 2px 4px;
}

.powerset-card-list .q-item__section--avatar {
  min-width: 0px;
}

.powerset-card-list .q-item__section--side {
  padding-right: 5px;
}

.powerset-card-select {
  height: 24px;
  min-height: 24px;
  flex: 1 0 90%;
}

.powerset-card-select .q-field,
.powerset-card-select .q-field__control,
.powerset-card-select .q-field--auto-height .q-field__control,
.powerset-card-select .q-field--auto-height .q-field__native {
  height: 24px;
  min-height: 24px;
}

@media (min-width: 1024px) {
  .powerset-card-list {
    max-height: calc(var(--vh, 1vh) * 100 - 187px);
    overflow: auto;
  }
}
</style>
