import "unhandled-rejection-polyfill/src/auto";

export const TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const SET_DARK_THEME = "DARK_THEME";
export const SET_ERROR = "ERROR";

const state = {
	darkTheme: localStorage.getItem("darkTheme") === "true",
	drawer: localStorage.getItem("drawer") === "true",
	error: false
};

export function onLoad(store) {
	window.addEventListener(
		"storage",
		event => {
			switch (event.key) {
				case "darkTheme":
					store.commit(SET_DARK_THEME, event.newValue === "true");
					break;
				case "drawer":
					store.commit(TOGGLE_DRAWER, event.newValue === "true");
					break;
			}
		},
		false
	);

	window.addEventListener("unhandledrejection", event => {
		console.warn(
			"WARNING: Unhandled promise rejection. Shame on you! Reason:",
			event.reason
		);
		store.commit(SET_ERROR, event.reason);
	});
}

const mutations = {
	[SET_DARK_THEME](state, darkTheme) {
		state.darkTheme = darkTheme;
	},
	[TOGGLE_DRAWER](state, drawer) {
		state.drawer = drawer;
	},
	[SET_ERROR](state, error) {
		state.error = error;
	}
};

const actions = {
	setDarkTheme({ commit }, darkTheme) {
		commit(SET_DARK_THEME, darkTheme);
		localStorage.setItem("darkTheme", darkTheme);
	},
	toggleDrawer({ commit }, drawer) {
		commit(TOGGLE_DRAWER, drawer);
		localStorage.setItem("drawer", drawer);
	},
	setError({ commit }, error) {
		commit(SET_ERROR, error);
	}
};

const getters = {
	darkTheme: ({ darkTheme }) => darkTheme,
	drawer: ({ drawer }) => drawer,
	error: ({ error }) => error
};

export default {
	state,
	mutations,
	actions,
	getters
};
