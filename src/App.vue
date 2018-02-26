<template>
  <v-app v-if="me && me.group === 'ADMIN'" :light="!darkTheme" :dark="darkTheme">
    <layout></layout>
  </v-app>
  <v-app v-else-if="me !== false" dark>
    <div class="unauthorized">
      <div class="unauthorized_image">
        <img src="https://media.giphy.com/media/njYrp176NQsHS/giphy.gif" frameBorder="0">
      </div>
      <h3>You are not allowed to see this page.</h3>
      <p v-if="me">Poor little {{ me.login }}...</p>
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
						login
					}
				}
			`,
			update: ({ me }) => me
		}
	}
};
</script>

<style lang="stylus">

  .unauthorized {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    
    .unauthorized_image {
      width: 100%;
      height: auto;
    }
    
    h3 {
    	text-align: center;
    }
    p {
    	text-align: center;
    }
  }
  
</style>
