<template>
  <div class="v-register-user">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">На этой странице Вы можете зарегистрировать пользователя в
            систему</p>
        </div>
      </div>
    </div>
    <div class="content">
      <b-container class="mb-3 mt-3">
        <b-row class="my-3 m-3">
          <b-col sm="2"></b-col>
          <b-col sm="8">
            <base-block title="Регистрация нового пользователя"
                        rounded
                        header-bg
                        content-full
                        header-class="text-center"
            >
              <BaseMessage
                  v-for="item in messages_data.messages"
                  :key="item.text"
                  :message_data="{type: messages_data.type, item: item}"
              />

              <b-form @submit.prevent="registerNewUser">
                <div class="py-2">
                  <div class="form-group">
                    <label class="form-check-label mb-2">Никнейм</label>
                    <b-form-input size="md"
                                  id="username"
                                  name="username"
                                  placeholder="Никнейм"
                                  v-model="user.username"
                                  required
                    >
                    </b-form-input>
                  </div>
                  <div class="form-group">
                    <label class="form-check-label mb-2">Роль пользователя
                    </label>
                    <b-form-select size="md"
                                   v-model="user.role"
                                   :options="roles"
                                   required
                    ></b-form-select>
                  </div>
                  <div class="form-group">
                    <label class="form-check-label mb-2">Пароль</label>
                    <b-form-input type="password"
                                  size="md"
                                  id="password"
                                  name="password"
                                  placeholder="Пароль"
                                  v-model="user.password"
                                  required
                    >
                    </b-form-input>
                  </div>
                  <div class="form-group">
                    <label class="form-check-label mb-2">Подтверждение пароля</label>
                    <b-form-input type="password"
                                  size="md"
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  placeholder="Подтверждение пароля"
                                  v-model="user.confirmPassword"
                                  required
                    >
                    </b-form-input>
                  </div>
                  <div class="d-flex">
                    <b-button type="submit"
                              variant="alt-success"
                              size="sm"
                    >
                      <i class="fa fa-plus m-1 mr-2"></i>Зарегистрировать
                    </b-button>
                  </div>
                </div>
              </b-form>
            </base-block>
          </b-col>
          <b-col sm="2"></b-col>
        </b-row>
      </b-container>
    </div>

  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";

export default {
  name: "v-register-user",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      user: {
        username: "",
        role: "employee",
        password: "",
        confirmPassword: ""
      },
      roles: [
        {value: "root", text: "root"},
        {value: "admin", text: "admin"},
        {value: "specialist", text: "specialist"},
        {value: "employee", text: "employee"}
      ]
    }
  },

  methods: {
    registerNewUser() {
      if (this.messages_data.messages && this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      let [
        right_username,
        right_password,
      ] = [
        /\w{4,50}/g,
        /^[a-zA-Z0-9_-]+/,
      ];
      if (!this.user.username) {
        this.messages_data.messages.push(
            {
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }
      if (!this.user.password) {
        this.messages_data.messages.push(
            {
              text: "Поле пароля обязательно для заполнения!"
            }
        );
      }
      if (!this.user.confirmPassword) {
        this.messages_data.messages.push(
            {
              text: "Поле 'подтверждения пароля' обязательно для заполнения!"
            }
        );
      }
      if (this.user.password && this.user.confirmPassword && (this.user.password !== this.user.confirmPassword)) {
        this.messages_data.messages.push(
            {
              text: "Введенные пароли не совпадают!"
            }
        );
      }
      if (this.user.username && !right_username.test(this.user.username)) {
        this.messages_data.messages.push(
            {
              text: "Имя пользователя может только состоять из латинских букв и должно быть от 4 до 50 символов в длину!"
            }
        );
      }
      if (this.user.password && !right_password.test(this.user.password)) {
        this.messages_data.messages.push(
            {
              text: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"
            }
        );
      }
      if (!this.messages_data.messages.length) {
        this.$http
            .post("/auth/register/", {
              username: this.user.username,
              role: this.user.role,
              password: this.user.password,
              confirmPassword: this.user.confirmPassword
            })
            .then(res => {
              this.messages_data = {type: res.data.status, messages: res.data.messages};
              if (res.data.status === "success") {
                [this.user.username, this.user.role] = ["", "employee"];
              }
            })
            .catch(err => console.log(err));
      }
      this.user.password = "";
      this.user.confirmPassword = "";
    }
  }
}
</script>