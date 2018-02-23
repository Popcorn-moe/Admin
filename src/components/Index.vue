<template>
  <div>
    <v-toolbar
      dense
      color="primary"
      dark
      extended
      extension-height="300"
      flat
    >
      <v-toolbar-title class="mx-auto" slot="extension">
          <span>Welcome to Popcorn.moe Admin</span>
          <h2 class="white--text">All abuses start from here</h2>
          <v-layout row>
              <v-flex wrap>
                <v-btn outline large fab color="white" class="outine-2" :to="{ name: 'Users' }">
                  <v-icon large>people</v-icon>
                </v-btn>
              </v-flex>
              <v-flex wrap>
                <v-btn outline large fab color="white" class="outine-2" :to="{ name: 'List' }">
                  <v-icon large>video_library</v-icon>
                </v-btn>
              </v-flex>
              <v-flex wrap>
                <v-btn outline large fab color="white" class="outine-2" :to="{ name: 'News' }">
                  <v-icon large>equalizer</v-icon>
                </v-btn>
              </v-flex>
          </v-layout>
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
        <v-layout row>
            <v-flex xs12 md8 offset-md2>
                <v-card flat class="card--flex-toolbar" color="transparent">
                    <v-container fluid grid-list-lg>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md6 lg4 v-for="(item, i) in links" :key="i">
                                <v-card>
                                    <v-card-media
                                      height="125px"
                                      :class="item.color"
                                    >
                                    </v-card-media>
                                    <v-card-title primary-title>
                                        <div>
                                            <h3 class="headline mb-0">{{item.title}}</h3>
                                            <div>
                                                {{item.description}}
                                            </div>
                                        </div>
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn flat outline color="primary" :to="item.page">Go</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>

<script>
import { VBtn, VIcon } from "vuetify/es5/components";
import {
	VCard,
	VCardActions,
	VCardMedia,
	VCardTitle
} from "vuetify/es5/components/VCard";
import {
	VToolbar,
	VToolbarSideIcon,
	VToolbarTitle
} from "vuetify/es5/components/VToolbar";
import {
	VContainer,
	VFlex,
	VLayout,
	VSpacer
} from "vuetify/es5/components/VGrid";

export default {
	data() {
		return {
			links: [
				{
					title: "Users",
					page: "Users",
					description: "Manager Users and use fun tools like the Ban Hammer",
					color: "orange"
				},
				{
					title: "Animes",
					page: "List",
					description:
						"Manage our animes legally because they are not licensed",
					color: "teal"
				},
				{
					title: "News",
					page: "News",
					description:
						"Write news to our fellow users, to warn them about loli attacks",
					color: "blue"
				},
				{
					title: "Tags",
					page: "Tags",
					description: "Add tags to warn about users about shitty animes",
					color: "purple"
				},
				{
					title: "Authors",
					page: "Authors",
					description:
						"Manage authors ... well I don't have much to say about this",
					color: "black"
				}
			]
		};
	},
	components: {
		VBtn,
		VToolbar,
		VToolbarSideIcon,
		VToolbarTitle,
		VIcon,
		VContainer,
		VFlex,
		VLayout,
		VSpacer,
		VCard,
		VCardActions,
		VCardMedia,
		VCardTitle
	}
};
</script>

<style lang="stylus">
  @import "../stylus/main.styl";
</style>
