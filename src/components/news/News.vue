<template>
  <v-layout class="news-list">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="news"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            <v-edit-dialog lazy> {{ props.item.name }}
              <v-text-field
                slot="input"
                v-model="props.item.name"
								@change="() => props.item.changed = true"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td>
            <v-layout>
              <v-flex xs6>
                <v-btn icon class="main-color" v-if="props.item.cover" :href="props.item.cover">
                  <v-icon class="white--text">remove_red_eye</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs6>
                <v-btn icon class="main-color news-upload-icon">
                  <v-icon class="white--text">file_upload</v-icon>
                  <input type="file" @change="$input => { changeCover($input, props.item); props.item.changed = true}">
                </v-btn>
              </v-flex>
            </v-layout>
          </td>
          <td>
            <v-select
              class="table-select"
              :items="users.map(u => u.login)"
              @input="v => props.item.author.login"
							@change="() => props.item.changed = true"
              :value="props.item.author.login"
              single-line
            ></v-select>
          </td>
          <td @click.stop="props.item.dialog = !props.item.dialog" class="content_column">
            Click to edit
            <v-dialog v-model="props.item.dialog" width="50%">
              <v-card>
                <v-card-title class="headline">News Content</v-card-title>
                <mavon-editor 
									language="en"
									:value="props.item.content"
									@input="$input => test($input, props.item)"
								></mavon-editor>
                <v-spacer></v-spacer>
                <v-btn class="primary" @click.native="props.item.dialog = false">Close</v-btn>
              </v-card>
            </v-dialog>
          </td>
          <td>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="props.item.menu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-left="40"
              max-width="290px"
            >
              <v-text-field
                slot="activator"
                label="Picker in menu"
                v-model="props.item.posted_date"
								@change="() => props.item.changed = true"
                prepend-icon="event"
                single-line
                readonly
              ></v-text-field>
              <v-date-picker v-model="props.item.posted_date" no-title scrollable actions>
                <template slot-scope="{ save, cancel }">
                  <div class="card__actions">
                    <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                    <v-btn flat primary @click.native="save()">Save</v-btn>
                  </div>
                </template>
              </v-date-picker>
            </v-menu>
          </td>
          <td align="right">
            <v-btn icon @click.stop="() => removeNews(props.item)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="addNews()">
            Add News
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="saveNews()">
            Save
          </v-btn>
        </v-flex>
				{{ news }}
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import {
	VDataTable,
	VBtn,
	VIcon,
	VDialog,
	VTextField,
	VSelect,
	VDatePicker,
	VMenu
} from "vuetify/es5/components";
import { VCard, VCardTitle } from "vuetify/es5/components/VCard";
import VEditDialog from "vuetify/es5/components/VDataTable/VEditDialog";
import {
	VContainer,
	VFlex,
	VLayout,
	VSpacer
} from "vuetify/es5/components/VGrid";
import { mavonEditor as MavonEditor } from "mavon-editor";
import gql from "graphql-tag";

const UPDATE_NEWS = gql`
	mutation($id: ID!, $news: NewsInput!) {
		id: updateNews(id: $id, news: $news)
	}
`;
const ADD_NEWS = gql`
	mutation($news: NewsInput!) {
		id: addNews(news: $news)
	}
`;

export default {
	data() {
		return {
			headers: [
				{
					text: "Names",
					align: "left",
					value: "name"
				},
				{
					text: "Cover",
					align: "left",
					value: "cover",
					sortable: false
				},
				{
					text: "Author",
					align: "left",
					value: "author"
				},
				{
					text: "Content",
					align: "left",
					value: "content",
					sortable: false
				},
				{
					text: "Posted date",
					align: "left",
					value: "posted_date"
				}
			],
			news: [],
			deleted: [],
			users: [],
			me: {}
		};
	},
	components: {
		VContainer,
		VFlex,
		VLayout,
		VDataTable,
		VBtn,
		VIcon,
		VDialog,
		VTextField,
		VEditDialog,
		VSelect,
		VDatePicker,
		VMenu,
		VCard,
		VSpacer,
		VCardTitle,
		MavonEditor
	},
	apollo: {
		news: {
			query: gql`
				{
					news {
						id
						name
						author {
							id
							login
						}
						content
						cover
						posted_date
					}
				}
			`,
			update: ({ news }) =>
				news.map(n => Object.assign({ menu: false, dialog: false }, n))
		},
		me: {
			query: gql`
				{
					me {
						id
						login
					}
				}
			`,
			update: ({ me }) => me
		},
		users: {
			query: gql`
				{
					users {
						id
						login
						group
					}
				}
			`,
			update: ({ users }) =>
				users.filter(u => u.group !== "VIEWER").map(u => Object.assign({}, u))
		}
	},
	methods: {
		test($input, items) {
			if ($input !== items.content) items.content = $input;
		},
		changeCover({ target: { files: [file] } }, data) {
			data.cover = file;
			data.changed = true;
		},
		addNews() {
			this.news.push({
				name: "New News",
				author: this.me,
				posted_date: new Date().toISOString().slice(0, 10),
				content: "",
				menu: false,
				dialog: false,
				changed: true
			});
		},
		removeNews(news) {
			this.news.splice(this.news.indexOf(news), 1);
			if (news.id) this.deleted.push(news.id);
		},
		saveNews() {
			const toSave = this.news.filter(n => n.changed);
			console.log(toSave);
			toSave.forEach(e => delete e.changed);
			Promise.all(
				toSave
					.map(({ id, name, content, author: { id: author }, cover }) =>
						this.$apollo.mutate({
							mutation: id ? UPDATE_NEWS : ADD_NEWS,
							variables: {
								id: id || undefined,
								news: {
									name,
									content,
									author,
									cover: cover || undefined
								}
							}
						})
					)
					.concat(
						this.deleted.map(id =>
							this.$apollo.mutate({
								mutation: gql`
									mutation($id: ID!) {
										deleteNews(id: $id)
									}
								`,
								variables: {
									id
								}
							})
						)
					)
			).then(() => this.$apollo.queries.news.refetch());
		}
	}
};
</script>

<style lang="stylus">
  @import "../../stylus/main.styl";

  .table-select.input-group {
    padding: 5px;
    & > .input-group__details {
      min-height: 0;
    }
  }

  .news-upload-icon {
    input[type=file] {
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
  }

  .content_column {
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
</style>
