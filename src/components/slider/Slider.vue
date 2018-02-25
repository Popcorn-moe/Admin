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
                    <v-btn icon flat small fab slot="activator">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <span>Ajouter une slide après la slide courante</span>
                  </v-tooltip>
                  <v-btn icon flat small fab >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs1 >
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator">
                      <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <span>Deplacer vers la gauche la slide</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn icon flat small fab slot="activator">
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                    <span>Deplacer vers la droite la slide</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </div>
            <v-carousel class="white--text" :cycle="play">
              <v-carousel-item v-for="(img,i) in news" :src="img" :key="i"></v-carousel-item>
            </v-carousel>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs12>
                <h3 class="headline mb-0">Slide X</h3>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Title"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Image"></v-text-field>
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

export default {
	name: "Slider",
	data() {
		return {
			news: [
				"https://images6.alphacoders.com/505/thumb-1920-505441.jpg",
				"https://images4.alphacoders.com/706/thumb-1920-706365.png",
				"https://ib3.hulu.com/show_key_art/12104?size=1600x600&region=US"
			],
			play: true,
			description: ""
		};
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
