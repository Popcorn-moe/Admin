<template>
  <div v-if="anime" class="edit-page">
	<div class="anime-background">
		<preview :value="anime.background" alt="cover" width="100%"></preview>
	</div>
	<div class="anime-poster">
	<preview :value="anime.cover" alt="poster"></preview>
		<h3 class="uppercase">{{ anime.names && anime.names[0] }}</h3>
	</div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { client } from "../../graphql";
import Preview from "./Preview";

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
		Preview
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';

	.edit-page {
		.anime-background {
			overflow-y: hidden;
			height: 405px;
		}

		.anime-poster {
			padding-top: 30px;

			img {
				box-shadow: 0px 2px 12px 0px rgba(16,16,17,0.5);
				margin-right: 18px;
				margin-top: -105px;
				margin-left: 8.333333333333332%;
				width: 180px;
				height: 250px;
			}

			h3 {
				display: inline;
				vertical-align: top;
			}
		}	
	}
</style>
