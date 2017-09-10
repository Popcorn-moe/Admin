
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'

const state = {
  drawer: localStorage.getItem('drawer') === 'true',
}

export function onLoad (store) {
  window.addEventListener('storage', event => {
    switch (event.key) {
        case 'drawer':
            store.commit(TOGGLE_DRAWER, event.newValue === 'true')
            break;
    }
  }, false)
}

const mutations = {
  [TOGGLE_DRAWER] (state, drawer) {
      state.drawer = drawer
  }
}

const actions = {
  toggleDrawer({ commit }, drawer) {
    commit(TOGGLE_DRAWER, drawer)
    localStorage.setItem('drawer', drawer)
  }
}

const getters = {
    drawer: ({ drawer }) => drawer
}

export default {
  state,
  mutations,
  actions,
  getters
}