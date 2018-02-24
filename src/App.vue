<template>
  <v-app :light="!darkTheme" :dark="darkTheme">
    <layout v-if="me && me.group === 'ADMIN'"></layout>
    <div v-else-if="me === null" class="unauthorized">
      Unauthorized
      {{ me }}
    </div>
  </v-app>
</template>

<script>
import { VApp } from "vuetify/es5/components";
import { mapGetters } from "vuex";
import Layout from "./components/layout/Layout";
import gql from "graphql-tag";

export default {
	data() {
		return {
			me: false
		};
	},
	components: {
		Layout,
		VApp
	},
	computed: {
		...mapGetters({
			darkTheme: "darkTheme"
		})
	},
	apollo: {
		me: {
			query: gql`
				{
					me {
						group
					}
				}
			`,
			update: ({ me }) => me
		}
	}
};
</script>
