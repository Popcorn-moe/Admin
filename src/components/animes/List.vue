<template>
  <div class="animes-list">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="animes"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            {{ props.item.names.join(', ') }}
          </td>
          <td>
            {{ props.item.authors.map(({ name }) => name ).join(', ') }}
          </td>
          <td>
            {{ props.item.tags.map(({ name }) => name ).join(', ') }}
          </td>
          <td>
            {{ props.item.release_date }}
          </td>
          <td>
            {{ props.item.posted_date }}
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
import { VDataTable, VBtn, VIcon } from "vuetify/es5/components";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import gql from "graphql-tag";

export default {
	name: "animes_list",
	data() {
		return {
			headers: [
				{
					text: "Names",
					align: "left",
					value: "names"
				},
				{
					text: "Authors",
					align: "left",
					value: "authors"
				},
				{
					text: "Tags",
					align: "left",
					value: "tags"
				},
				{
					text: "Release Date",
					align: "left",
					value: "release_date"
				},
				{
					text: "Posted date",
					align: "left",
					value: "posted_date"
				}
			],
			animes: [],
			deleted: []
		};
	},
	components: {
		VContainer,
		VFlex,
		VLayout,
		VDataTable,
		VBtn,
		VIcon
	},
	apollo: {
		animes: {
			query: gql`
				{
					animes(limit: 50) {
						id
						names
						authors {
							name
						}
						tags {
							name
						}
					}
				}
			`,
			update: ({ animes }) => animes
		}
	}
};
</script>
