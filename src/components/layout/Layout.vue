<template>
    <div>
        <navbar :value="drawer" @input="toggleDrawer"></navbar>
        <v-btn v-if="!drawer" fab @click.stop="toggleDrawer(!drawer)" class="button-float main-color" small>
            <v-icon>menu</v-icon>
        </v-btn>
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
import { VBtn, VIcon } from "vuetify/es5/components";
import { VSlideYTransition } from "vuetify/es5/components/transitions";
import { mapGetters, mapActions } from "vuex";
import Navbar from "./Navbar";

export default {
	components: {
		Navbar,
		VBtn,
		VIcon,
		VSlideYTransition,
		VContent
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
