<template>
  <div class="anime-edit">
    <v-container>
      <div class="text-xs-center">
        <h2 class="headline">Edit Anime</h2>
      </div>
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
              <template scope="{ save, cancel }">
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
          ></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn icon large primary dark @click.stop="">
            <v-icon>file_upload</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs5>
          <v-text-field
            label="Banner Link"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn icon large primary dark @click.stop="">
            <v-icon>file_upload</v-icon>
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
      <v-divider></v-divider>
      <h6>Seasons : </h6>
      <v-data-table
        :headers="headers.seasons"
        :items="seasons"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" scope="props"></template>
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="">
            Add Season
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
      <h6>Episodes : </h6>
      <v-data-table
        :headers="headers.episodes"
        :items="episodes"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" scope="props"></template>
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="">
            Add Episode
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
      <h6>Medias : </h6>
      <v-data-table
        :headers="headers.medias"
        :items="medias"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" scope="props"></template>
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary @click.stop="">
            Add Media
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary @click.stop="">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { VDataTable, VIcon, VBtn, VDialog, VTextField, VSelect, VChip, VAvatar, VDatePicker, VMenu, VDivider } from 'vuetify/src/components'
import { VList, VListGroup, VListTile, VListTileTitle, VListTileAction, VListTileContent, VListTileAvatar } from 'vuetify/src/components/VList'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'

export default {
  name: "anime_edit",
  data() {
    return {
      names: '',
      date: null,
      desc: '',
      menu: false,
      authors: [],
      tags: [],
      selectedTags: [],
      selectedAuthors: [],
      animesStatus: [],
      selectedStatus: '',
      seasons: [],
      episodes: [],
      medias: [],
      headers : {
          seasons: [
            {
              text: 'Num',
              align: 'left',
              value: 'num'
            }, {
              text: 'Date',
              align: 'left',
              value: 'date'
            }, {
              text: 'Episodes Count',
              align: 'left',
              value: 'episodes'
            }
          ],
          episodes: [
            {
              text: 'Num',
              align: 'left',
              value: 'num'
            }, {
              text: 'Season',
              align: 'left',
              value: 'season'
            }, {
              text: 'Date',
              align: 'left',
              value: 'date'
            }
          ],
          medias: [
            {
              text: 'Name',
              align: 'left',
              value: 'name'
            },
            {
              text: 'Type',
              align: 'left',
              value: 'type'
            },
            {
              text: 'Date',
              align: 'left',
              value: 'date'
            }
          ]
      }
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
    VDatePicker,
    VDivider,
  }
}
</script>

<style lang="stylus">
  @import "../../stylus/main.styl";
</style>
