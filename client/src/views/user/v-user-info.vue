<template>
  <div class="v-user-item">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">На этой странице можно посмотреть Вашу личную информацию</p>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <b-container class="mb-3 mt-3">
        <b-row class="my-3 m-3">
          <b-col sm="2"></b-col>
          <b-col sm="8">
            <base-block title="Личная информация"
                        rounded
                        header-bg
                        content-full
                        header-class="text-center"
            >
              <div class="form-group">
                <label class="form-check-label mb-2">Никнейм</label>
                <b-form-input size="lg"
                              id="usernameInfo"
                              name="usernameInfo"
                              v-model="user.username"
                              disabled
                >
                </b-form-input>
              </div>
              <div class="form-group">
                <label class="form-check-label mb-2">Роль пользователя в системе</label>
                <b-form-input size="lg"
                              id="roleInfo"
                              name="roleInfo"
                              v-model="user.role"
                              disabled
                >
                </b-form-input>
              </div>
              <div class="form-group">
                <label class="form-check-label mb-2">Ваш аккаунт был создан </label>
                <h2 class="mb-3">
                  <b-badge variant="primary">{{ userCreatedDate }}</b-badge>
                </h2>
              </div>
            </base-block>
          </b-col>
          <b-col sm="2"></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import {mapActions} from "vuex";
import store from "../../../vuex/store";
import moment from "moment";

export default {
  name: "v-user-info",

  computed: {
    userCreatedDate: function () {
      moment.locale("ru");
      return moment(this.user.created).format("LLLL");
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.user = store.getters.USER;
  },
  data() {
    return {
      messages_data: {type: "warning", messages: []},
      user: {
        id: 0,
        username: "",
        created: "",
        role: ""
      }
    }
  },
  methods: {
    ...mapActions(["SET_USER"]),
  }
}
</script>