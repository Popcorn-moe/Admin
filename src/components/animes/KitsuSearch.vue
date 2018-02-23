<template>
  	<div>
		<v-layout row wrap>
			<v-flex offset-md2 md8>
				<v-text-field
				box
				label="Search on Kitsu"
				v-model="search"
				></v-text-field>
			</v-flex>
		</v-layout>
		<v-slide-y-transition>
			<v-layout row wrap v-if="items.length">
				<v-flex md2
					v-for="item in items"
					:key="item.id"
					class="text-md-center"
				>
					<div class="kitsu-result" @click="select(item)">
						<img width="100px" :src="item.posterImage.original"/>
						<h4>{{ item.canonicalTitle }}</h4>
					</div>
				</v-flex>
			</v-layout>
		</v-slide-y-transition>
  	</div>
</template>

<script>
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import { VTextField, VBtn } from "vuetify/es5/components";
import algoliasearch from "algoliasearch/lite";
import { VSlideYTransition } from "vuetify/es5/components/transitions";

const kitsuSearch = algoliasearch(
	"AWQO5J657S",
	"NzYxODA5NmY0ODRjYTRmMzQ2YjMzNzNmZmFhNjY5ZGRmYjZlMzViN2VkZDIzMGUwYjM5ZjQ5NjAwZGI4ZTc5MHJlc3RyaWN0SW5kaWNlcz1wcm9kdWN0aW9uX21lZGlhJmZpbHRlcnM9Tk9UK2FnZVJhdGluZyUzQVIxOA=="
);
const kitsuMedia = kitsuSearch.initIndex("production_media");

export default {
	data() {
		return {
			search: null,
			items: []
		};
	},
	watch: {
		search(val) {
			if (val) this.queryKitsu(val);
			else this.items = [];
		}
	},
	methods: {
		queryKitsu(value) {
			kitsuMedia
				.search(value, {
					attributesToRetrieve: ["canonicalTitle", "posterImage", "id"],
					hitsPerPage: 6
				})
				.then(({ hits }) => (this.items = hits));
		},
		select(item) {
			this.search = null;
			this.items = [];
			fetch(`https://kitsu.io/api/edge/anime/${item.id}`)
				.then(res => res.json())
				.then(({ data: { attributes } }) => this.$emit("input", attributes));
		}
	},
	components: {
		VTextField,
		VContainer,
		VFlex,
		VLayout,
		VBtn,
		VSlideYTransition
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';

	.kitsu-result {
		cursor: pointer;

		&:hover {
			img {
				border-color: $main-color;
			}
		}
		img {
			border: 3px solid transparent;
		}
	}
</style>
