<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Talon Planner </q-toolbar-title>

        <div>
          Quasar v{{ $q.version }}
          <br />
          {{ getGitHash }}
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-toolbar class="bg-primary text-white">
        <span>
          <q-btn flat dense round icon="menu" aria-label="Menu" />
          <q-tooltip>Dummy Menu</q-tooltip>
        </span>
        <q-space />
        <span>
          <q-btn
            flat
            round
            dense
            :icon="$q.platform.is.mobile ? 'install_mobile' : 'install_desktop'"
            @click="installPWA()"
            :disable="deferredPrompt == undefined"
          >
            <q-tooltip>Install PWA</q-tooltip>
          </q-btn>
        </span>
        <span>
          <q-btn
            flat
            round
            dense
            :icon="store.isFetching ? 'cloud_sync' : 'cloud_download'"
            @click="downloadDatabase()"
            :disable="store.isFetching"
          >
            <q-tooltip>Download Entire Database into App</q-tooltip>
          </q-btn>
        </span>
        <span>
          <q-toggle
            v-model="debugToggleModel"
            icon="report_problem"
            aria-label="Console Debug Toggle"
            color="red"
            @click="
              store.showDebugConsoleErrors = !store.showDebugConsoleErrors
            "
          />
          <q-tooltip>Console Error Toggle</q-tooltip>
        </span>
      </q-toolbar>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer elevated>
      <q-toolbar>
        <q-avatar>
          <img src="/icons/icon-512x512.png" />
        </q-avatar>
        <q-toolbar-title>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useTalonStore } from 'stores/talon-store';
import EssentialLink from 'components/EssentialLink.vue';
import { BeforeInstallPromptEvent } from 'vue-pwa-install';

const linksList = [
  {
    title: 'Docs',
    caption: 'Talon Site',
    icon: 'school',
    link: 'https://meeksoft.com/talon',
  },
  {
    title: 'Github',
    caption: 'github.com/meeksoft/Talon-Planner',
    icon: 'code',
    link: 'https://github.com/meeksoft/Talon-Planner',
  },
  {
    title: 'Homecoming Wiki',
    caption: 'homecoming.wiki',
    icon: 'chat',
    link: 'https://homecoming.wiki',
  },
  {
    title: 'Homecoming Forum',
    caption: 'forums.homecomingservers.com',
    icon: 'record_voice_over',
    link: 'https://forums.homecomingservers.com',
  },
  {
    title: 'Mids Reborn',
    caption: 'midsreborn.com',
    icon: 'rss_feed',
    link: 'https://midsreborn.com',
  },
  {
    title: 'City of Data v2.0',
    caption: 'cod.uberguy.net',
    icon: 'public',
    link: 'https://cod.uberguy.net',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

let deferredPrompt: BeforeInstallPromptEvent;

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
  },
  setup() {
    const store = useTalonStore();
    const leftDrawerOpen = ref(false);
    const debugToggleModel = ref(store.showDebugConsoleErrors);

    return {
      store,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      debugToggleModel,
      deferredPrompt,
    };
  },
  created() {
    window.addEventListener('canInstall', (e) => {
      console.log('App can be installed');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e as BeforeInstallPromptEvent;
    });
  },
  mounted() {
    window.addEventListener('appinstalled', (e) => {
      console.log('.App already installed');
    });
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('App can be prompted for install');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e as BeforeInstallPromptEvent;
    });
  },
  computed: {
    getGitHash() {
      return process.env.VUE_APP_GIT_HASH;
    },
  },
  methods: {
    async downloadDatabase() {
      this.store.fetchDatabaseAgain();
    },
    installPWA() {
      if (this.deferredPrompt != undefined) {
        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          //this.deferredPrompt = null;
        });
      }
    },
  },
});
</script>
