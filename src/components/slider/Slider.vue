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
                  <v-btn icon flat small fab @click.stop="removeCurrentSlide" :disabled="slides.length == 0">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex lg2>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator" @click.stop="moveSlide('left')" :disabled="slides.length < 2 || slide < 1">
                      <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <span>Deplacer vers la gauche la slide</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator" @click.stop="moveSlide('right')" :disabled="slides.length < 2 || slide == slides.length - 1">
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
              <v-carousel-item v-else v-for="(v, i) in slides" :src="v.image" ref="items" :key="i">
                <div class="slide-content">
                  <v-layout v-if="v.title">
                    <v-flex class="title" xs6 lg3 md3>{{ v.title }}</v-flex>
                  </v-layout>
                  <v-layout v-if="v.desc">
                    <v-flex class="desc" v-html="desc(v.desc)" xs12 lg6 md6></v-flex>
                  </v-layout>
                </div>
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
										<upload @input="([file]) => changeImage(file)">
											<v-btn top icon color="primary">
												<v-icon>file_upload</v-icon>
											</v-btn>
										</upload>
                  </v-flex>
                  <v-flex xs11>
                    <v-text-field label="Image" v-model="slides[slide].image"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-subheader>Description</v-subheader>
                <mavon-editor language="en" v-model="slides[slide].desc"></mavon-editor>
              </v-flex>
              <v-flex xs2 offset-xs10>
                <v-btn color="primary" block @click.stop="save()">Save</v-btn>
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
import Upload from "../Upload";
import { mavonEditor as MavonEditor } from "mavon-editor";
import gql from "graphql-tag";
import marked from "marked";

const EDIT_SLIDE = gql`
	mutation($id: ID!, $slide: SlideInput!) {
		slide: editSlide(id: $id, slide: $slide) {
			id
			title
			desc
			image
		}
	}
`;
const ADD_SLIDE = gql`
	mutation($slide: SlideInput!) {
		slide: addSlide(slide: $slide) {
			id
			title
			desc
			image
		}
	}
`;

const DEL_SLIDE = gql`
	mutation($id: ID!) {
		id: delSlide(id: $id)
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
		desc(desc) {
			return marked(desc);
		},
		add() {
			this.slides.splice(Math.min(this.slide + 1, this.slides.length), 0, {
				image: "",
				title: "",
				desc: ""
			});
			this.$nextTick(() => {
				this.slide++;
				if (this.slide >= this.slides.length)
					this.slide = this.slides.length - 1;
			});
		},
		moveSlide(direction) {
			const current = this.slides[this.slide];
			const oldPos = this.slide;
			this.slides.splice(this.slide, 1);
			if (direction === "left") this.slide--;
			else if (direction === "right") this.slide++;
			this.slides.splice(this.slide, 0, current);
			this.save(oldPos);
			this.save(this.slide);
		},
		changeImage(file) {
			this.slides[this.slide].file = file;
			this.save(this.slide);
		},
		removeCurrentSlide() {
			const id = this.slides[this.slide].id;
			const removeSlide = () => {
				this.slides.splice(this.slide, 1);
				if (this.slide >= this.slides.length)
					this.slide = Math.max(this.slides.length - 1, 0);
			};
			if (id) {
				this.$apollo
					.mutate({
						mutation: DEL_SLIDE,
						variables: { id }
					})
					.then(({ data: { id } }) => {
						removeSlide();
					});
			} else removeSlide();
		},
		save(slide = this.slide) {
			const { id, title, desc, file } = this.slides[slide];
			this.$apollo
				.mutate({
					mutation: id ? EDIT_SLIDE : ADD_SLIDE,
					variables: {
						id,
						slide: {
							title,
							desc,
							image: file,
							index: slide
						}
					}
				})
				.then(({ data: { slide: newSlide } }) => {
					this.$set(this.slides, slide, {
						...newSlide,
						index: slide
					});
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
		Upload,
		MavonEditor
	}
};
</script>


<style lang="stylus">
  @import "../../stylus/main.styl";

  .slide-content {
    margin-left 30px;
    margin-right 30px;
    margin-top 30vh !important
    .title {
      font-size 25pt !important
      background-color rgba(38, 38, 38, 0.68)
      padding-left 15px;
      padding-right 15px;
    }

    .desc {
      margin-top 10px
      background-color rgba(38, 38, 38, 0.48)
      padding-left 15px;
      padding-right 15px;
    }
  }
</style>
