<template>
  <div class="v-fiscal-report-inspections">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">Страница для записи проведенных проверок</p>
        </div>
      </div>
    </div>
    <div class="content">
      <b-container class="mb-3 mt-3">
        <b-row>
          <b-col sm="3"></b-col>
          <b-col sm="6">
            <b-form @submit.prevent="addCarriedOutInspection">
              <base-block title="Добавление проведенной проверки"
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
                <div class="form-group">
                  <label class="form-check-label mb-2">Клуб</label>
                  <b-form-select size="md"
                                 v-model="inspectedPartner"
                                 :options="allPartners"
                  >
                  </b-form-select>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Дата проводимой проверки</label>
                  <b-form-input id="dateOfInspection"
                                name="dateOfInspection"
                                type="date"
                                :max="maxDate"
                                v-model="dateOfInspection"
                  >
                  </b-form-input>
                  <span style="font-size: 0.7em">
                    Только дни ранее или сегодня (будущие даты запрещены)
                  </span>
                </div>
                <b-button type="submit"
                          variant="alt-info"
                          size="sm"
                >
                  <i class="fa fa-plus m-1 mr-2"></i>Записать
                </b-button>
              </base-block>
            </b-form>
          </b-col>
          <b-col sm="3"></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import moment from "moment";
import breakAuth from "@/utils/authorization";

export default {
  name: "v-fiscal-report-inspections",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      inspectedPartner: "",
      allPartners: [],
      dateOfInspection: moment().format().slice(0, 10),
      maxDate: moment().format().slice(0, 10)
    }
  },

  created() {
    this.$http
        .get("/partner/get-all-partners/")
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            for (let partner of res.data.availablePartners) {
              this.allPartners.push({
                id: partner.id,
                text: partner.name,
                value: partner.name
              });
            }
            for (let partner of res.data.disabledPartners) {
              this.allPartners.push({
                id: partner.id,
                text: `${partner.name} (до ${partner.closedAt})`,
                value: `${partner.name} (до ${partner.closedAt})`
              });
            }
            this.inspectedPartner = this.allPartners[0].text;
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    addCarriedOutInspection() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.dateOfInspection > this.maxDate) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }
      if (!this.messages_data.messages.length) {
        console.log(this.allPartners.filter(partner => partner.text === this.inspectedPartner));
        this.$http
            .post("/coefficient/addInspection/", {
              id: this.allPartners.filter(partner => partner.text === this.inspectedPartner)[0].id,
              dateOfInspection: this.dateOfInspection
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
              }
            })
            .catch(err => console.error(err));
      }
    }
  }
}
</script>