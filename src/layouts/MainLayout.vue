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

        <q-toolbar-title> Talon Planer </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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
          <q-toggle
            v-model="debugToggleModel"
            icon="report_problem"
            aria-label="Console Debug Toggle"
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

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
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
    };
  },
});
</script>
