<template>
  <div v-if="anime" class="edit-page">
	<anime-head
		:names="anime.names"
		:cover="anime.background"
		:poster="anime.cover"
		@setCover="file => anime.background = file"
		@setPoster="file => anime.cover = file"
	></anime-head>
	<v-container>
		<v-layout row fluid>
			<v-flex offset-md1 md10>
				<v-card>
					<v-toolbar card prominent>
						<v-toolbar-title class="body-2 grey--text">Seasons</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn icon @click.stop="newSeason.dialog = true">
							<v-icon>add</v-icon>
						</v-btn>
					</v-toolbar>
					<v-divider></v-divider>
					<v-expansion-panel popout>
						<v-expansion-panel-content v-for="(season,i) in anime.seasons" :key="i" v-if="season">
						<div slot="header">Season {{ i + 1 }}: {{ season.name }}</div>
						<v-card>
							<v-toolbar card prominent>
								<v-toolbar-title class="body-2 grey--text">Episodes</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn icon @click.stop="addEpisode(i)">
									<v-icon>add</v-icon>
								</v-btn>
								<v-btn icon>
									<v-icon>apps</v-icon>
								</v-btn>
								<v-btn icon @click.stop="saveEpisodes(i)">
									<v-icon>save</v-icon>
								</v-btn>
							</v-toolbar>
							<v-data-table
								:headers="episodesHeaders"
								:items="season.episodes"
								hide-actions
								class="elevation-1"
							>
								<template slot="items" slot-scope="props">
									<td>{{ props.index + 1 }}</td>
									<td>
										<v-edit-dialog lazy>
											{{ props.item.name || "(empty)" }}
											<v-text-field
												slot="input"
												v-model="props.item.name"
												@change="() => props.item.changed = true"
												single-line
											></v-text-field>
										</v-edit-dialog>
									</td>
									<td>{{ props.item.type }}</td>
									<td>{{ props.item.posted_date }}</td>
									<td>
										<v-edit-dialog lazy>
											{{ props.item.content || "(empty)" }}
											<v-text-field
												slot="input"
												v-model="props.item.content"
												@change="() => props.item.changed = true"
												single-line
											></v-text-field>
										</v-edit-dialog>
									</td>
								</template>
							</v-data-table>
						</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-card>
			</v-flex>
		</v-layout>
		<v-dialog v-model="newSeason.dialog" max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Add Season</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout wrap>
							<v-flex xs12>
								<v-text-field label="Name"  v-model="newSeason.name" required></v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-text-field label="Season" type="number" v-model="newSeason.season" required></v-text-field>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" flat @click.native="addSeason">Add</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
  </div>
</template>

<script>
import {
	VSubheader,
	VDivider,
	VBtn,
	VIcon,
	VDialog,
	VTextField,
	VDataTable
} from "vuetify/es5/components";
import {
	VCard,
	VCardTitle,
	VCardText,
	VCardActions
} from "vuetify/es5/components/VCard";
import { VToolbar, VToolbarTitle } from "vuetify/es5/components/VToolbar";
import {
	VContainer,
	VLayout,
	VFlex,
	VSpacer
} from "vuetify/es5/components/VGrid";
import {
	VExpansionPanel,
	VExpansionPanelContent
} from "vuetify/es5/components/VExpansionPanel";
import VEditDialog from "vuetify/es5/components/VDataTable/VEditDialog";
import AnimeHead from "./AnimeHead";
import gql from "graphql-tag";
import clone from "clone";

export default {
	props: ["id"],
	data() {
		return {
			anime: null,
			newSeason: {
				dialog: false,
				name: null,
				season: 0
			},
			episodesHeaders: [
				{ text: "Episode", value: "idx" },
				{ text: "Name", value: "name" },
				{ text: "Type", value: "type" },
				{ text: "Posted Date", value: "posted_date" },
				{ text: "Content", value: "content" }
			]
		};
	},
	methods: {
		addSeason() {
			this.newSeason.dialog = false;
			this.$apollo
				.mutate({
					mutation: gql`
						mutation($anime: ID!, $season: SeasonInput!) {
							season: addSeason(anime: $anime, season: $season) {
								name
							}
						}
					`,
					variables: {
						anime: this.anime.id,
						season: {
							name: this.newSeason.name,
							season: this.newSeason.season
						}
					}
				})
				.then(_ => this.$apollo.queries.anime.refetch());
			this.newSeason.name = null;
			this.newSeason.season = 0;
		},
		addEpisode(season) {
			this.$apollo
				.mutate({
					mutation: gql`
						mutation(
							$media: MediaInput!
							$anime: ID!
							$season: Int!
							$episode: Int!
						) {
							addMedia(media: $media) {
								linkTo(anime: $anime, season: $season, episode: $episode)
							}
						}
					`,
					variables: {
						anime: this.anime.id,
						season,
						episode: this.anime.seasons[season].episodes.length,
						media: {
							type: "EPISODE"
						}
					}
				})
				.then(_ => this.$apollo.queries.anime.refetch());
		},
		saveEpisodes(season) {
			const toSave = this.anime.seasons[season].episodes.filter(e => e.changed);
			toSave.forEach(e => delete e.changed);
			Promise.all(
				toSave.map(({ id, name, type, content }) => {
					return this.$apollo.mutate({
						mutation: gql`
							mutation($id: ID!, $media: MediaUpdate!) {
								updateMedia(id: $id, media: $media)
							}
						`,
						variables: {
							id,
							media: { name, type, content }
						}
					});
				})
			).then(_ => this.$apollo.queries.anime.refetch());
		}
	},
	apollo: {
		anime: {
			query: gql`
				query($id: ID!) {
					anime(id: $id) {
						id
						names
						cover
						background
						authors {
							id
							name
						}
						seasons {
							name
							episodes {
								id
								name
								type
								posted_date
								content
							}
						}
					}
				}
			`,
			variables() {
				return {
					id: this.id
				};
			},
			update: ({ anime }) => clone(anime)
		}
	},
	components: {
		VSubheader,
		VDivider,
		VBtn,
		VIcon,
		VDialog,
		VTextField,
		VDataTable,
		VCard,
		VCardTitle,
		VCardText,
		VCardActions,
		VToolbar,
		VToolbarTitle,
		VContainer,
		VLayout,
		VFlex,
		VSpacer,
		VExpansionPanel,
		VExpansionPanelContent,
		VEditDialog,
		AnimeHead
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';
</style>
