<template>
	<div>
		<v-snackbar
			class="snackbar"
			:timeout="6000"
			top
			:value="error"
			@input="setErrorValue"
		>
			<v-alert
				dismissible
				outline
				class="alert"
				type="error"
				:value="error"
				@input="setError"
			>
				An error occured
				<v-btn flat icon @click="seeError = true">
					<v-icon>visibility</v-icon>
				</v-btn>
			</v-alert>
		</v-snackbar>
		<v-dialog v-model="seeError" max-width="500" scrollable>
			<v-card>
				<v-card-text>
					<pre>{{ error }}</pre>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {
	VSnackbar,
	VAlert,
	VBtn,
	VIcon,
	VDialog,
	VCard
} from "vuetify/es5/components";
import { VCardText } from "vuetify/es5/components/VCard";
import { mapGetters, mapActions } from "vuex";

export default {
	data() {
		return {
			seeError: false
		};
	},
	components: {
		VSnackbar,
		VAlert,
		VBtn,
		VIcon,
		VDialog,
		VCard,
		VCardText
	},
	computed: mapGetters({
		drawer: "drawer",
		error: "error"
	}),
	methods: {
		...mapActions({
			toggleDrawer: "toggleDrawer",
			setError: "setError"
		}),
		setErrorValue(val) {
			if (val === false && !this.seeError) this.setError(false);
		}
	},
	watch: {
		seeError(value) {
			if (value === false) this.setError(false);
		}
	}
};
</script>

<style>

</style>
