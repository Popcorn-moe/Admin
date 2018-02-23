<template>
  <div>
    <div class="color-result"
      @click.stop="() => show = true"
      @focus="() => show = true"
      :style="{ 'background-color': value }"
    ></div>
    <color-picker ref="picker" class="color-picker" v-show="show" :value="{ 'hex': value }" @input="({ hex }) => this.$emit('input', hex)"></color-picker>
  </div>
</template>

<script>
import ColorPicker from "vue-color/src/components/Chrome.vue";

export default {
	props: ["value"],
	data() {
		return {
			show: false
		};
	},
	mounted() {
		this.event = event => {
			const el = this.$refs.picker.$el;
			if (this.show && !(el == event.target || el.contains(event.target)))
				this.show = false;
		};
		document.body.addEventListener("click", this.event);
	},
	beforeDestroy() {
		document.body.removeEventListener("click", this.event);
	},
	components: {
		ColorPicker
	}
};
</script>

<style lang="scss">
@import "../../sass/_variables.scss";

.color-result {
	display: inline-block;
	height: 35px;
	width: 35px;
	border-radius: 50%;
	border: solid 1px #999;
	cursor: pointer;
}

.color-picker {
	position: absolute;
	z-index: 999;
	transform: translate(-50%, -50%);
}
</style>
