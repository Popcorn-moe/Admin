<template>
	<div>
		<v-snackbar
			class="snackbar"
			:timeout="60000"
			top
			:value="error"
			@input="setError"
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
		<v-dialog v-if="seeError = true">
		</v-dialog>
	</div>
</template>

<script>
import {
	VSnackbar,
	VAlert,
	VBtn,
	VIcon,
	VDialog
} from "vuetify/es5/components";
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
		VDialog
	},
	computed: mapGetters({
		drawer: "drawer",
		error: "error"
	}),
	methods: mapActions({
		toggleDrawer: "toggleDrawer",
		setError: "setError"
	})
};
</script>

<style>

</style>
