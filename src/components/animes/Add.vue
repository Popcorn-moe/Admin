<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <v-text-field
          label="Names"
          v-model="names"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>
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
    <v-layout>
      <v-flex xs6>
        <v-select
          :items="animesStatus"
          v-model="selectedStatus"
          label="Status"
        ></v-select>
      </v-flex>
      <v-flex xs6>
        <v-menu
          lazy
          :close-on-content-click="false"
          v-model="menu"
          transition="scale-transition"
          offset-y
          full-width
          :nudge-left="40"
          max-width="290px"
        >
          <v-text-field
            slot="activator"
            label="Release Date"
            v-model="date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date" no-title scrollable actions>
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                <v-btn flat primary @click.native="save()">Save</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs5>
        <v-text-field
          label="Cover Link"
          required
          @input="value => coverFile = value"
          :value="(coverFile && coverFile.name) ? coverFile.name : coverFile"
        ></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn icon large primary dark class="upload-button">
          <v-icon>file_upload</v-icon>
          <input type="file" @change="setCoverFile">
        </v-btn>
      </v-flex>
      <v-flex xs5>
        <v-text-field
          label="Banner Link"
          required
          @input="value => bannerFile = value"
          :value="(bannerFile && bannerFile.name) ? bannerFile.name : bannerFile"
        ></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn icon large primary dark class="upload-button">
          <v-icon>file_upload</v-icon>
          <input type="file" @change="setBannerFile">
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-text-field
          label="Desc"
          v-model="desc"
          multi-line
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex offset-xs10 xs2 class="text-xs-right">
        <v-btn primary @click.stop="addAnime()">
          Add
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
	VIcon,
	VBtn,
	VDialog,
	VTextField,
	VSelect,
	VChip,
	VAvatar,
	VDatePicker,
	VMenu
} from "vuetify/es5/components";
import {
	VList,
	VListGroup,
	VListTile,
	VListTileTitle,
	VListTileAction,
	VListTileContent,
	VListTileAvatar
} from "vuetify/es5/components/VList";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import gql from "graphql-tag";

export default {
	data() {
		return {
			names: "",
			date: null,
			desc: "",
			menu: false,
			authors: [],
			tags: [],
			selectedTags: [],
			selectedAuthors: [],
			animesStatus: [],
			selectedStatus: "",
			coverFile: null,
			bannerFile: null
		};
	},
	methods: {
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
		VContainer,
		VFlex,
		VLayout,
		VIcon,
		VBtn,
		VDialog,
		VTextField,
		VSelect,
		VChip,
		VList,
		VListGroup,
		VListTile,
		VListTileTitle,
		VListTileAction,
		VListTileContent,
		VListTileAvatar,
		VAvatar,
		VMenu,
		VDatePicker
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
