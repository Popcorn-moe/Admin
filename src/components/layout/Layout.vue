<template>
    <div>
        <navbar :value="drawer" @input="toggleDrawer"></navbar>
        <toolbar></toolbar>

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
import { VSlideYTransition } from "vuetify/es5/components/transitions";
import { mapGetters, mapActions } from "vuex";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";

export default {
	components: {
		VSlideYTransition,
		VContent,
		Navbar,
		Toolbar
	},
	computed: mapGetters({
		drawer: "drawer"
	}),
	methods: mapActions({
		toggleDrawer: "toggleDrawer"
	})
};
</script>

<style lang="stylus">
  @import '../../stylus/main'

  .button-float {
    position: fixed !important;
    z-index: 1000;
  }
</style>
