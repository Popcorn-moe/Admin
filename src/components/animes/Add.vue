<template>
  <v-container>
    <v-stepper v-model="el">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="el > 1">Names and Description</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="el > 2">Cover and Banner</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Tags and Authors</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-subheader inset>Names</v-subheader>
          <v-layout row wrap>
            <v-flex offset-md2 md8>
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
          </v-layout>
          <v-subheader inset>Description</v-subheader>
          <v-layout row wrap>
            <v-flex class="text-md-center">
              <mavon-editor language="en" v-model="desc"></mavon-editor>
            </v-flex>
          </v-layout>
          <v-btn color="primary" @click.native="el = 2">Continue</v-btn>
          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-btn color="primary" @click.native="el = 1">Return</v-btn>
          <v-btn color="primary" @click.native="el = 3">Continue</v-btn>
          <v-btn flat>Cancel</v-btn>
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
          <v-btn color="primary" @click.native="el = 2">Return</v-btn>
          <v-btn color="primary">Finish</v-btn>
          <v-btn flat>Cancel</v-btn>
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
	VSubheader
} from "vuetify/es5/components";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import * as VStepper from "vuetify/es5/components/VStepper";
import { mavonEditor as MavonEditor } from "mavon-editor";
import gql from "graphql-tag";

export default {
	data() {
		return {
			el: 0,
			names: [],
			desc: ""
		};
	},
	methods: {
		removeName(name) {
			this.names.splice(this.names.indexOf(name), 1);
		},
		addAnime() {
			this.$apollo.mutate({
				mutation: gql`
					mutation($anime: AnimeInput!) {
						addAnime(anime: $anime)
					}
				`,
				variables: {
					anime: {
						names: this.names.split(",").map(e => e.trim()),
						authors: this.selectedAuthors,
						tags: this.selectedTags,
						status: this.selectedStatus.toUpperCase().replace(" ", "_"),
						desc: this.desc,
						cover: this.coverFile,
						background: this.bannerFile,
						release_date: this.date + "T00:00:00Z" //UTC date (midnight greenwich)
					}
				}
			});
		},
		setCoverFile({ target: { files: [file] } }) {
			this.coverFile = file;
		},
		setBannerFile({ target: { files: [file] } }) {
			this.bannerFile = file;
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
		...VStepper,
		MavonEditor,
		VSubheader
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
</style>
