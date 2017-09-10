<template>
    <v-navigation-drawer
      persistent
      :value="value"
      @input="value => $emit('input', value)"
      enable-resize-watcher
      class="elevation-2"
    >
      <v-list>
        <router-link
          v-for="(route, i) in routes.filter(r => !r.hide)"
          :key="i"
          :to="route.path"
          class="router-link"
        >
          <v-list-tile activeClass="">
            <v-list-tile-action>
              <v-icon v-html="route.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              {{ route.name }}
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    </div>
    </v-navigation-drawer>
</template>

<script>
import { VNavigationDrawer, VIcon } from 'vuetify/src/components'
import { VList, VListGroup, VListTile, VListTileAction, VListTileContent } from 'vuetify/src/components/VList'
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
  }
}
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

  .router-link {
    text-decoration: none;
    &.router-link-exact-active * {
      color: $main-color !important;
    }
  }

</style>
