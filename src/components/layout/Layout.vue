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

        <error></error>
    </div>
</template>

<script>
import { VContent } from "vuetify/es5/components/VGrid";
import { VSlideYTransition } from "vuetify/es5/components/transitions";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import Error from "./Error";
import { mapGetters, mapActions } from "vuex";

export default {
	components: {
		VSlideYTransition,
		VContent,
		Navbar,
		Toolbar,
		Error
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

    .snackbar {
        .snack__content {
            padding: 0;
            height: inherit;
        }

        .alert {
            width: 100%;
            height: 100%;
            margin: 0;
        }
    }
</style>
