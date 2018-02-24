<template>
  <v-container class="add-container">
    <v-progress-circular v-if="load" class="add-progress" indeterminate color="primary" :size="50"></v-progress-circular>
    <div class="overlay overlay--active" v-if="load"></div>
    <v-stepper v-model="el">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="el > 1" editable>Names, Description, Status</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="el > 2" editable>Cover and Poster</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" editable>Tags and Authors</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <kitsu-search @input="selectKitsu"></kitsu-search>
          <v-layout row wrap>
            <v-flex md8>
              <v-subheader>Names</v-subheader>
              <v-select
                label="Names"
                chips
                tags
                solo
                append-icon=""
                clearable
                v-model="names"
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
            <v-flex offset-md1 md2>
              <v-subheader>Status</v-subheader>
              <v-select
                :items="animesStatus"
                v-model="selectedStatus"
                solo
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex class="text-md-center">
              <v-subheader>Description</v-subheader>
              <mavon-editor language="en" v-model="desc"></mavon-editor>
            </v-flex>
          </v-layout>
          <v-btn color="primary" @click.native="el = 2">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <upload class="anime-background" @input="([file]) => cover = file">
            <v-icon class="upload-icon">file_upload</v-icon>
            <preview :value="cover" alt="cover" width="100%"></preview>
          </upload>
          <div class="anime-poster">
            <upload class="anime-poster-img" @input="([file]) => poster = file">
              <v-icon class="upload-icon">file_upload</v-icon>
              <preview :value="poster" alt="poster"></preview>
            </upload>
            <h3 class="uppercase">{{ names && names[0] }}</h3>
          </div>
          <v-btn color="primary" @click.native="el = 3">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-layout>
            <v-flex xs6>
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
                    @click.native.stop
                    class="chip--select-multi"
                    :key="data.item.id"
                  >
                    <v-list-tile-avatar :style="{ 'background-color': data.item.color }"></v-list-tile-avatar>
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
            <v-flex xs6>
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
                    @click.native.stop
                    class="chip--select-multi"
                    :key="data.item.id"
                  >
                    <v-list-tile-avatar :style="{ 'background-color': data.item.color }"></v-list-tile-avatar>
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
          </v-layout>
          <v-btn color="primary" @click.native="addAnime">Finish</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import {
	VBtn,
	VDivider,
	VSelect,
	VChip,
	VSubheader,
	VProgressCircular,
	VTextField,
	VDialog,
	VCard,
	VIcon
} from "vuetify/es5/components";
import {
	VListTileContent,
	VListTileAvatar,
	VListTileTitle
} from "vuetify/es5/components/VList";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import * as VStepper from "vuetify/es5/components/VStepper";
import { mavonEditor as MavonEditor } from "mavon-editor";
import KitsuSearch from "./KitsuSearch";
import Preview from "./Preview";
import Upload from "./Upload";
import gql from "graphql-tag";
import { mapActions } from "vuex";

export default {
	data() {
		return {
			load: false,
			el: 0,
			names: [],
			desc: "",
			authors: [],
			selectedAuthors: [],
			tags: [],
			selectedTags: [],
			selectedStatus: "Finished",
			date: null,
			cover: null,
			poster: null,
			animesStatus: []
		};
	},
	methods: {
		...mapActions({
			setError: "setError"
		}),
		selectKitsu(item) {
			this.load = true;
			item
				.then(item => {
					this.names = Object.values(item.titles);
					this.desc = item.synopsis;
					// TODO use trailer item.youtubeVideoId
					switch (item.status) {
						case "finished":
							this.selectedStatus = "Finished";
							break;
						case "current":
							this.selectedStatus = "Pending";
							break;
						default:
							this.selectedStatus = "Not Started";
							break;
					}
					this.date = item.startDate;
					return Promise.all([
						item.coverImage &&
							fetch(
								`https://cors-anywhere.herokuapp.com/${
									item.coverImage.original
								}`
							)
								.then(res => res.blob())
								.then(blob => (this.cover = blob)),
						fetch(
							`https://cors-anywhere.herokuapp.com/${item.posterImage.original}`
						)
							.then(res => res.blob())
							.then(blob => (this.poster = blob))
					]);
				})
				.then(_ => (this.load = false));
		},
		removeName(name) {
			this.names.splice(this.names.indexOf(name), 1);
		},
		addAnime() {
			this.load = true;
			this.$apollo
				.mutate({
					mutation: gql`
						mutation($anime: AnimeInput!) {
							addAnime(anime: $anime)
						}
					`,
					variables: {
						anime: {
							names: this.names.map(e => e.trim()),
							authors: this.selectedAuthors,
							tags: this.selectedTags,
							status: this.selectedStatus.toUpperCase().replace(" ", "_"),
							desc: this.desc,
							cover: this.poster,
							background: this.cover,
							release_date: this.date + "T00:00:00Z" //UTC date (midnight greenwich)
						}
					}
				})
				.then(_ => {
					this.load = false;
					this.$router.push({ name: "List" });
				})
				.catch(err => {
					this.load = false;
					this.setError(err);
				});
		}
	},
	components: {
		VBtn,
		VSelect,
		VChip,
		VContainer,
		VFlex,
		VLayout,
		VDivider,
		MavonEditor,
		VSubheader,
		VListTileContent,
		VListTileAvatar,
		VListTileTitle,
		VProgressCircular,
		VTextField,
		...VStepper,
		KitsuSearch,
		VDialog,
		VCard,
		Preview,
		VIcon,
		Upload
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
					}
				}
			`,
			update: ({ authors }) => authors
		}
	}
};
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

  .flex {
    padding: 5px;
  }

  .tags-select > .input-group__selections {
    padding-left: 2px !important;
  }

  .upload-button input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }

  .add-container {
    position: relative;

    .add-progress {
      position: absolute;
      z-index: 21;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .anime-background, .anime-poster-img {
      position: relative;

      .upload-icon {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        font-size: 58px;
        background: black;
        opacity: 0;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .anime-background {
      overflow-y: hidden;
      height: 405px;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .upload-icon {
        height: 406px;
      }
    }

    .anime-poster {
      padding-top: 30px;

      .anime-poster-img {
        display: inline-block;
        z-index: 2;
        box-shadow: 0px 2px 12px 0px rgba(16,16,17,0.5);
        margin-right: 18px;
        margin-top: -105px;
        margin-left: 8.333333333333332%;
        width: 180px;
        height: 250px;

        img {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .upload-icon {
          z-index: 2;
        }
      }

      h3 {
        display: inline;
        vertical-align: top;
      }
    }
  }
</style>
