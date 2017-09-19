<template>
  <v-container>
    <div class="text-xs-center">
      <h2 class="headline">Authors</h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="authors"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" scope="props">
          <td></td>
         <td>
            <v-edit-dialog lazy> {{ props.item.name }}
              <v-text-field
                slot="input"
                v-model="props.item.name"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td>
            <v-edit-dialog lazy> {{ props.item.bio }}
              <v-text-field
                slot="input"
                v-model="props.item.bio"
                multi-line
              ></v-text-field>
            </v-edit-dialog>
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
import { VDataTable, VIcon, VBtn, VDialog, VTextField, VCheckbox } from 'vuetify/src/components'
import VEditDialog from 'vuetify/src/components/VDataTable/VEditDialog'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'
import gql from 'graphql-tag'

const UPDATE_AUTHOR =
gql`mutation ($id: ID!, $author: AuthorUpdate!) {
  id: updateAuthor(id: $id, author: $author)
}`
const ADD_AUTHOR =
gql`mutation ($author: AuthorInput!) {
  id: addAuthor(author: $author)
}`
export default {
  data() {
    return {
      headers: [
        {
          text: 'Picture',
          align: 'left',
          sortable: false,
          value: 'picture'
        }, {
          text: 'Name',
          align: 'left',
          value: 'name'
        },{
          text: 'Bio',
          align: 'left',
          value: 'bio'
        }, {
          text: 'Organisation',
          align: 'left',
          value: 'organisation'
        }
      ],
      authors: [],
      deleted: []
    }
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
    VCheckbox
  },
  methods: {
    removeAuthor(author) {
      this.authors.splice(this.authors.indexOf(author), 1)
      if (author.id)
        this.deleted.push(author.id)
    },
    addAuthor() {
      this.authors.push({
        name: 'New Author',
        bio: 'An Author',
        organisation: false
      })
    },
    saveAuthors() {
      for(const author of this.authors) {
        const { id, name, picture, bio, organisation } = author
        this.$apollo.mutate({
          mutation: id ? UPDATE_AUTHOR : ADD_AUTHOR,
          variables: {
              id,
              author: {
                name,
                picture,
                bio,
                organisation
              }
          }
        }).then(({data: { id }}) => {
          author.id = id;
        })
      }
      for(const id of this.deleted) {
        this.$apollo.mutate({
          mutation:
            gql`mutation ($id: ID!) {
                  deleteAuthor(id: $id)
                }`,
          variables: {
              id
          }
        })
        this.deleted = []
      }
    }
  },
  apollo: {
    authors: {
        query: gql`{ authors { id name picture bio organisation } }`,
        update: ({ authors }) => authors.map(author => Object.assign({}, author)) //Clone to avoid seal
    }
  }
}
</script>

<style lang="stylus">
  @import '../../stylus/main'

  .author-checkbox {
    width: 28px !important;
  }
</style>
