<template>
  <img :src="source" :width="width" :height="height" :alt="alt"/>
</template>

<script>
export default {
	props: ["value", "width", "height", "alt"],
	data() {
		return {
			source: null
		};
	},
	created() {
		this.value && this.setSource(this.value);
	},
	watch: {
		value(val) {
			val && this.setSource(val);
		}
	},
	methods: {
		setSource(val) {
			console.log(typeof val);
			if (typeof val === "string") this.source = val;
			else {
				const reader = new FileReader();
				reader.addEventListener("load", ({ target: { result } }) => {
					this.source = result;
				});
				reader.readAsDataURL(val);
			}
		}
	}
};
</script>
