<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <v-text-field
          label="Name"
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
          <template slot="selection" scope="data">
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
          <template slot="item" scope="data">
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
  </v-container>
</template>

<script>
  import { VDataTable, VIcon, VBtn, VDialog, VTextField, VSelect, VChip, VAvatar } from 'vuetify/src/components'
  import { VList, VListGroup, VListTile, VListTileTitle, VListTileAction, VListTileContent, VListTileAvatar } from 'vuetify/src/components/VList'
  import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'
  import Datepicker from '../../picker/datepicker.vue'



  import gql from 'graphql-tag'

  export default {
    name: 'animes_add',
    data () {
      return {
        date: {
          time: ''
        },
        tags: [],
        selectedTags: [],
        animesStatus: [],
        selectedStatus: ''
      }
    },
    methods: {},
    components: {
      VContainer,
      VFlex,
      VLayout,
      VDataTable,
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
      Datepicker
    },
    apollo: {
      animesStatus: {
        query: gql`{
          __type(name: "AnimeStatus") {
                enumValues {
              name
            }
          }
        }`,
        update: ({ __type: { enumValues }}) => enumValues
          .map(e => e.name.split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '))
      },
      tags: {
        query: gql`{ tags { id name color desc } }`,
        update: ({ tags }) => tags
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../stylus/main.styl'

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

  .tags-select > .input-group__selections {
    padding-left: 2px !important;
  }
</style>
