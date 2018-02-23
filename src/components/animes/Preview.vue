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
	watch: {
		value(val) {
			if (val) {
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
