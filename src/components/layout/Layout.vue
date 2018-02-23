<template>
    <div>
        <navbar :value="drawer" @input="toggleDrawer"></navbar>
        <v-toolbar app>
          <v-toolbar app>
            <v-toolbar-side-icon @click.stop="toggleDrawer(!drawer)"></v-toolbar-side-icon>
            <v-toolbar-title>{{ $route.meta && $route.meta.totalname || $route.name }}</v-toolbar-title>
          </v-toolbar>
        </v-toolbar>

        <main>
            <v-content>
                <v-slide-y-transition mode="out-in">
                    <router-view></router-view>
                </v-slide-y-transition>
            </v-content>
        </main>
    </div>
</template>

<script>
import { VContent } from "vuetify/es5/components/VGrid";
import { VBtn, VIcon, VToolbar } from "vuetify/es5/components";
import {
	VToolbarSideIcon,
	VToolbarTitle
} from "vuetify/es5/components/VToolbar";
import { VSlideYTransition } from "vuetify/es5/components/transitions";
import { mapGetters, mapActions } from "vuex";
import Navbar from "./Navbar";

export default {
	components: {
		VToolbar,
		VToolbarSideIcon,
		VToolbarTitle,
		Navbar,
		VBtn,
		VIcon,
		VSlideYTransition,
		VContent
	},
	computed: mapGetters({
		drawer: "drawer"
	}),
	methods: {
		...mapActions({
			toggleDrawer: "toggleDrawer"
		})
	}
};
</script>

<style lang="stylus">
  @import '../../stylus/main'

  .button-float {
    position: fixed !important;
    z-index: 1000;
  }
</style>
