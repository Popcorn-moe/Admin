<template>
  <div v-if="anime" class="edit-page">
	<anime-head
		:cover="anime.background"
		:poster="anime.cover"
    edit="true"
		@setCover="file => anime.background = file"
		@setPoster="file => anime.cover = file"
	>
    <div slot="title">
      <v-layout row wrap>
        <v-flex xs12>
          <v-select
            label="Names"
            chips
            tags
            solo
            append-icon=""
            clearable
            v-model="anime.names"
            class="names"
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                color="primary"
                close
                outline
                label
                @input="removeName(data.item)"
                :selected="data.selected"
              >
                <strong>{{ data.item }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-select>
        </v-flex>
        <v-flex xs4>
          <v-select
            :items="animesStatus"
            v-model="currentStatus"
            label="Anime status"
          ></v-select>
        </v-flex>
        <v-flex xs4>
          <v-select
            label="Select Tags"
            :items="tags"
            v-model="selectedTags"
            item-text="name"
            item-value="id"
            class="tags-select"
            multiple
            chips
            autocomplete
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                close
                @input="data.parent.selectItem(data.item.id)"
                :selected="data.selected"
                class="chip--select-multi"
                :key="JSON.stringify(data.item)"
              >
                <v-avatar :style="{ 'background-color': data.item.color }"></v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <v-list-tile-avatar>
                <div :style="{ 'background-color': data.item.color, 'width': '30px', 'height': '30px', 'border-radius': '50%' }"></div>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
        </v-flex>
        <v-flex xs4>
          <v-select
            label="Select Authors"
            :items="authors"
            v-model="selectedAuthors"
            item-text="name"
            item-value="id"
            class="tags-select"
            multiple
            chips
            autocomplete
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                close
                @input="data.parent.selectItem(data.item.id)"
                :selected="data.selected"
                class="chip--select-multi"
                :key="JSON.stringify(data.item)"
              >
                <v-avatar>
                  <img :src="data.item.picture">
                </v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <v-list-tile-avatar>
                <img :src="data.item.picture">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
        </v-flex>
      </v-layout>
    </div>
  </anime-head>
	<v-container grid-list-md>
		<v-layout row wrap>
      <v-flex md12>
        <v-expansion-panel prominent>
          <v-expansion-panel-content>
            <div slot="header">Description</div>
            <v-card>
              <mavon-editor language="en" v-model="anime.desc"></mavon-editor>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex md2 offset-md10>
        <v-btn class="primary" block @click.stop="saveAll()">
          Save
        </v-btn>
      </v-flex>
      <v-divider></v-divider>
			<v-flex md12>
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
      <v-flex md12>
        <v-expansion-panel prominent>
          <v-expansion-panel-content>
            <div slot="header">
              Musics
              <v-btn icon @click.stop="getOpenings()">
                <v-icon>get_app</v-icon>
              </v-btn>
              <v-btn icon @click.stop="addOpening()">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon @click.stop="saveMedias()">
                <v-icon>save</v-icon>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <v-card>
              <v-data-table
                :headers="mediaHeaders"
                :items="openings"
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
                  <td>
										<v-edit-dialog lazy>
											{{ props.item.type }}
											<v-select
											 	slot="input"
												class="table-select"
												:items="['OPENING', 'ENDING', 'OST']"
												v-model="props.item.type"
												@change="() => props.item.changed = true"
												single-line
											></v-select>
										</v-edit-dialog>
									</td>
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
									<td>
										<v-btn icon @click.stop="props.item.deleted = true"><v-icon>delete</v-icon></v-btn>
									</td>
                </template>
              </v-data-table> 
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
			<v-flex md12>
        <v-expansion-panel prominent>
          <v-expansion-panel-content>
            <div slot="header">
              Trailers
              <v-btn icon @click.stop="addTrailer()">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon @click.stop="saveMedias()">
                <v-icon>save</v-icon>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <v-card>
              <v-data-table
                :headers="mediaHeaders"
                :items="trailers"
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
									<td>
										<v-btn icon small @click.stop="props.item.deleted = true">
											<v-icon>delete</v-icon>
										</v-btn>
									</td>
                </template>
              </v-data-table>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
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
								<v-text-field label="Name" v-model="newSeason.name" required></v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-text-field label="Season" type="number" v-model="newSeason.season" required></v-text-field>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
          <v-btn flat @click.stop="newSeason.dialog=false">Close</v-btn>
					<v-btn color="primary darken-1" @click.native="addSeason">Add</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
	<pre>{{ openings }}</pre>
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
	VDataTable,
	VSelect,
	VChip,
	VAvatar
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
import {
	VListTileContent,
	VListTileAvatar,
	VListTileTitle
} from "vuetify/es5/components/VList";
import VEditDialog from "vuetify/es5/components/VDataTable/VEditDialog";
import AnimeHead from "./AnimeHead";
import gql from "graphql-tag";
import clone from "clone";
import { mavonEditor as MavonEditor } from "mavon-editor";

const UPDATE_MEDIA = gql`
	mutation($id: ID!, $media: MediaUpdate!) {
		updateMedia(id: $id, media: $media)
	}
`;

const ADD_MEDIA = gql`
	mutation($media: MediaInput!, $anime: ID!) {
		addMedia(media: $media) {
			linkTo(anime: $anime)
		}
	}
`;

export default {
	props: ["id"],
	data() {
		return {
			anime: null,
			animesStatus: [],
			selectedTags: [],
			selectedAuthors: [],
			tags: [],
			authors: [],
			currentStatus: "Finished",
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
			],
			mediaHeaders: [
				{ text: "Num", value: "idx" },
				{ text: "Name", value: "name" },
				{ text: "Type", value: "type" },
				{ text: "Posted Date", value: "posted_date" },
				{ text: "Content", value: "content" },
				{ text: "Action", value: "action" }
			]
		};
	},
	computed: {
		openings() {
			return this.anime.medias.filter(({ type, deleted }) => {
				console.log(deleted);
				return (
					(type === "OPENING" || type === "ENDING" || type === "OST") &&
					!deleted
				);
			});
		},
		trailers() {
			return this.anime.medias.filter(
				({ type, deleted }) => type === "TRAILER" && !deleted
			);
		}
	},
	methods: {
		opneningRegEx(name) {
			return new RegExp(
				`^(?=.*${name
					.split(" ")
					.map(str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
					.join(")(?=.*")}).*$`,
				"i"
			);
		},
		hasJapanChar(word) {
			return (
				word
					.split("")
					.filter(
						c =>
							(c > "\u3040" && c < "\u4DBF") || (c > "\u4e00" && c < "\u9faf")
					).length > 0
			);
		},
		openingUrl(file) {
			return `https://openings.moe/video/${file}`;
		},
		getOpenings() {
			const names = this.anime.names.filter(n => !this.hasJapanChar(n));
			fetch("https://cors.popcorn.moe/http://openings.moe/api/list.php")
				.then(res => res.json())
				.then(res => {
					const results = names.map(n =>
						res.filter(({ source }) => this.opneningRegEx(n).test(source))
					);
					const openings =
						results.length === 0
							? {}
							: results.sort((a, b) => a.length < b.length)[0];
					openings
						.filter(
							({ file }) =>
								!this.anime.medias
									.map(({ content }) => content)
									.includes(this.openingUrl(file))
						)
						.forEach(({ song, title, file }) => {
							const type = title.split(" ")[0].toUpperCase();
							const content = this.openingUrl(file);
							this.anime.medias.push({
								name: (song && song.title) || title,
								type: type !== "OPENING" && type !== "ENDING" ? "OST" : type,
								content,
								changed: true
							});
						});
				});
		},
		addOpening() {
			const num = this.openings.length + 1;
			this.anime.medias.push({
				name: `Opening #${num}`,
				type: "OPENING",
				content: ""
			});
		},
		addTrailer() {
			const num = this.trailers.length + 1;
			this.anime.medias.push({
				name: `Trailer #${num}`,
				type: "TRAILER",
				content: ""
			});
		},
		saveMedias() {
			const toSave = this.anime.medias.filter(e => e.changed && !e.deleted);
			const toDelete = this.anime.medias.filter(e => e.deleted && e.id);
			toSave.forEach(e => delete e.changed);
			Promise.all(
				toSave
					.map(({ id, name, type, content }) =>
						this.$apollo.mutate({
							mutation: id ? UPDATE_MEDIA : ADD_MEDIA,
							variables: {
								anime: !id ? this.anime.id : undefined,
								id: id ? id : undefined,
								media: { name, type, content }
							}
						})
					)
					.concat(
						toDelete.map(({ id }) =>
							this.$apollo.mutate({
								mutation: gql`
									mutation($id: ID!) {
										deleteMedia(id: $id)
									}
								`,
								variables: { id }
							})
						)
					)
			).then(_ => this.$apollo.queries.anime.refetch());
		},
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
		},
		saveAll() {
			const { id, names, status, desc, cover, background } = this.anime;
			this.$apollo
				.mutate({
					mutation: gql`
						mutation($id: ID!, $anime: AnimeInput!) {
							id: updateAnime(id: $id, anime: $anime)
						}
					`,
					variables: {
						id,
						anime: {
							names,
							tags: this.selectedTags,
							authors: this.selectedAuthors,
							status,
							desc,
							cover: typeof cover === "string" ? undefined : cover,
							background:
								typeof background === "string" ? undefined : background
						}
					}
				})
				.then(_ => this.$apollo.queries.anime.refetch());
		},
		removeName(name) {
			this.anime.names.splice(this.anime.names.indexOf(name), 1);
		}
	},
	apollo: {
		animesStatus: {
			query: gql`
				{
					__type(name: "AnimeStatus") {
						enumValues {
							name
						}
					}
				}
			`,
			update: ({ __type: { enumValues } }) =>
				enumValues.map(e =>
					e.name
						.split("_")
						.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
						.join(" ")
				)
		},
		tags: {
			query: gql`
				{
					tags {
						id
						name
						color
					}
				}
			`,
			update: ({ tags }) => tags
		},
		authors: {
			query: gql`
				{
					authors {
						id
						name
						picture
					}
				}
			`,
			update: ({ authors }) => authors
		},
		anime: {
			query: gql`
				query($id: ID!) {
					anime(id: $id) {
						id
						names
						status
						desc
						cover {
							normal
						}
						background
						tags {
							id
							name
							color
						}
						authors {
							id
							name
							picture
						}
						medias {
							id
							name
							type
							posted_date
							content
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
			update({ anime }) {
				this.currentStatus = anime.status
					.split("_")
					.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
					.join(" ");
				this.selectedTags = anime.tags.map(({ id }) => id);
				this.selectedAuthors = anime.authors.map(({ id }) => id);
				const nAnime = clone(anime);
				nAnime.cover = nAnime.cover.normal;
				return nAnime;
			}
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
		VSelect,
		VChip,
		VListTileContent,
		VListTileAvatar,
		VListTileTitle,
		VAvatar,
		VEditDialog,
		AnimeHead,
		MavonEditor
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';
</style>
