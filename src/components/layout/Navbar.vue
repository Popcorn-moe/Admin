<template>
    <v-navigation-drawer
      persistent
      :value="value"
      @input="value => $emit('input', value)"
      enable-resize-watcher
      class="elevation-2"
    >
      <v-layout row wrap class="no-margin text-xs-center">
        <v-flex xs2>
          <v-btn icon @click.stop="$emit('input', !value)">
            <v-icon>menu</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs8>
          <object data="/static/logo-animated.svg" type="image/svg+xml"></object>
        </v-flex>
      </v-layout>
      <v-list>
        <div v-for="(route, i) in routes.filter(r => !r.hide)" :key="i">
          <v-list-group v-if="route.submenus">
              <v-list-tile slot="item" :to="routes.path">
                <v-list-tile-action>
                  <v-icon v-html="route.icon"></v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-html="route.name"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <router-link
                v-for="submenu in route.submenus"
                :key="submenu.name"
                :to="route.path + '/' + submenu.path"
                class="router-link"
              >
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon v-html="submenu.icon"></v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title :to="submenu.path" v-html="submenu.name"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </router-link>
          </v-list-group>
          <router-link
            :to="route.path"
            class="router-link"
            v-else
          >
            <v-list-tile :to="routes.path">
                <v-list-tile-action>
                  <v-icon v-html="route.icon"></v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-html="route.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
          </router-link>
        </div>

      </v-list>
    </div>
    </v-navigation-drawer>
</template>

<script>
import { VNavigationDrawer, VIcon, VBtn } from 'vuetify/src/components'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'
import { VList, VListGroup, VListTile, VListTileTitle, VListTileAction, VListTileContent } from 'vuetify/src/components/VList'
import { routes } from '../../router'

export default {
  props: {
    value: Boolean
  },

  data() {
    return {
        routes
    }
  },

  components: {
    VNavigationDrawer,
    VIcon,
    VList,
    VListGroup,
    VListTile,
    VListTileAction,
    VListTileContent,
    VListTileTitle,
    VContainer,
    VFlex,
    VLayout,
    VBtn
  }
}
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

  .router-link {
    text-decoration: none;
    &.router-link-exact-active * {
       color: $main-color;
     }
  }

</style>
