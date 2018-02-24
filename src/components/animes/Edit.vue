<template>
  <div v-if="anime" class="edit-page">
	<upload class="anime-background" @input="([file]) => anime.background = file">
		<v-icon class="upload-icon">file_upload</v-icon>
		<preview :value="anime.background" alt="cover" width="100%"></preview>
	</upload>
	<div class="anime-poster">
		<upload class="anime-poster-img" @input="([file]) => anime.cover = file">
			<v-icon class="upload-icon">file_upload</v-icon>
			<preview :value="anime.cover" alt="poster"></preview>
		</upload>
		<h3 class="uppercase">{{ anime.names && anime.names[0] }}</h3>
	</div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { client } from "../../graphql";
import { VIcon } from "vuetify/es5/components";
import Preview from "./Preview";
import Upload from "./Upload";

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
		Preview,
		Upload,
		VIcon
	}
};
</script>

<style lang="stylus">
  	@import '../../stylus/main.styl';

	.edit-page {
		.anime-background, .anime-poster-img {
			position: relative;

			.upload-icon {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1;
				font-size: 58px;
				background: black;
				opacity: 0;

				&:hover {
				opacity: 0.8;
				}
			}
		}

		.anime-background {
			overflow-y: hidden;
			height: 405px;

			img {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			.upload-icon {
				height: 406px;
			}
		}

		.anime-poster {
			padding-top: 30px;

			.anime-poster-img {
				display: inline-block;
				z-index: 2;
				box-shadow: 0px 2px 12px 0px rgba(16,16,17,0.5);
				margin-right: 18px;
				margin-top: -105px;
				margin-left: 8.333333333333332%;
				width: 180px;
				height: 250px;

				img {
					position: absolute;
					width: 100%;
					height: 100%;
				}

				.upload-icon {
					z-index: 2;
				}
			}

			h3 {
				display: inline;
				vertical-align: top;
			}
		}
	}
</style>
