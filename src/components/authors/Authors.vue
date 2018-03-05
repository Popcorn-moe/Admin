<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="authors"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
         <td>
           <img class="author-avatar" :src="props.item.picture">
         </td>
         <td>
            <v-edit-dialog lazy> {{ props.item.name }}
              <v-text-field
                slot="input"
                v-model="props.item.name"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
         <td @click.stop="props.item.dialog = !props.item.dialog" class="content_column">
            Click to edit
            <v-dialog v-model="props.item.dialog" width="50%">
              <v-card>
                <v-card-title class="headline">News Content</v-card-title>
                <mavon-editor language="en" v-model="props.item.bio"></mavon-editor>
                <v-spacer></v-spacer>
                <v-btn class="primary" @click.native="props.item.dialog = false">Save</v-btn>
              </v-card>
            </v-dialog>
          </td>
          <td>
            <v-checkbox
              class="author-checkbox"
              primary
              hide-details
              v-model="props.item.organisation"
            ></v-checkbox>
          </td>
          <td align="right">
            <v-btn icon @click.stop="() => removeAuthor(props.item)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
     <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="addAuthor()">
            Add Author
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="saveAuthors()">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import {
	VDataTable,
	VIcon,
	VBtn,
	VDialog,
	VTextField,
	VCheckbox
} from "vuetify/es5/components";
import VEditDialog from "vuetify/es5/components/VDataTable/VEditDialog";
import {
	VContainer,
	VFlex,
	VLayout,
	VSpacer
} from "vuetify/es5/components/VGrid";
import { VCard, VCardTitle } from "vuetify/es5/components/VCard";
import { mavonEditor as MavonEditor } from "mavon-editor";
import gql from "graphql-tag";

const UPDATE_AUTHOR = gql`
	mutation($id: ID!, $author: AuthorUpdate!) {
		id: updateAuthor(id: $id, author: $author)
	}
`;
const ADD_AUTHOR = gql`
	mutation($author: AuthorInput!) {
		id: addAuthor(author: $author)
	}
`;
export default {
	data() {
		return {
			headers: [
				{
					text: "Picture",
					align: "left",
					sortable: false,
					value: "picture"
				},
				{
					text: "Name",
					align: "left",
					value: "name"
				},
				{
					text: "Bio",
					align: "left",
					value: "bio"
				},
				{
					text: "Organisation",
					align: "left",
					value: "organisation"
				}
			],
			authors: [],
			deleted: []
		};
	},
	components: {
		VContainer,
		VFlex,
		VLayout,
		VDataTable,
		VIcon,
		VBtn,
		VDialog,
		VEditDialog,
		VTextField,
		VCheckbox,
		VSpacer,
		VCard,
		VCardTitle,
		MavonEditor
	},
	methods: {
		removeAuthor(author) {
			this.authors.splice(this.authors.indexOf(author), 1);
			if (author.id) this.deleted.push(author.id);
		},
		addAuthor() {
			this.authors.push({
				name: "New Author",
				bio: "An Author",
				organisation: false,
				dialog: false
			});
		},
		saveAuthors() {
			for (const author of this.authors) {
				const { id, name, bio, organisation } = author;
				this.$apollo
					.mutate({
						mutation: id ? UPDATE_AUTHOR : ADD_AUTHOR,
						variables: {
							id,
							author: {
								name,
								bio,
								organisation
							}
						}
					})
					.then(({ data: { id } }) => {
						author.id = id;
						this.$apollo.queries.authors.refetch();
					});
			}
			for (const id of this.deleted) {
				this.$apollo.mutate({
					mutation: gql`
						mutation($id: ID!) {
							deleteAuthor(id: $id)
						}
					`,
					variables: {
						id
					}
				});
			}
			this.deleted = [];
		}
	},
	apollo: {
		authors: {
			query: gql`
				{
					authors {
						id
						name
						picture
						bio
						organisation
					}
				}
			`,
			update: ({ authors }) =>
				authors.map(author => Object.assign({ dialog: false }, author)) //Clone to avoid seal
		}
	}
};
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

  .author-checkbox {
    width: 28px !important;
  }

  .author-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
</style>
