<template>
  <div class="animes-list">
    <v-container>
      <div class="text-xs-center">
        <h2 class="headline">Animes List</h2>
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
            {{ props.item.names.join(',') }}
          </td>
          <td>
            {{ props.item.authors }}
          </td>
          <td>
            {{ props.item.tags.join(',') }}
          </td>
          <td align="right">
            <v-btn icon @click.stop="() => removeAnime(props.item)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>

import { VDataTable } from 'vuetify/src/components'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'

export default {
  name: "animes_list",
  data() {
      return {
        headers: [
          {
            text: 'Names',
            align: 'left',
            value: 'names'
          }, {
            text: 'Authors',
            align: 'left',
            value: 'authors'
          },
          {
            text: 'Tags',
            align: 'left',
            value: 'tags'
          },{
            text: 'Release Date',
            align: 'left',
            value: 'bio'
          }, {
            text: 'Posted date',
            align: 'left',
            value: 'organisation'
          }
        ],
        animes: [],
        deleted: []
      }
  },
  components: {
    VContainer,
    VFlex,
    VLayout,
    VDataTable
  }
}
</script>
