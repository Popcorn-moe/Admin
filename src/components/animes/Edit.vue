<template>
  <div v-if="anime" class="edit-page">
	<anime-head
		:names="anime.names"
		:cover="anime.background"
		:poster="anime.cover"
		@setCover="file => anime.background = file"
		@setPoster="file => anime.cover = file"
	></anime-head>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { client } from "../../graphql";
import AnimeHead from "./AnimeHead";

export default {
	props: ["id"],
	data() {
		// Try from cache
		try {
			const anime = client.readFragment({
				id: this.id,
				fragment: gql`
					fragment anime on Anime {
						names
						cover
						background
						authors {
							id
							name
						}
					}
				`
			});
			if (anime) return { anime, loading: false };
		} catch (e) {
			console.log(e);
		}
		// Query it
		client
			.query({
				query: gql`
					query($id: ID!) {
						anime(id: $id) {
							id
							names
							cover
							background
							authors {
								id
								name
							}
						}
					}
				`,
				variables: {
					id: this.id
				}
			})
			.then(({ data: { anime } }) => {
				if (anime) {
					this.anime = anime;
				} else this.$router.replace({ name: "404" });
			});
		return {
			anime: null
		};
	},
	components: {
		AnimeHead
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';
</style>
