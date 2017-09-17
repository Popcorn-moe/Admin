<template>
  <v-container>
    <div class="text-xs-center">
      <h2 class="headline">Users</h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="users"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" scope="props">
          <td>
            <img class="user-avatar" :src="props.item.avatar">
          </td>
         <td>
            <v-edit-dialog lazy> {{ props.item.login }}
              <v-text-field
                slot="input"
                v-model="props.item.login"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td>
            <v-edit-dialog lazy> {{ props.item.email }}
              <v-text-field
                slot="input"
                v-model="props.item.email"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td>
            <v-select
              class="table-select"
              :items="userGroups"
              @input="v => props.item.group = toSnakeCase(v)"
              :value="fromSnakeCase(props.item.group)"
              single-line
            ></v-select>
          </td>
          <td align="right">
            <v-btn icon @click.stop="() => removeUser(props.item)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
     <v-layout row wrap>
        <v-flex xs2 class="text-xs-left">
          <v-btn primary>
            Add Tag
          </v-btn>
        </v-flex>
        <v-flex offset-xs8 xs2 class="text-xs-right">
          <v-btn primary>
            Save
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import { VDataTable, VIcon, VBtn, VTextField, VSelect } from 'vuetify/src/components'
import VEditDialog from 'vuetify/src/components/VDataTable/VEditDialog'
import { VContainer, VFlex, VLayout } from 'vuetify/src/components/VGrid'
import gql from 'graphql-tag'

export default {
  data() {
    return {
      headers: [
        {
          text: 'Avatar',
          align: 'left',
          sortable: false,
          value: 'avatar'
        },
        {
          text: 'Login',
          align: 'left',
          value: 'name'
        }, {
          text: 'Email',
          align: 'left',
          value: 'email'
        }, {
          text: 'Group',
          align: 'left',
          value: 'group'
        },
      ],
      users: [],
      userGroups: [],
      deleted: []
    }
  },
  components: {
    VContainer,
    VFlex,
    VLayout,
    VDataTable,
    VIcon,
    VBtn,
    VEditDialog,
    VTextField,
    VSelect
  },
  methods: {
    fromSnakeCase(value) {
      if(!value) return ''
      return value.split('_').map(w => this.capitalize(w)).join(' ')
    },
    toSnakeCase(value) {
      if(!value) return ''
      return value.split(' ').map(w => w.toUpperCase()).join('_')
    },
    capitalize(value) {
      if(!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    removeUser(user) {
      this.users.splice(this.users.indexOf(user), 1)
      if (user.id)
        this.deleted.push(tag.id)
    }
  },
  apollo: {
    users: {
        query: gql`{ users { id avatar email login group } }`,
        update: ({ users }) => users.map(user => Object.assign({}, user)) //Clone to avoid seal
    },
    userGroups: {
      query: gql`{
        __type(name: "UserGroup") {
          enumValues {
            name
          }
        }
      }`,
      update({ __type: { enumValues }}) {
        return enumValues.map(e => this.fromSnakeCase(e.name))
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '../../stylus/main'

  .table-select.input-group {
    padding: 5px;
    & > .input-group__details {
      min-height: 0;
    }
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
</style>