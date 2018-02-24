<template>
  <div class="anime-head">
	<upload class="anime-background" @input="([file]) => $emit('setCover', file)">
		<v-icon class="upload-icon">file_upload</v-icon>
		<preview :value="cover" alt="cover" width="100%"></preview>
	</upload>
	<div class="anime-poster">
		<upload class="anime-poster-img" @input="([file]) => $emit('setPoster', file)">
			<v-icon class="upload-icon">file_upload</v-icon>
			<preview :value="poster" alt="poster"></preview>
		</upload>
		<h3 class="uppercase">{{ names && names[0] }}</h3>
	</div>
  </div>
</template>

<script>
import { VIcon } from "vuetify/es5/components";
import Preview from "./Preview";
import Upload from "./Upload";

export default {
	name: "AnimeHead",
	props: ["names", "cover", "poster"],
	components: {
		VIcon,
		Preview,
		Upload
	}
};
</script>

<style lang="stylus">
  @import '../../stylus/main.styl';

	.anime-head {
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

			img {
				min-height: 100%;
				width: 100%;
				background: $main-color;
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
				min-height: 406px;
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
