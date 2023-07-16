/****************************************
 * Messy.  No OOP.
 ****************************************/
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

import {
  BuildSlot,
  Power,
  EnhancementSlot,
  BoostGroup,
  BoostSet,
  Boost,
  Archetype,
  Powerset,
  EmptyPower,
  EmptyBuildSlot,
} from 'src/components/models';

export const useTalonStore = defineStore('talon', {
  state: () => ({
    /* Interface */
    counter: 0,
    power: EmptyPower, //MouseEnter Power
    buildSlot: EmptyBuildSlot, //Selected Build Slot.
    levels: [], //Loaded from leveling.json; Used to help build Build

    fileTypeOptions: [
      { label: 'MBD 3.5.5.7', value: 'MBD' },
      { label: 'MXD (Legacy)', value: 'MXD' },
    ],
    exportFileTypeModel: ref({ label: 'MBD 3.5.5.7', value: 'MBD' }),

    /* Build */
    buildSlots: new Array<BuildSlot>(), //The Build.
    enhancementSlots: new Array<EnhancementSlot>(), //The Build

    /* Database */
    genericBoosts: new Array<Boost>(), //A Lookup for Generic Boosts.
    boostGroups: new Array<BoostGroup>(), //All the Boostgroups and sets and their boosts.
    archetypes: new Array<Archetype>(), //Archetypes->powersets=>powers
    pools: new Array<Powerset>(),
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchBoosts() {
      /* Read from our custom file to load all types of boosts */
      const response = await api.get('/json/talonplanner/boosts.json');
      this.genericBoosts.length = 0;
      response.data.generics.forEach((dataBoost: any) => {
        const boost = new Boost();
        boost.label = dataBoost.name;
        boost.value = dataBoost.type;
        boost.group = 'generic';
        const icon = dataBoost.icon.replace(/IO_/, 'TO_Training_');
        boost.icon = 'img:/icon/boosts/generic/' + icon;
        this.genericBoosts.push(boost);
      });

      this.boostGroups.length = 0;
      response.data.categories.forEach((dataBoost: any) => {
        const boostGroup = new BoostGroup();
        boostGroup.label = dataBoost.name;
        boostGroup.value = dataBoost.name.replace(/ /g, '_');
        boostGroup.icon = 'img:/icon/boosts/generic/' + dataBoost.icon;

        boostGroup.boost.label = dataBoost.name;
        boostGroup.boost.value = dataBoost.name.replace;
        boostGroup.boost.group = 'category';
        boostGroup.boost.icon = 'img:/icon/boosts/generic/' + dataBoost.icon;
        this.boostGroups.push(boostGroup);
      });
    },
    async fetchBoostsets() {
      /* Grab all Boostsets from index.json.
         We will compare this to the groups json. */
      const response = await api.get('/json/homecoming/boost_sets/index.json');
      const boostSets = [];
      for (let index = 0; index < response.data.set_names.length; index++) {
        const boostSet = new BoostSet();
        boostSet.value = response.data.set_names[index];
        boostSet.label = response.data.set_display_names[index];
        boostSets.push(boostSet);
      }

      /* Grab all groups from groups json
         We will compare listing */
      const res = await api.get('/json/homecoming/boostset_groups.json');
      const keys = Object.keys(res.data);
      for (const key of keys) {
        let foundKey = false;
        for (const boostGroup of this.boostGroups) {
          if (boostGroup.label == key) {
            foundKey = true;
          }
        }
        if (!foundKey) console.log('[' + key + ']');
      }

      /* Load JSON into Group */
      for (const boostGroup of this.boostGroups) {
        for (const boostSetData of res.data[boostGroup.label]) {
          const boostSet = new BoostSet();
          boostSet.label = boostSetData.display_name;
          boostSet.value = boostSetData.name;
          boostGroup.boostSets.push(boostSet);
        }
      }

      /* Load BoostSets */
      for (const boostGroup of this.boostGroups) {
        for (const boostSet of boostGroup.boostSets) {
          await api
            .get('/json/homecoming/boost_sets/' + boostSet.value + '.json')
            .then((res) => {
              boostSet.conversionGroups = res.data.conversion_groups;

              let icon = res.data.computed.icons[0];
              switch (boostSet.conversionGroups[0]) {
                case 'Rarity: Archetype':
                case 'Rarity: Superior Archetype':
                  icon = 'AO_' + boostSet.label.replace(/ /g, '_') + '.png';
                  break;
                case 'Rarity: Summer Blockbuster Double Feature':
                  icon = 'SBB_' + boostSet.label.replace(/ /g, '_') + '.png';
                  break;
                case 'Rarity: Winter Pack Series':
                case 'Rarity: Superior Winter Pack Series':
                  icon = 'WO_' + boostSet.label.replace(/ /g, '_') + '.png';
                  break;
                default:
                  icon = 'IO_' + boostSet.label.replace(/ /g, '_') + '.png';
                  break;
              }
              boostSet.icon = 'img:/icon/boosts/sets/' + icon;
              boostSet.bonuses = res.data.computed.bonuses;

              /* Load each boost */
              const numOfBoosts = res.data.boost_lists.length;
              for (let i = 0; i < numOfBoosts; i++) {
                const boost = new Boost();
                boost.label = res.data.computed.boosts[i][0];
                boost.group = boostGroup.value;
                boost.icon = boostSet.icon;
                boost.aspects = res.data.computed.boost_infos[i * 2];
                boostSet.boosts.push(boost);
              }
            })
            .catch((errors) => {
              console.log(errors);
            });
        }
      }
    },
    async fetchArchetypes() {
      this.archetypes.length = 0;
      const response = await api.get('/json/homecoming/archetypes/index.json');
      const archetypesData = response.data.player_archetypes;
      archetypesData.forEach((name: string) => {
        const archetype = new Archetype();
        archetype.label = name.replace(/_/g, ' ').toUpperCase();
        archetype.value = name;
        this.archetypes.push(archetype);
      });

      //Sort Array.
      this.archetypes = this.archetypes.sort((a1, a2) => {
        if (a1.label > a2.label) return 1;
        if (a2.label > a1.label) return -1;
        return 0;
      });

      for (const archetype of this.archetypes) {
        await api
          .get('/json/homecoming/archetypes/' + archetype.value + '.json')
          .then((res) => {
            archetype.primary = res.data.primary_category;
            archetype.secondary = res.data.secondary_category;
            archetype.description = res.data.display_help;
            archetype.brief = res.data.display_short_help;
            archetype.icon = 'img:/icon/archetypes/' + res.data.icon;
          })
          .catch((errors) => {
            console.log(errors);
          });
      }
    },
    async fetchPowersets() {
      for (const archetype of this.archetypes) {
        /* Loop once for Primary, once for Secondary */
        for (let calls = 0; calls < 2; calls++) {
          let apiCall = '';
          if (calls == 0) {
            apiCall =
              '/json/homecoming/powers/' + archetype.primary + '/index.json';
          } else {
            apiCall =
              '/json/homecoming/powers/' + archetype.secondary + '/index.json';
          }

          await api
            .get(apiCall)
            .then((res) => {
              for (
                let index = 0;
                index < res.data.powerset_display_names.length;
                index++
              ) {
                const a = res.data.powerset_names[index].split('.');
                const powersetFolder = a[0];
                const powerFolder = a[1];

                const powerset = new Powerset();
                powerset.label = res.data.powerset_display_names[index];
                powerset.value = res.data.powerset_names[index];
                powerset.powersetFolder = powersetFolder;
                powerset.powerFolder = powerFolder;
                powerset.icon = 'golf_course';
                powerset.powersetType = calls + 1;

                if (calls == 0) {
                  archetype.primaryPowersets.push(powerset);
                } else {
                  archetype.secondaryPowersets.push(powerset);
                }
              }
            })
            .catch((errors) => {
              console.log(errors);
            });
        }

        //Sort Arrays.
        archetype.primaryPowersets = archetype.primaryPowersets.sort(
          (a1, a2) => {
            if (a1.label > a2.label) return 1;
            if (a2.label > a1.label) return -1;
            return 0;
          }
        );
        archetype.secondaryPowersets = archetype.secondaryPowersets.sort(
          (a1, a2) => {
            if (a1.label > a2.label) return 1;
            if (a2.label > a1.label) return -1;
            return 0;
          }
        );

        //Load Powers
        for (const powerset of archetype.primaryPowersets) {
          await this.fetchPowerset(powerset);
        }
        for (const powerset of archetype.secondaryPowersets) {
          await this.fetchPowerset(powerset);
        }
      }
    },
    async fetchPowerset(powerset: Powerset) {
      // const powersetName = powerset.value.replace(/\./g, '/');
      // const categoryName = powersetName.split('/')[1].replace(/_/g, '');

      await api
        .get(
          '/json/homecoming/powers/' +
            powerset.powersetFolder +
            '/' +
            powerset.powerFolder +
            '/index.json'
        )
        .then((res) => {
          this.setPowersetIcon(powerset, res.data.icon);
          powerset.description = res.data.display_help;

          /* for each power */
          for (
            let index = 0;
            index < res.data.power_display_names.length;
            index++
          ) {
            const power = new Power();
            power.label = res.data.power_display_names[index];
            power.value = res.data.power_names[index];
            power.tooltip = res.data.power_short_helps[index];
            //power.icon: this.guessIcon(res.data.power_names[index]),
            power.level = res.data.available_level[index];
            power.powersetType = powerset.powersetType;
            powerset.powers.push(power);
          }
        })
        .catch((errors) => {
          console.log(errors);
        });

      for (const power of powerset.powers) {
        await this.fetchPower(power);
      }
    },
    async fetchPower(power: Power) {
      let powerName = power.value.replace(/\./g, '/');
      powerName = powerName.replace(/:/g, '_');

      await api
        .get('/json/homecoming/powers/' + powerName + '.json')
        .then((res) => {
          power.icon =
            'img:/icon/powers/' +
            // power.powerset.powerFolder.replace(/_/g, '') +
            // '/' +
            res.data.icon;
          power.description = res.data.display_help;
          power.requires = res.data.requires;
          power.boostsAllowed = res.data.boosts_allowed;
          power.allowedBoostsetCats = res.data.allowed_boostset_cats;

          power.boosts.length = 0;
          power.boostsAllowed.forEach((name) => {
            const boost = this.getBoost(name);
            if (boost == null) return false;
            power.boosts.push(boost);
          });
          power.allowedBoostsetCats.forEach((name) => {
            const boost = this.getBoost(name);
            if (boost == null) return false;
            power.boosts.push(boost);
          });
        })
        .catch((errors) => {
          console.log(errors);
        });
    },
    async fetchEpics() {
      const epics = new Array<Powerset>();
      const response = await api.get('/json/homecoming/powers/epic/index.json');

      for (
        let index = 0;
        index < response.data.powerset_names.length;
        index++
      ) {
        const a = response.data.powerset_names[index].split('.');
        const powersetFolder = a[0];
        const powerFolder = a[1];

        const powerset = new Powerset();
        powerset.label = response.data.powerset_display_names[index];
        powerset.value = response.data.powerset_names[index];
        powerset.powersetFolder = powersetFolder;
        powerset.powerFolder = powerFolder;
        powerset.icon = 'golf_course';
        powerset.powersetType = 4;

        epics.push(powerset);
      }

      for (const powerset of epics) {
        await this.fetchPowerset(powerset);
      }

      /* Match Epic to Archetype based on first power's requirements */
      for (const powerset of epics) {
        const power = powerset.powers[0];
        const requires = power.requires;
        const matches = requires.match(/@Class_[a-zA-Z_]+/g);
        if (matches) {
          for (const match of matches) {
            const name = match.replace(/@Class_/g, '').toLowerCase();
            const archetype = this.getArchetype(name);
            if (archetype != null) {
              archetype.epicPowersets.push(powerset);
            }
          }
        }
      }

      //Sort Arrays.
      for (const archetype of this.archetypes) {
        archetype.epicPowersets = archetype.epicPowersets.sort((a1, a2) => {
          if (a1.label > a2.label) return 1;
          if (a2.label > a1.label) return -1;
          return 0;
        });
      }
    },
    async fetchPools() {
      this.pools.length = 0;
      const response = await api.get('/json/homecoming/powers/pool/index.json');

      for (
        let index = 0;
        index < response.data.powerset_names.length;
        index++
      ) {
        const a = response.data.powerset_names[index].split('.');
        const powersetFolder = a[0];
        const powerFolder = a[1];

        const powerset = new Powerset();
        powerset.label = response.data.powerset_display_names[index];
        powerset.value = response.data.powerset_names[index];
        powerset.powersetFolder = powersetFolder;
        powerset.powerFolder = powerFolder;
        powerset.icon = 'golf_course';
        powerset.powersetType = 4;

        this.pools.push(powerset);
      }

      for (const powerset of this.pools) {
        await this.fetchPowerset(powerset);
      }

      //Sort Array.
      this.pools = this.pools.sort((a1, a2) => {
        if (a1.label > a2.label) return 1;
        if (a2.label > a1.label) return -1;
        return 0;
      });
    },
    buildEmptyBuild() {
      this.buildSlots.length = 0;
      this.enhancementSlots.length = 0;

      for (let index = 0; index < this.levels.length; index++) {
        const level = this.levels[index];

        /* Get all the power Slots */
        for (let numPowers = 0; numPowers < level['powers']; numPowers++) {
          const buildSlot = new BuildSlot();
          buildSlot.level = level['level'];
          buildSlot.powersetType = level['powers'] < 2 ? 0 : numPowers + 1;
          this.buildSlots.push(buildSlot);
        }

        /* Get all the enhancement slots */
        for (
          let numEnhancementSlots = 0;
          numEnhancementSlots < level['slots'];
          numEnhancementSlots++
        ) {
          const enhancementSlot = new EnhancementSlot();
          enhancementSlot.level = level['level'];
          this.enhancementSlots.push(enhancementSlot);
        }
      }
    },
    addPowerToBuild(selectedPower: Power) {
      if (selectedPower == undefined) selectedPower = this.power;
      if (selectedPower == undefined) return;
      if (selectedPower.assigned) return;

      /* Only add powers that can be slotted */
      if (selectedPower.level < 0) return;

      /* Has power already been added */
      let foundIt = false;
      for (let index = 0; index < this.buildSlots.length; index++) {
        const buildSlot: BuildSlot = this.buildSlots[index];
        const power: Power = buildSlot.power;

        if (power == selectedPower || power.value == selectedPower.value) {
          foundIt = true;
          break;
        }
      }
      if (foundIt) return;

      /* Attempt to add to selected BuildSlot */
      if (this.buildSlot.selected) {
        if (!this.canPowerBeAssignedToBuildSlot(selectedPower, this.buildSlot))
          return;

        this.assignPowerToBuildSlot(selectedPower, this.buildSlot);
        return;
      }

      /* Assign to first available slot. */
      for (let index = 0; index < this.buildSlots.length; index++) {
        const buildSlot: BuildSlot = this.buildSlots[index];

        if (!this.canPowerBeAssignedToBuildSlot(selectedPower, buildSlot))
          continue;

        this.assignPowerToBuildSlot(selectedPower, buildSlot);
        break;
      }
    },
    canPowerBeAssignedToBuildSlot(
      selectedPower: Power,
      selectedBuildSlot: BuildSlot
    ) {
      if (selectedBuildSlot.power.assigned) return; //Already has a Power.

      if (selectedBuildSlot.level < selectedPower.level + 1) return false;
      if (selectedBuildSlot.power.label.length > 0) return false; //if it's not available, continue;

      /* Handle slots that are only assigned to a powerset */
      if (
        selectedBuildSlot.powersetType > 0 &&
        selectedBuildSlot.powersetType != selectedPower.powersetType
      )
        return false;
      return true;
    },
    assignPowerToBuildSlot(selectedPower: Power, selectedBuildSlot: BuildSlot) {
      selectedBuildSlot.power = selectedPower;
      selectedBuildSlot.power.assigned = true;
      selectedBuildSlot.selected = false;
      if (selectedBuildSlot.enhancementSlots.length < 1) {
        selectedBuildSlot.enhancementSlots.push(new EnhancementSlot());
      }
    },
    removePowerFromBuild(selectedPower: Power) {
      //Find Powerslot in build.
      for (const buildSlot of this.buildSlots) {
        if (
          buildSlot.power == selectedPower ||
          buildSlot.power.value == selectedPower.value
        ) {
          this.removeBuildSlotFromBuild(buildSlot);
          break;
        }
      }
    },
    removeBuildSlotFromBuild(buildSlot: BuildSlot) {
      buildSlot.power.assigned = false; //Unassign from build.
      buildSlot.power = EmptyPower; //Clear power from powerslot.

      //Clear and clean up enhancement slots.
      for (let j = buildSlot.enhancementSlots.length - 1; j >= 0; j--) {
        const enhancementSlot =
          buildSlot.enhancementSlots.pop() as EnhancementSlot;
        enhancementSlot.assigned = false;
      }
    },
    addEnhancementSlotTo(buildSlot: BuildSlot) {
      if (buildSlot.enhancementSlots.length >= 6) return;

      for (let index = 0; index < this.enhancementSlots.length; index++) {
        const enhancementSlot = this.enhancementSlots[index];

        if (enhancementSlot.assigned) continue;
        if (enhancementSlot.level < buildSlot.level) continue;

        enhancementSlot.assigned = true;
        buildSlot.enhancementSlots.push(enhancementSlot);
        break;
      }
    },
    addEnhancementToSlot(
      selectedEnhancementSlot: EnhancementSlot,
      selectedBoost: Boost
    ) {
      selectedEnhancementSlot.enhancement = selectedBoost;
    },
    clearEnhancementSlotFrom(
      buildSlot: BuildSlot,
      selectedEnhancementSlot: EnhancementSlot
    ) {
      selectedEnhancementSlot.enhancement = new Boost();
    },
    removeEnhancementSlotFrom(
      buildSlot: BuildSlot,
      selectedEnhancementSlot: EnhancementSlot
    ) {
      if (selectedEnhancementSlot.level == -1) return;
      if (buildSlot.enhancementSlots.length < 2) return;

      selectedEnhancementSlot.level = -1;
      selectedEnhancementSlot.assigned = false;
      selectedEnhancementSlot.enhancement = new Boost();
      buildSlot.enhancementSlots = buildSlot.enhancementSlots.filter(
        (enhancementSlot) => enhancementSlot != selectedEnhancementSlot
      );
    },
    getBoost(name: string) {
      let foundBoost = null;
      this.genericBoosts.forEach((boost) => {
        if (boost.value == name) {
          foundBoost = boost;
          return false;
        }
      });
      if (foundBoost != null) return foundBoost;

      this.boostGroups.forEach((boostGroup) => {
        if (boostGroup.label == name) {
          foundBoost = boostGroup.boost;
          return false;
        }
      });
      return foundBoost;
    },
    getArchetype(name: string) {
      for (const archetype of this.archetypes) {
        if (archetype.value == name) {
          return archetype;
        }
      }
      return null;
    },
    setPowersetIcon(powerset: Powerset, name: string) {
      /* For powersets we ignore the entry
             and instead build using the powerset name */
      let icon = powerset.powerFolder + '_Set.png';

      for (const archetype of this.archetypes) {
        const val = archetype.value + '_';
        const re = new RegExp(val, 'g');
        icon = icon.replace(re, '');
      }

      powerset.icon = 'img:/icon/powers/' + icon;
    },
    selectBuildSlot(selectedBuildSlot: BuildSlot) {
      if (selectedBuildSlot.selected) {
        selectedBuildSlot.selected = false;
        return;
      }

      for (const buildSlot of this.buildSlots) {
        buildSlot.selected = false;
      }
      selectedBuildSlot.selected = true;
      this.buildSlot = selectedBuildSlot;
    },
    loadMBDObject(mbdObject: any) {
      console.log(mbdObject);
    },
  },
});
