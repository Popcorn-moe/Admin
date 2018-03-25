<template>
  <v-app v-if="me && me.group === 'ADMIN'" :light="!darkTheme" :dark="darkTheme">
    <layout></layout>
  </v-app>
  <v-app v-else-if="me !== false" dark>
    <div class="unauthorized">
      <div class="unauthorized_image">
        <img src="https://media.giphy.com/media/njYrp176NQsHS/giphy.gif" frameBorder="0">
      </div>
      <h3>You are not allowed to see this page.</h3>
      <p v-if="me">Poor little {{ me.login }}...</p>
    </div>
		<div class="konami">
			<v-icon v-if="konamiPreview.icon" v-html="konamiPreview.icon" :color="konamiPreview.color"></v-icon>
			<span v-else-if="konamiPreview.text" v-html="konamiPreview.text" :class="{ [`${konamiPreview.color}--text`]: true }"></span>
		</div>
  </v-app>
</template>

<script>
import { VApp, VIcon } from "vuetify/es5/components";
import { mapGetters } from "vuex";
import Layout from "./components/layout/Layout";
import gql from "graphql-tag";
import { setTimeout, clearTimeout } from "timers";

const KONAMI_CODE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a"
];
const KONAMI_PREVIEW_TIME = 500;
const KEY_ICON = {
	ArrowUp: {
		icon: "keyboard_arrow_up",
		color: "purple",
		sound: "/static/sounds/up.mp3"
	},
	ArrowDown: {
		icon: "keyboard_arrow_down",
		color: "amber",
		sound: "/static/sounds/down.mp3"
	},
	ArrowLeft: {
		icon: "keyboard_arrow_left",
		color: "pink",
		sound: "/static/sounds/left.mp3"
	},
	ArrowRight: {
		icon: "keyboard_arrow_right",
		color: "indigo",
		sound: "/static/sounds/right.mp3"
	},
	a: { text: "A", color: "green", sound: "/static/sounds/A.mp3" },
	b: { text: "B", color: "brown", sound: "/static/sounds/B.mp3" }
};

export default {
	data() {
		return {
			me: false,
			konamiPosition: 0,
			konamiPreview: {}
		};
	},
	mounted() {
		document.addEventListener("keydown", this.onKeyDown);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.onKeyDown);
	},
	methods: {
		onKeyDown({ key }) {
			if (key === "Shift")
				// Ignore shift
				return;

			if (this.konamiPreviewTimeout) clearTimeout(this.konamiPreviewTimeout);

			if (
				KONAMI_CODE[this.konamiPosition++].toLowerCase() === key.toLowerCase()
			) {
				if (this.konamiPosition == KONAMI_CODE.length) {
					setTimeout(() => {
						this.me = {
							group: "ADMIN"
						};
						document.removeEventListener("keydown", this.onKeyDown);
					}, KONAMI_PREVIEW_TIME);
				}

				this.konamiPreview = KEY_ICON[key] || KEY_ICON[key.toLowerCase()];
				new Audio(this.konamiPreview.sound).play();
				this.konamiPreviewTimeout = setTimeout(
					() => (this.konamiPreview = {}),
					KONAMI_PREVIEW_TIME
				);
			} else {
				this.konamiPosition = 0;
				this.konamiPreview = {};
			}
		}
	},
	components: {
		Layout,
		VApp,
		VIcon
	},
	computed: {
		...mapGetters({
			darkTheme: "darkTheme"
		})
	},
	apollo: {
		me: {
			query: gql`
				{
					me {
						group
						login
					}
				}
			`,
			update: ({ me }) => me
		}
	}
};
</script>

<style lang="stylus">
	.unauthorized {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
    
		.unauthorized_image {
			width: 100%;
			height: auto;
		}
    
		h3 {
			text-align: center;
		}
		p {
			text-align: center;
		}
	}
	.konami {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		& > .icon {
			font-size: 150px;
			text-shadow: 5px 5px black;
		}
		& > span {
			font-size: 75px;
			font-weight: bold;
			text-shadow: 5px 5px black;
		}
	}
  
</style>
