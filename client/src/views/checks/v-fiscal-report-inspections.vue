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
                                 v-model="inspectedClub"
                                 :options="availableClubs"
                  >
                  </b-form-select>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Дата проводимой проверки</label>
                  <b-form-input id="dateOfInspection"
                                name="dateOfInspection"
                                type="date"
                                :max="new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)"
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

export default {
  name: "v-fiscal-report-inspections",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      inspectedClub: "Гафурова (Душанбе) (отключен)",
      availableClubs: [
        {text: "Гафурова (Душанбе) (отключен)", value: "Гафурова (Душанбе) (отключен)"},
        {text: "Лохути (Душанбе) (до 09.11.2021)", value: "Лохути (Душанбе) (до 09.11.2021)"},
        {text: "01. Карабоев/Ганджина (Душанбе)", value: "01. Карабоев/Ганджина (Душанбе)"},
        {text: "Сомониён, Рудаки (Душанбе) (до 17.10.2021)", value: "Сомониён, Рудаки (Душанбе) (до 17.10.2021)"},
        {text: "02. Айни 269/9км (Душанбе)", value: "02. Айни 269/9км (Душанбе)"},
      ],
      dateOfInspection: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)
    }
  },

  methods: {
    addCarriedOutInspection() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.dateOfInspection > new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }
      if (!this.messages_data.messages.length) {
        console.log("QWE");
      }
    }
  }
}
</script>