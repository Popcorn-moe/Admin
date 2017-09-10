<template>
  <v-container>
    <div class="text-xs-center">
      <h2 class="headline">Tags</h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="tags"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" scope="props">
         <td><input type="text" v-model="props.item.name"></td>
          <td><input class="full-width" type="text" v-model="props.item.desc"></td>
          <td>
            <v-dialog lazy>
              <div
                slot="activator"
                class="color-result"
                :style="{ 'background-color': props.item.color }"
              ></div>
              <color-picker class="color-picker" :value="{ 'hex': props.item.color }" @input="({ hex }) => props.item.color = hex"></color-picker>
            </v-dialog>
          </td>
          <td align="right">
            <v-btn icon @click.stop="() => removeTag(props.item)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
     <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="addTag()">
            Add Tag
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="saveTags()">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import { VDataTable, VIcon, VBtn, VDialog } from 'vuetify/src/components'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'
import ColorPicker from 'vue-color/src/components/Chrome.vue'
import gql from 'graphql-tag'

const UPDATE_TAG =
gql`mutation ($id: ID!, $tag: TagUpdate!) {
  id: updateTag(id: $id, tag: $tag)
}`
const ADD_TAG =
gql`mutation ($tag: TagInput!) {
  id: addTag(tag: $tag)
}`
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name'
        }, {
          text: 'Description',
          align: 'left',
          value: 'desc'
        }, {
          text: 'Color',
          align: 'left',
          value: 'color'
        },
      ],
      tags: [],
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
    ColorPicker
  },
  methods: {
    removeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      if (tag.id)
        this.deleted.push(tag.id)
    },
    addTag() {
      this.tags.push({
        name: 'New tag',
        desc: 'Description',
        color: '#000000'
      })
    },
    saveTags() {
      for(const tag of this.tags) {
        const { id, name, desc, color } = tag
        this.$apollo.mutate({
          mutation: id ? UPDATE_TAG : ADD_TAG,
          variables: {
              id,
              tag: {
                name,
                desc,
                color
              }
          }
        }).then(({data: { id }}) => {
          tag.id = id;
        })
      }
      for(const id of this.deleted) {
        this.$apollo.mutate({
          mutation:
            gql`mutation ($id: ID!) {
                  deleteTag(id: $id)
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
    tags: {
        query: gql`{ tags { id name desc color } }`,
        update: ({ tags }) => tags.map(tag => Object.assign({}, tag)) //Clone to avoid seal
    }
  }
}
</script>

<style lang="stylus">
  @import '../../stylus/main'

  .color-result {
    display: inline-block;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    border: solid 1px #999;
    cursor: pointer;
  }

  .color-picker {
    width: initial !important;
  }
</style>