<template>
  <q-list bordered class="rounded-borders powerset-card-list">
    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      :default-opened="powerset && !$q.platform.is.mobile"
      expand-icon-toggle
      :icon="powerset ? powerset.icon : powersetModel.icon"
      :label="powerset ? powerset.label : powersetModel.label"
      header-class="bg-light-blue text-white"
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
            <div style="margin-top: -30px" class="text-white">
              <q-icon :name="powersetModel.icon" size="sm">
                <q-tooltip>{{ powersetModel.label }}</q-tooltip>
              </q-icon>
              {{ powersetModel.label }}
            </div>
          </template>
        </q-select>
      </template>

      <q-card class="no-border-radius q-pa-md no-margin">
        <q-list bordered dense class="rounded-borders text-primary">
          <div
            style="overflow: auto"
            v-if="!powerset"
            :key="powersetPowersModel"
          >
            <div v-for="(power, index) in powers" :key="index">
              <powerset-slot
                :power="power"
                zeroIndex
                @mouseenter="mouseenter($event, power)"
              ></powerset-slot>
            </div>
          </div>
          <div style="overflow: auto" v-if="powerset">
            <div v-for="(power, index) in powerset.powers" :key="index">
              <powerset-slot
                :power="power"
                zeroIndex
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
  props: {
    powersets: {
      type: Array,
    },
    powerset: {
      type: Object,
    },
  },
  setup() {
    const store = useTalonStore();
    const powers = [];

    return {
      store,
      powers,
      powersetModel: ref({ icon: '', label: 'Select Set' }),
      powersetPowersModel: ref(null),
    };
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
      this.store.power = power;
    },
    updatePowerset(powerset) {
      this.powers = powerset.powers;
      this.powersetPowersModel = []; //Trigger refresh
    },
  },
});
</script>

<style>
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
</style>
