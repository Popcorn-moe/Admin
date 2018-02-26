<template>
  <v-container grid-list-md>
    <v-layout class="slider-edit" row wrap>
      <v-flex xs12>
        <v-expansion-panel>
          <v-expansion-panel-content value="true">
            <div slot="header">
              <v-layout>
                <v-flex xs11>
                  Preview
                  <v-btn icon flat small fab @click.stop="play = !play">
                    <v-icon>{{ play ? "pause" : "play_arrow" }}</v-icon>
                  </v-btn>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator" @click.stop="add()">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <span>Ajouter une slide après la slide courante</span>
                  </v-tooltip>
                  <v-btn icon flat small fab @click.stop="removeCurrentSlide">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex lg2>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator" @click.stop="">
                      <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <span>Deplacer vers la gauche la slide</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator" @click.stop="">
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                    <span>Deplacer vers la droite la slide</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </div>
            <v-carousel v-model="slide" class="white--text" :cycle="play" :key="slides.length == 0">
              <v-carousel-item v-if="slides.length == 0">
                <h1 class="text-xs-center">Slider Vide</h1>
              </v-carousel-item>
              <v-carousel-item v-else v-for="(v, i) in slides" :src="v.image" :key="i">
                <h1>{{ v.title }}</h1>
                <p>{{ v.desc }}</p>
              </v-carousel-item>
            </v-carousel>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 v-if="slides.length == 0" class="headline mb-0"> Aucune Slide</h3>
            <v-layout row wrap v-else>
              <v-flex xs12>
                <h3 class="headline mb-0">Slide {{ slide + 1 }}</h3>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Title" v-model="slides[slide].title"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-layout>
                  <v-flex xs1>
                    <v-btn top icon color="primary" class="slide-upload-icon">
                      <v-icon>file_upload</v-icon>
                      <input type="file" @change="$input => changeImage($input)">
                    </v-btn>
                  </v-flex>
                  <v-flex xs11>
                    <v-text-field label="Image"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-subheader>Description</v-subheader>
                <mavon-editor language="en" v-model="description"></mavon-editor>
              </v-flex>
              <v-flex xs1 offset-xs11>
                <v-btn color="primary" block>Save</v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import { VCarousel, VCarouselItem } from "vuetify/es5/components/VCarousel";
import {
	VExpansionPanel,
	VExpansionPanelContent
} from "vuetify/es5/components/VExpansionPanel";
import { VCard, VCardText, VCardTitle } from "vuetify/es5/components/VCard";
import {
	VBtn,
	VIcon,
	VTooltip,
	VTextField,
	VSubheader
} from "vuetify/es5/components";
import { mavonEditor as MavonEditor } from "mavon-editor";
import gql from "graphql-tag";

/*

[
				"https://images6.alphacoders.com/505/thumb-1920-505441.jpg",
				"https://images4.alphacoders.com/706/thumb-1920-706365.png",
				"https://ib3.hulu.com/show_key_art/12104?size=1600x600&region=US"
			]

 */

const EDIT_SLIDE = gql`
	mutation($id: ID!, $slide: SlideInput!) {
		result: editSlide(id: $id, slide: $slide) {
			error
		}
	}
`;
const ADD_SLIDE = gql`
	mutation($slide: SlideInput!) {
		result: addSlide(slide: $slide) {
			error
		}
	}
`;

export default {
	name: "Slider",
	data() {
		return {
			slides: [],
			play: false,
			description: "",
			slide: 0
		};
	},
	apollo: {
		slides: {
			query: gql`
				{
					slider {
						id
						title
						desc
						image
					}
				}
			`,
			update: ({ slider }) => slider.map(n => Object.assign({}, n))
		}
	},
	methods: {
		add() {
			this.slides.push({
				image: null,
				title: null,
				desc: null
			});
			this.$nextTick(_ => {
				this.slide++;
				if (this.slide >= this.slides.length)
					this.slide = this.slide = this.slides.length - 1;
			});
		},
		changeImage({ target: { files: [file] } }) {
			this.save({ ...this.slides[this.slide], file });
		},
		removeCurrentSlide() {
			this.slides.splice(this.slide, 1);
			if (this.slide >= this.slides.length) this.slide--;
		},
		save(data) {
			const { id, title, desc, file } = data;
			this.$apollo
				.mutate({
					mutation: id ? EDIT_SLIDE : ADD_SLIDE,
					variables: {
						id,
						slide: {
							id,
							title,
							desc,
							image: file
						}
					}
				})
				.then(({ data: { result } }) => {
					console.log(result);
				});
		}
	},
	components: {
		VTextField,
		VIcon,
		VBtn,
		VTooltip,
		VContainer,
		VFlex,
		VLayout,
		VExpansionPanel,
		VExpansionPanelContent,
		VCard,
		VCardText,
		VCardTitle,
		VCarousel,
		VCarouselItem,
		VSubheader,
		MavonEditor
	}
};
</script>


<style lang="stylus">
  @import "../../stylus/main.styl";

  .slide-upload-icon {
    input[type=file] {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      outline: none;
      cursor: inherit;
      display: block;
    }
  }
</style>
