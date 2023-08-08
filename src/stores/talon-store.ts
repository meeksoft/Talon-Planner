/****************************************
 * Messy.  No OOP.
 ****************************************/
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import {
  BuildSlot,
  Power,
  EnhancementSlot,
  BoostGroup,
  BoostSet,
  Boost,
  Archetype,
  Powerset,
  EmptyBoost,
  EmptyPower,
  EmptyBuildSlot,
  MBDObject,
  PowerEntry,
  Enhancement,
  PowersetType,
  ILevel,
} from 'src/components/models';

export const useTalonStore = defineStore('talon', {
  state: () => ({
    $q: useQuasar(),

    //#region Interface
    /* Interface */
    counter: 0,
    showDebugConsoleErrors: true,

    uiSelectedPower: EmptyPower, //MouseEnter Power
    uiSelectedBuildSlot: EmptyBuildSlot, //Selected Build Slot.

    fetchLoadType: -1, //-1 is Don't load, 0 is don't await, 1 is await.
    isFetching: false,

    fileTypeOptions: [
      { label: 'MBD 3.5.5.7', value: 'MBD' },
      { label: 'MXD (Legacy)', value: 'MXD' },
    ],
    exportFileTypeModel: ref({ label: 'MBD 3.5.5.7', value: 'MBD' }),

    //#endregion Interface

    //#region Interface Load Build
    /* Interface -- Example: for loading a build */
    archetypeModel: new Archetype({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Archetype',
    }),
    primaryModel: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Primary Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    secondaryModel: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Secondary Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    epicModel: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Epic Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    pool1Model: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Pool Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    pool2Model: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Pool Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    pool3Model: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Pool Set',
      powers: [] as Power[],
      loadedN: false,
    }),
    pool4Model: new Powerset({
      icon: 'img:/icon/other/1332516744.svg',
      label: 'Select Pool Set',
      powers: [] as Power[],
      loadedN: false,
    }),

    originModel: ref({
      label: 'Select Origin',
      value: '',
      icon: 'img:/icon/other/1332516744.svg',
    }),
    originOptions: [
      {
        label: 'Magic',
        value: 'Magic',
        icon: 'img:/icon/other/Originicon_magic.png',
      },
      {
        label: 'Mutation',
        value: 'Mutation',
        icon: 'img:/icon/other/Originicon_mutation.png',
      },
      {
        label: 'Natural',
        value: 'Natural',
        icon: 'img:/icon/other/Originicon_natural.png',
      },
      {
        label: 'Science',
        value: 'Science',
        icon: 'img:/icon/other/Originicon_science.png',
      },
      {
        label: 'Technology',
        value: 'Technology',
        icon: 'img:/icon/other/Originicon_technology.png',
      },
    ],

    alignmentModel: ref({
      label: 'Select Alignment',
      value: '',
      icon: 'img:/icon/other/1332516744.svg',
    }),
    alignmentOptions: [
      {
        label: 'Hero',
        value: 'Hero',
        icon: 'img:/icon/other/Align_Status_Hero.png',
      },
      {
        label: 'Villain',
        value: 'Villain',
        icon: 'img:/icon/other/Align_Status_Villain.png',
      },
      {
        label: 'Vigilante',
        value: 'Vigilante',
        icon: 'img:/icon/other/Align_Status_Vigilante.png',
      },
      {
        label: 'Rogue',
        value: 'Rogue',
        icon: 'img:/icon/other/Align_Status_Rogue.png',
      },
      {
        label: 'Resistance',
        value: 'Resistance',
        icon: 'img:/icon/other/Align_Status_Resistance.png',
      },
      {
        label: 'Loyalist',
        value: 'Loyalist',
        icon: 'img:/icon/other/Align_Status_Loyalist.png',
      },
    ],
    //#endregion Interface Load Build

    /* Build */
    buildSlots: new Array<BuildSlot>(), //The Build.
    enhancementSlots: new Array<EnhancementSlot>(), //The Build
    inherentSlots: new Array<BuildSlot>(), //The Build

    /* Database */
    genericBoosts: new Array<Boost>(), //A Lookup for Generic Boosts.
    boostGroups: new Array<BoostGroup>(), //All the Boostgroups and sets and their boosts.
    archetypes: new Array<Archetype>(), //Archetypes->powersets=>powers
    pools: new Array<Powerset>(),
    inherents: new Array<Powerset>(),

    /* Export */
    mbdObject: new MBDObject(), //Reuseable.
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    notify(type: string, message: string) {
      //const $q = useQuasar();
      this.$q.notify({
        position: 'bottom-right',
        type: type,
        message: message,
        html: true,
      });
      if (this.showDebugConsoleErrors) {
        switch (type) {
          case 'negative':
            console.error('' + type + ': ' + message);
            break;

          case 'warning':
            console.warn('' + type + ': ' + message);
            break;

          case 'info':
            console.info('' + type + ': ' + message);
            break;

          default:
            console.log('' + type + ': ' + message);
            break;
        }
      }
    },
    //#region Utility
    toWordUpperCase(str: string, split: string, join: string): string {
      if (str == undefined || str == null || str.length < 1) return '';

      const words = str.split(split);
      for (let i = 0; i < words.length; i++) {
        words[i] =
          words[i][0].toUpperCase() + words[i].substring(1).toLowerCase();
      }
      return words.join(join);
    },
    toValueUpperCase(str: string) {
      if (str == undefined || str == null || str.length < 1) return '';
      const words = str.split('.');
      for (let i = 0; i < words.length; i++) {
        words[i] = this.toWordUpperCase(words[i], '_', '_');
      }
      return words.join('.');
    },
    //#endregion Utility
    //#region Fetch
    async fetchDatabase() {
      /* Clear anything that the individual functions won't clear.*/

      /* Begin Fetches */
      this.isFetching = true;
      const steps = 8;

      const notif = this.$q.notify({
        type: 'ongoing',
        color: 'info',
        position: 'bottom-right',
        caption: '0%',
        message: 'Loading Boosts.',
      });
      await this.fetchBoosts();

      notif({
        caption: `${(100 / steps).toFixed(0)}%`,
        message: 'Loading Boost sets.',
      });
      await this.fetchBoostsets(this.fetchLoadType);

      notif({
        caption: `${(200 / steps).toFixed(0)}%`,
        message: 'Loading Archetypes.',
      });
      await this.fetchArchetypes();

      notif({
        caption: `${(300 / steps).toFixed(0)}%`,
        message: 'Loading Power sets.',
      });
      await this.fetchPowersets(this.fetchLoadType);

      notif({
        caption: `${(400 / steps).toFixed(0)}%`,
        message: 'Loading Epics.',
      });
      await this.fetchEpics();

      notif({
        caption: `${(500 / steps).toFixed(0)}%`,
        message: 'Loading Pools.',
      });
      await this.fetchPools();

      // TODO: Temporary Powers
      notif({
        caption: `${(600 / steps).toFixed(0)}%`,
        message: 'Loading Temporary.',
      });

      notif({
        caption: `${(700 / steps).toFixed(0)}%`,
        message: 'Loading Inherits.',
      });
      await this.fetchInherents();
      //console.log(this.inherents);

      await this.mapBuildInherents(); //Add Inherents to Build.

      notif({
        type: 'positive',
        color: 'positive',
        caption: '100%',
        message: 'Loading is Pau!',
      });

      this.isFetching = false;
    },
    async fetchDatabaseAgain() {
      /* Clear anything that the individual functions won't clear.*/

      /* Begin Fetches */
      this.isFetching = true;
      let currentStep = 0;
      let maxSteps = 0;

      const notif = this.$q.notify({
        type: 'ongoing',
        color: 'pink-8',
        position: 'bottom-right',
        caption: '0%',
        message: '',
        html: true,
      });
      const notifMini = this.$q.notify({
        type: 'ongoing',
        color: 'pink-6',
        position: 'bottom-left',
        caption: '0%',
        message: '',
        html: true,
      });

      // Pools
      currentStep = 0;
      maxSteps = this.pools.length;
      for (const powerset of this.pools) {
        notif({
          caption: `${((currentStep * 100) / maxSteps).toFixed(0)}%`,
          message: 'Loading Pools',
        });
        notifMini({
          caption: '',
          message: `${powerset.label}`,
        });
        await this.fetchPowerset(powerset, 1);
        currentStep++;
      }

      // Archtype Powersets
      let atCurrentStep = 0;
      const atMaxSteps = this.archetypes.length;
      for (const archetype of this.archetypes) {
        // Primary
        currentStep = 0;
        maxSteps = archetype.primaryPowersets.length;
        for (const powerset of archetype.primaryPowersets) {
          notif({
            caption: `${((atCurrentStep * 100) / atMaxSteps).toFixed(0)}%`,
            message: `Loading ${archetype.label}`,
          });
          notifMini({
            caption: `${((currentStep * 100) / maxSteps).toFixed(0)}%`,
            message: `${powerset.label}`,
          });
          await this.fetchPowerset(powerset, 1);
          currentStep++;
        }
        // Secondary
        currentStep = 0;
        maxSteps = archetype.secondaryPowersets.length;
        for (const powerset of archetype.secondaryPowersets) {
          notif({
            caption: `${((atCurrentStep * 100) / atMaxSteps).toFixed(0)}%`,
            message: `Loading ${archetype.label}`,
          });
          notifMini({
            caption: `${((currentStep * 100) / maxSteps).toFixed(0)}%`,
            message: `${powerset.label}`,
          });
          await this.fetchPowerset(powerset, 1);
          currentStep++;
        }
        atCurrentStep++;
      }

      let bgCurrentStep = 0;
      const bgMaxSteps = this.boostGroups.length;
      for (const boostGroup of this.boostGroups) {
        currentStep = 0;
        maxSteps = this.pools.length;
        for (const boostSet of boostGroup.boostSets) {
          notif({
            caption: `${((bgCurrentStep * 100) / bgMaxSteps).toFixed(0)}%`,
            message: `Loading ${boostGroup.label}`,
          });
          notifMini({
            caption: `${((currentStep * 100) / maxSteps).toFixed(0)}%`,
            message: `${boostSet.label}`,
          });
          if (!boostSet.loaded) {
            await this.fetchBoostset(boostSet, boostGroup.value);
          }
          currentStep++;
        }
        bgCurrentStep++;
      }

      notif({
        type: 'positive',
        color: 'positive',
        caption: '100%',
        message: 'Downloading is Pau!',
      });
      notifMini({
        type: 'positive',
        color: 'positive',
        caption: '100%',
        message: 'Downloading is Pau!',
      });

      this.isFetching = false;
    },
    async fetchBoosts() {
      /* Read from our custom file to load all types of boosts */
      const response = await api.get('/json/talonplanner/boosts.json');
      this.genericBoosts.length = 0;
      for (const dataBoost of response.data.generics) {
        const boost = new Boost();
        boost.label = dataBoost.name;
        boost.value = dataBoost.type;
        boost.group = 'generic';
        const icon = dataBoost.icon.replace(/IO_/, 'TO_Training_');
        boost.icon = 'img:/icon/boosts/generic/' + icon;
        this.genericBoosts.push(boost);
      }

      this.boostGroups.length = 0;
      for (const dataBoost of response.data.categories) {
        const boostGroup = new BoostGroup();
        boostGroup.label = dataBoost.name;
        boostGroup.value = dataBoost.name.replace(/ /g, '_');
        boostGroup.icon = 'img:/icon/boosts/generic/' + dataBoost.icon;

        boostGroup.boost.label = dataBoost.name;
        boostGroup.boost.value = dataBoost.name.replace(/ /g, '_');
        boostGroup.boost.group = 'category';
        boostGroup.boost.icon = 'img:/icon/boosts/generic/' + dataBoost.icon;
        this.boostGroups.push(boostGroup);
      }
    },
    async fetchBoostsets(fetchLoadType = 1) {
      /* Grab all Boostsets from index.json.
         We will compare this to the groups json. */
      // const response = await api.get('/json/homecoming/boost_sets/index.json');
      // const boostSets = [];
      // for (let index = 0; index < response.data.set_names.length; index++) {
      //   const boostSet = new BoostSet();
      //   boostSet.value = response.data.set_names[index];
      //   boostSet.label = response.data.set_display_names[index];
      //   boostSets.push(boostSet);
      // }

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
          if (!boostSet.loaded) {
            switch (fetchLoadType) {
              case 0:
                this.fetchBoostset(boostSet, boostGroup.value);
                break;
              case 1:
                await this.fetchBoostset(boostSet, boostGroup.value);
                break;

              default:
                break;
            }
          }
        }
      }
    },
    async fetchBoostset(boostSet: BoostSet, groupName: string) {
      if (boostSet.loaded) return;

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
            boost.group = groupName;
            boost.icon = boostSet.icon;
            boost.aspects = res.data.computed.boost_infos[i * 2];
            boostSet.boosts.push(boost);
          }

          boostSet.loaded = true;
        })
        .catch((errors) => {
          console.log(errors);
        });
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

      /* Load individual archetype files */
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
    async fetchPowersets(fetchLoadType = 1) {
      /* Load Powerset */
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
          apiCall = apiCall.toLowerCase();

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
          switch (fetchLoadType) {
            case 0:
              this.fetchPowerset(powerset, this.fetchLoadType);
              break;
            case 1:
              await this.fetchPowerset(powerset, this.fetchLoadType);
              break;

            default:
              break;
          }
        }
        for (const powerset of archetype.secondaryPowersets) {
          switch (fetchLoadType) {
            case 0:
              this.fetchPowerset(powerset, this.fetchLoadType);
              break;
            case 1:
              await this.fetchPowerset(powerset, this.fetchLoadType);
              break;

            default:
              break;
          }
        }
      }
    },
    async fetchPowerset(powerset: Powerset, fetchLoadType = 1) {
      // const powersetName = powerset.value.replace(/\./g, '/');
      // const categoryName = powersetName.split('/')[1].replace(/_/g, '');

      if (powerset.loaded) {
        // console.info('Powerset already loaded: ' + powerset.label);
        return;
      }

      /* Load Powers for this Powerset */
      if (powerset.powers.length < 1) {
        const powersetPath = (
          '/json/homecoming/powers/' +
          powerset.powersetFolder +
          '/' +
          powerset.powerFolder +
          '/index.json'
        ).toLowerCase();
        await api
          .get(powersetPath)
          .then((res) => {
            this.setPowersetIcon(powerset);
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
      }

      for (const power of powerset.powers) {
        switch (fetchLoadType) {
          case 0:
            this.fetchPower(power);
            break;
          case 1:
            await this.fetchPower(power);
            break;

          default:
            break;
        }
      }
    },
    async fetchPower(power: Power) {
      let powerName = power.value.replace(/\./g, '/');
      powerName = powerName.replace(/:/g, '_');

      const powerPath = (
        '/json/homecoming/powers/' +
        powerName +
        '.json'
      ).toLowerCase();
      await api
        .get(powerPath)
        .then((res) => {
          power.icon =
            'img:/icon/powers/' +
            // power.powerset.powerFolder.replace(/_/g, '') +
            // '/' +
            res.data.icon;
          power.icon = power.icon.toLowerCase();
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
          power.loaded = true;
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
        powerset.powersetType = PowersetType.EPIC;

        epics.push(powerset);
      }

      for (const powerset of epics) {
        await this.fetchPowerset(powerset, 1);
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
        powerset.powersetType = PowersetType.POOL;

        this.pools.push(powerset);
      }

      for (const powerset of this.pools) {
        await this.fetchPowerset(powerset, this.fetchLoadType);
      }

      //Sort Array.
      this.pools = this.pools.sort((a1, a2) => {
        if (a1.label > a2.label) return 1;
        if (a2.label > a1.label) return -1;
        return 0;
      });
    },
    // TODO: Implement fetchInherits()
    async fetchInherents() {
      this.inherents.length = 0;
      const response = await api.get(
        '/json/homecoming/powers/inherent/index.json'
      );

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
        powerset.powersetType = PowersetType.INHERIT;

        this.inherents.push(powerset);
      }

      for (const powerset of this.inherents) {
        await this.fetchPowerset(powerset, this.fetchLoadType);
      }

      //Sort Array.
      this.inherents = this.inherents.sort((a1, a2) => {
        if (a1.label > a2.label) return 1;
        if (a2.label > a1.label) return -1;
        return 0;
      });
    },
    //#endregion Fetch
    //#region Build Build
    async fetchBuildLevels() {
      const response = await api.get('/json/talonplanner/leveling.json');
      const levels = [];

      /* Save Levels Information */
      let level = {};
      for (let index = 0; index < response.data.levels.length; index++) {
        level = {
          level: response.data.levels[index].level,
          powers: response.data.levels[index].powers,
          slots: response.data.levels[index].slots,
        };
        levels.push(level);
      }

      const inherentsList = [];
      for (let index = 0; index < response.data.inherents.length; index++) {
        inherentsList.push(response.data.inherents[index]);
      }

      this.buildEmptyBuild(levels as Array<ILevel>, inherentsList);
    },
    buildEmptyBuild(levels: Array<ILevel>, inherentsList: Array<string>) {
      this.buildSlots.length = 0;
      this.enhancementSlots.length = 0;

      for (let index = 0; index < levels.length; index++) {
        const level = levels[index];

        /* Get all the power Slots */
        for (let numPowers = 0; numPowers < level['powers']; numPowers++) {
          const buildSlot = new BuildSlot();
          buildSlot.level = level['level'];
          buildSlot.powersetType =
            level['powers'] < 2 ? PowersetType.ANY : numPowers + 1;
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

      this.inherentSlots.length = 0;
      for (const inherentItem of inherentsList) {
        const buildSlot = new BuildSlot();
        buildSlot.disabled = true;
        buildSlot.powersetType = PowersetType.INHERIT;
        const power = new Power();
        power.value = inherentItem;
        buildSlot.power = power;
        this.inherentSlots.push(buildSlot);
      }
    },
    async mapBuildInherents() {
      for (const buildSlot of this.inherentSlots) {
        for (const powerset of this.inherents) {
          for (const power of powerset.powers) {
            if (power.value == buildSlot.power.value) {
              buildSlot.disabled = false;
              buildSlot.level = power.level + 1; //Zero Indexed Powers
              this.assignPowerToBuildSlot(power, buildSlot);
              if (!power.loaded) {
                await this.fetchPower(power);
              }
            }
          }
          if (!buildSlot.disabled) break;
        }
      }
    },
    emptyBuild() {
      for (const buildSlot of this.buildSlots) {
        this.emptyBuildSlot(buildSlot);
      }

      /* Only remove enhancement slots, not powers */
      for (const buildSlot of this.inherentSlots) {
        this.emptyBuildSlot(buildSlot, false);
      }

      for (const enhancementSlot of this.enhancementSlots) {
        enhancementSlot.assigned = false;
        enhancementSlot.boost = EmptyBoost;
      }
    },
    //#endregion Build Build
    emptyBuildSlot(buildSlot: BuildSlot, willEmptyPower = true) {
      if (buildSlot.enhancementSlots.length > 0) {
        if (willEmptyPower) {
          if (buildSlot.power.label.length > 0) {
            buildSlot.power.assigned = false; //Unassign from build
          }
          buildSlot.power = EmptyPower; //Clear power from powerslot.
        }

        buildSlot.enhancementSlots[0].boost = EmptyBoost;

        for (let i = buildSlot.enhancementSlots.length - 1; i > 0; i--) {
          this.removeEnhancementSlotFrom(
            buildSlot,
            buildSlot.enhancementSlots[i]
          );
        }
      }
    },
    addPowerToBuild(selectedPower: Power): BuildSlot | null {
      if (selectedPower == undefined) selectedPower = this.uiSelectedPower;
      if (selectedPower == undefined) return null;
      if (selectedPower.assigned) return null;

      /* Only add powers that can be slotted */
      if (selectedPower.level < 0) return null;

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
      if (foundIt) return null;

      /* Attempt to add to selected BuildSlot */
      if (this.uiSelectedBuildSlot.selected) {
        if (
          !this.canPowerBeAssignedToBuildSlot(
            selectedPower,
            this.uiSelectedBuildSlot
          )
        )
          return null;

        this.assignPowerToBuildSlot(selectedPower, this.uiSelectedBuildSlot);
        return this.uiSelectedBuildSlot;
      }

      /* Assign to first available slot. */
      for (let index = 0; index < this.buildSlots.length; index++) {
        const buildSlot: BuildSlot = this.buildSlots[index];

        if (!this.canPowerBeAssignedToBuildSlot(selectedPower, buildSlot))
          continue;

        this.assignPowerToBuildSlot(selectedPower, buildSlot);
        return buildSlot;
      }

      return null;
    },
    canPowerBeAssignedToBuildSlot(
      selectedPower: Power,
      selectedBuildSlot: BuildSlot
    ): boolean {
      if (selectedBuildSlot.power.assigned) return false; //Already has a Power.

      if (selectedBuildSlot.level < selectedPower.level + 1) return false;
      if (selectedBuildSlot.power.label.length > 0) return false; //if it's not available, continue;

      /* Handle slots that are only assigned to a powerset */
      if (
        selectedBuildSlot.powersetType > PowersetType.ANY &&
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
          this.emptyBuildSlot(buildSlot);
          break;
        }
      }
    },
    addNextAvailableEnhancementSlotTo(buildSlot: BuildSlot) {
      if (buildSlot.enhancementSlots.length >= 6) return;

      for (let index = 0; index < this.enhancementSlots.length; index++) {
        const enhancementSlot = this.enhancementSlots[index];

        if (enhancementSlot.assigned) continue;
        if (enhancementSlot.level < buildSlot.level) continue;

        this.addEnhancementSlotTo(enhancementSlot, buildSlot);
        break;
      }
    },
    addEnhancementSlotTo(
      enhancementSlot: EnhancementSlot,
      buildSlot: BuildSlot
    ) {
      enhancementSlot.assigned = true;
      buildSlot.enhancementSlots.push(enhancementSlot);
    },
    addEnhancementToSlot(
      selectedEnhancementSlot: EnhancementSlot,
      selectedBoost: Boost
    ) {
      selectedEnhancementSlot.boost = selectedBoost;
    },
    clearEnhancementSlotFrom(
      buildSlot: BuildSlot,
      selectedEnhancementSlot: EnhancementSlot
    ) {
      selectedEnhancementSlot.boost = EmptyBoost;
    },
    removeEnhancementSlotFrom(
      buildSlot: BuildSlot,
      selectedEnhancementSlot: EnhancementSlot
    ) {
      if (selectedEnhancementSlot.level == -1) return;
      if (buildSlot.enhancementSlots.length < 2) return;

      selectedEnhancementSlot.assigned = false;
      selectedEnhancementSlot.boost = EmptyBoost;
      buildSlot.enhancementSlots = buildSlot.enhancementSlots.filter(
        (enhancementSlot) => enhancementSlot != selectedEnhancementSlot
      );
    },
    getOrigin(name: string) {
      for (const origin of this.originOptions) {
        if (origin.label == name) return origin;
      }
      return null;
    },
    getAlignment(name: string) {
      for (const alignment of this.alignmentOptions) {
        if (alignment.label == name) return alignment;
      }
      return null;
    },
    // TODO: Add more Boost Types
    getBoost(name: string): Boost | null {
      // BUG: Hack to support unsupported enhancements.
      name = name.replace(/Invention: /g, '');
      let foundBoost = null;

      this.boostGroups.forEach((boostGroup) => {
        if (boostGroup.label == name) {
          foundBoost = boostGroup.boost;
          return false;
        }
      });
      if (foundBoost != null) return foundBoost;

      this.genericBoosts.forEach((boost) => {
        if (boost.value == name || boost.label == name) {
          foundBoost = boost;
          return false;
        }
      });
      if (foundBoost != null) return foundBoost;

      console.log('getBoost: Not found: ' + name);
      return foundBoost;
    },
    // TODO: Get Archetype by name or value, etc.
    getArchetype(name: string): Archetype | null {
      name = name.toLowerCase();
      for (const archetype of this.archetypes) {
        if (name.indexOf(archetype.value) >= 0) {
          return archetype;
        }
      }
      return null;
    },
    getBuildSlotByLevel(level: number, isEmpty: boolean): BuildSlot | null {
      for (const buildSlot of this.buildSlots) {
        if (buildSlot.level > level) break; //Slots are ordered.
        if (buildSlot.level == level) {
          if (!isEmpty) return buildSlot;
          if (buildSlot.power == undefined || buildSlot.power.label.length < 1)
            return buildSlot;
          else continue;
        }
      }
      return null;
    },
    /* Only searches added slots, not free ones per power */
    getEnhancementSlotByLevel(
      level: number,
      isEmpty: boolean
    ): EnhancementSlot | null {
      for (const enhancementSlot of this.enhancementSlots) {
        if (enhancementSlot.level > level) break; //Slots are ordered.
        if (enhancementSlot.level == level) {
          if (!isEmpty) return enhancementSlot;
          if (
            !enhancementSlot.assigned ||
            enhancementSlot.boost == undefined ||
            enhancementSlot.boost.label.length < 1
          )
            return enhancementSlot;
          else continue;
        }
      }
      return null;
    },
    setPowersetIcon(powerset: Powerset) {
      /* For powersets we ignore the entry
             and instead build using the powerset name */
      let icon = powerset.powerFolder + '_Set.png';

      for (const archetype of this.archetypes) {
        const val = archetype.value + '_';
        const re = new RegExp(val, 'g');
        icon = icon.replace(re, '');
      }

      powerset.icon = 'img:/icon/powers/' + icon;
      powerset.icon = powerset.icon.toLowerCase();
    },
    assignUIBuildSlot(selectedBuildSlot: BuildSlot) {
      if (selectedBuildSlot.selected) {
        selectedBuildSlot.selected = false;
        return;
      }

      for (const buildSlot of this.buildSlots) {
        buildSlot.selected = false;
      }
      selectedBuildSlot.selected = true;
      this.uiSelectedBuildSlot = selectedBuildSlot;
    },
    getPowerFromSelectedModels(selectedPowerValue: string): Power | null {
      if (
        selectedPowerValue == undefined ||
        selectedPowerValue == null ||
        selectedPowerValue.length < 1
      )
        return null;

      for (const power of this.primaryModel.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.secondaryModel.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.epicModel.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.pool1Model.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.pool2Model.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.pool3Model.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const power of this.pool4Model.powers) {
        if (power.value == selectedPowerValue) {
          return power;
        }
      }
      for (const powerset of this.inherents) {
        for (const power of powerset.powers) {
          if (power.value == selectedPowerValue) {
            return power;
          }
        }
      }

      return null;
    },
    loadMBDObject(mbdObject: MBDObject) {
      console.log(mbdObject);

      /* Set UI Origin */
      const origin = this.getOrigin(mbdObject.Origin);
      if (!origin) {
        this.notify('negative', 'Unknown Origin ' + mbdObject.Origin);
      } else {
        this.originModel = origin;
      }

      /* Set Alignment */
      const alignment = this.getAlignment(mbdObject.Alignment);
      if (!alignment) {
        this.notify('negative', 'Unknown Alignment ' + mbdObject.Alignment);
      } else {
        this.alignmentModel = alignment;
      }

      /* Set UI Archetype */
      const archetype = this.getArchetype(mbdObject.Class);
      if (!archetype) {
        this.notify('negative', 'Unknown Archetype ' + mbdObject.Class);
        return;
      }
      this.archetypeModel = archetype;

      /* Set UI Power Sets */
      let poolModelIndex = 1;
      const powersetArray = mbdObject.PowerSets.map((e: string) =>
        e.toLowerCase()
      );
      for (const powersetValue of powersetArray) {
        if (powersetValue.length < 1) continue;

        let foundIt = false;

        for (const powerset of archetype.primaryPowersets) {
          if (powerset.value == powersetValue) {
            foundIt = true;
            this.primaryModel = powerset;
            break;
          }
        }
        if (foundIt) continue;

        for (const powerset of archetype.secondaryPowersets) {
          if (powerset.value == powersetValue) {
            foundIt = true;
            this.secondaryModel = powerset;
            break;
          }
        }
        if (foundIt) continue;

        for (const powerset of archetype.epicPowersets) {
          if (powerset.value == powersetValue) {
            foundIt = true;
            this.epicModel = powerset;
            break;
          }
        }
        if (foundIt) continue;

        for (const powerset of this.pools) {
          if (powerset.value == powersetValue) {
            foundIt = true;
            switch (poolModelIndex) {
              case 1:
                this.pool1Model = powerset;
                break;

              case 2:
                this.pool2Model = powerset;
                break;

              case 3:
                this.pool3Model = powerset;
                break;

              case 4:
                this.pool4Model = powerset;
                break;

              default:
                break;
            }
            poolModelIndex++;
            break;
          }
        }
        if (foundIt) continue;
      }

      /* Assign Powers to Build Slots */
      for (const powerEntry of mbdObject.PowerEntries) {
        const powerName = powerEntry.PowerName;
        if (
          powerName == undefined ||
          powerName == null ||
          powerName.length < 1 ||
          powerEntry.Level < 0
        )
          continue;

        const power = this.getPowerFromSelectedModels(powerName);
        if (power == null) {
          this.notify('negative', 'Unknown Power ' + powerName);
          continue;
        }

        let buildSlot = null;
        if (power.powersetType == PowersetType.INHERIT) {
          for (const iSlot of this.inherentSlots) {
            if (iSlot.power == power) {
              buildSlot = iSlot;
              break;
            }
          }
        } else {
          buildSlot = this.getBuildSlotByLevel(
            powerEntry.Level,
            powerEntry.Level == 1
          );

          if (buildSlot != null) this.assignPowerToBuildSlot(power, buildSlot);
        }

        if (buildSlot == null) {
          this.notify(
            'negative',
            'Unable to find Build Slot for ' + powerEntry.PowerName
          );
          continue;
        }

        /* Assign Enhancement Slots */
        for (let i = 0; i < powerEntry.SlotEntries.length; i++) {
          let enhancementSlot = null;
          if (i > 0) {
            enhancementSlot = this.getEnhancementSlotByLevel(
              powerEntry.SlotEntries[i].Level,
              true
            );
            if (enhancementSlot == null) {
              this.notify(
                'negative',
                'Unable to find Enhancement Slot for ' + powerEntry.PowerName
              );
              continue;
            }
            this.addEnhancementSlotTo(enhancementSlot, buildSlot);
          } else {
            enhancementSlot = buildSlot.enhancementSlots[0];
          }

          /* Assign Enhancement */
          const iEnhancement = powerEntry.SlotEntries[i].Enhancement;
          if (iEnhancement == null) continue;

          const enhancementName = iEnhancement.Enhancement;
          const enhancement = this.getBoost(enhancementName);
          if (enhancement == null) {
            this.notify('negative', 'Unknown Enhancement ' + enhancementName);
            continue;
          }

          enhancementSlot.boost = enhancement;
        }
      }
    },
    createMBDObject() {
      this.mbdObject.Origin = this.originModel.value;
      this.mbdObject.Alignment = this.alignmentModel.value;

      this.mbdObject.Class =
        'Class_' + this.toWordUpperCase(this.archetypeModel.label, ' ', '_');

      this.mbdObject.PowerSets.length = 0;
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.primaryModel.value)
      );
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.secondaryModel.value)
      );
      this.mbdObject.PowerSets.push('');
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.pool1Model.value)
      );
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.pool2Model.value)
      );
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.pool3Model.value)
      );
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.pool4Model.value)
      );
      this.mbdObject.PowerSets.push(
        this.toValueUpperCase(this.epicModel.value)
      );

      this.mbdObject.PowerEntries.length = 0;
      for (const buildSlot of this.buildSlots) {
        const powerEntry = this.createMBDPowerEntry(buildSlot);
        this.mbdObject.PowerEntries.push(powerEntry);
      }
      for (const buildSlot of this.inherentSlots) {
        const powerEntry = this.createMBDPowerEntry(buildSlot);
        this.mbdObject.PowerEntries.push(powerEntry);
      }

      console.log(this.mbdObject);
    },
    createMBDPowerEntry(buildSlot: BuildSlot): PowerEntry {
      const powerEntry = new PowerEntry();
      powerEntry.PowerName = buildSlot.power.value;
      powerEntry.Level = buildSlot.level;

      powerEntry.SlotEntries.length = 0;
      for (const enhancementSlot of buildSlot.enhancementSlots) {
        let enhancement = null;
        if (
          enhancementSlot.boost != null &&
          //enhancementSlot.assigned &&
          enhancementSlot.boost.label.length > 0
        ) {
          enhancement = new Enhancement();
          enhancementSlot.level < 1 ? buildSlot.level : enhancementSlot.level;
          enhancement.Enhancement = enhancementSlot.boost.label;
        }

        const slotEntry = {
          Level:
            enhancementSlot.level < 1 ? buildSlot.level : enhancementSlot.level,
          IsInherent: false,
          Enhancement: enhancement,
          FlippedEnhancement: null,
        };

        slotEntry.Level =
          enhancementSlot.level < 1 ? buildSlot.level : enhancementSlot.level;
        powerEntry.SlotEntries.push(slotEntry);
      }

      return powerEntry;
    },
  },
});
