<template>
  	<v-toolbar app color="primary" class="elevation-0 white--text">
		<v-toolbar-side-icon class="white--text" @click.stop="toggleDrawer(!drawer)"></v-toolbar-side-icon>
		<v-toolbar-title>
			<v-menu offset-y auto>
				<span slot="activator">{{ $route.meta.parent || $route.name }}</span>
				<v-list class="main-color" style="max-height: 200px; width: 100px;">
					<v-list-tile
						class="main-color"
						v-for="route in routes"
						:key="route.name"
						@click="$router.push(route.path)"
					>
						<v-list-tile-title>{{ route.name }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
			<span style="vertical-align: middle;" v-if="$route.meta.parent">/</span>
			<v-menu v-if="$route.meta.parent" offset-y auto>
				<span slot="activator">{{ $route.name }}</span>
				<v-list class="main-color" style="max-height: 200px; width: 100px;">
					<v-list-tile
						class="main-color"
						v-for="route in $route.meta.submenus"
						:key="route"
						@click="$router.push({ name: route })"
					>
						<v-list-tile-title>{{ route }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-avatar>
          <img :src="me && me.avatar" alt="avatar">
        </v-avatar>
	</v-toolbar>
</template>

<script>
import { VBtn, VIcon, VToolbar, VMenu, VAvatar } from "vuetify/es5/components";
import { VSpacer } from "vuetify/es5/components/VGrid";
import {
	VToolbarSideIcon,
	VToolbarTitle
} from "vuetify/es5/components/VToolbar";
import {
	VList,
	VListGroup,
	VListTile,
	VListTileTitle
} from "vuetify/es5/components/VList";
import { routes } from "../../router";
import gql from "graphql-tag";
import { mapGetters, mapActions } from "vuex";

export default {
	data() {
		return {
			routes,
			me: {
				avatar: null
			}
		};
	},
	computed: mapGetters({
		drawer: "drawer"
	}),
	methods: mapActions({
		toggleDrawer: "toggleDrawer"
	}),
	apollo: {
		me: {
			query: gql`
				{
					me {
						id
						avatar
					}
				}
			`,
			update: ({ me }) => me
		}
	},
	components: {
		VMenu,
		VSpacer,
		VAvatar,
		VToolbar,
		VToolbarSideIcon,
		VToolbarTitle,
		VBtn,
		VIcon,
		VList,
		VListGroup,
		VListTile,
		VListTileTitle
	}
};
</script>
