<template>
    <v-navigation-drawer
      persistent
      :value="value"
      @input="value => $emit('input', value)"
      class="elevation-2"
      disable-route-watcher
      app
    >
      <div class="nav-content">
        <v-layout row wrap class="no-margin text-xs-center">
          <v-flex xs3>
            <v-btn icon @click.stop="$emit('input', !value)">
              <v-icon>menu</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <object data="/static/logo-animated.svg" type="image/svg+xml"></object>
          </v-flex>
        </v-layout>
        <v-list>
          <v-list-group
            v-for="(route, i) in routes.filter(r => !r.hide)" :key="i"
            v-if="route.submenus"
          >
            <v-list-tile slot="activator" :to="route.path">
              <v-list-tile-action>
                <v-icon v-html="route.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-html="route.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="submenu in route.submenus.filter(s => !s.hide)"
              :key="submenu.name"
              :to="submenu.path"
              exact
            >
              <v-list-tile-action>
                <v-icon v-html="submenu.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> {{ submenu.name }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="route.path">
            <v-list-tile-action>
              <v-icon v-html="route.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="route.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
      <div class="bottom">
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs4 offset-xs4>
            <v-switch label="Dark" :inputValue="darkTheme" @change="setDarkTheme"></v-switch>
          </v-flex>
        </v-layout>
      </div>
    </v-navigation-drawer>
</template>

<script>
import {
	VNavigationDrawer,
	VIcon,
	VBtn,
	VDivider,
	VSwitch
} from "vuetify/es5/components";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import {
	VList,
	VListGroup,
	VListTile,
	VListTileTitle,
	VListTileAction,
	VListTileContent
} from "vuetify/es5/components/VList";
import { mapGetters, mapActions } from "vuex";
import { routes } from "../../router";

export default {
	props: {
		value: Boolean
	},

	data() {
		return {
			routes
		};
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
		VBtn,
		VDivider,
		VSwitch
	},
	computed: mapGetters({
		darkTheme: "darkTheme"
	}),
	methods: mapActions({
		setDarkTheme: "setDarkTheme"
	})
};
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

  .nav-content {
    min-height: calc(100vh - 53px) !important;
    overflow-y: auto;
  }

  .bottom {
    bottom: 5px;
    width: 100%;
    .input-group__details {
      min-height: 0px;
    }
    .input-group {
      padding: 9px 0;
    }
  }

  .router-link {
    text-decoration: none;
    &.router-link-exact-active * {
       color: $main-color !important;
     }
  }

</style>
