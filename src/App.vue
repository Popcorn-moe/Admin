<template>
  <v-app>
    <div v-if="me">
      <layout v-if="me.group === 'ADMIN'"></layout>
      <div v-else class="unauthorized">
        Unauthorized
      </div>
    </div>
  </v-app>
</template>

<script>
  import { VApp } from 'vuetify/src/components'
  import Layout from './components/layout/Layout'
  import gql from 'graphql-tag'

  export default {
    data() {
      return {
        me: false
      }
    },
    components: {
      Layout,
      VApp
    },
    apollo: {
      me: {
          query: gql`{ me { group } }`,
          update: ({ me }) => me
      }
    }
  }
</script>
