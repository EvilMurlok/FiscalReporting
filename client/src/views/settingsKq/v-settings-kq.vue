<template>
  <div class="v-settings-rq">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">Страница, где Вы можете задать коэффициент Kq</p>
        </div>
      </div>
    </div>
    <div class="content">
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
      <b-container class="mb-3 mt-3">
        <b-row class="my-3 m-3">
          <b-col sm="2"></b-col>
          <b-col sm="8">
            <b-form @submit.prevent="setUpSettings">
              <base-block title="Настройка коэффициента Kq"
                          rounded
                          header-bg
                          content-full
                          header-class="text-center"
              >
                <div class="form-group">
                  <label class="form-check-label mb-2">Коэффициент Kq</label>
                  <div class="d-flex justify-content-between">
                    <b-form-input :class="validateData.isRightRange"
                                  size="md"
                                  id="coefficientKq"
                                  name="coefficientKq"
                                  v-model="settings.coefficientKq"
                    >
                    </b-form-input>
                    <div class="ml-2 mt-2"
                         v-if="validateData.isRightRange === 'border-success'"
                    >
                      <i class="si si-check m-1" style="color: #54950d"></i>
                    </div>
                    <div class="ml-2 mt-2"
                         v-if="validateData.isRightRange === 'border-warning'"
                    >
                      <i class="si si-close m-1" style="color: #e3410d"></i>
                    </div>
                  </div>
                  <span style="font-size: 0.7em">
                    Коэффициент должен лежать в пределеах [0;1]
                  </span>
                </div>
                <div class="d-flex">
                  <b-button type="submit"
                            variant="alt-info"
                            size="sm"
                            :disabled="validateData.isRightRange === 'border-warning'"
                  >
                    <i class="fa fa-info-circle m-1"></i> Применить
                  </b-button>
                </div>
              </base-block>
            </b-form>
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
  name: "v-settings-rq",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      settings: {
        coefficientKq: "",
        updateTime: "",
      },
      validateData: {
        rightNumber: new RegExp('^[0-9.,]+$'),
        isRightRange: "border-right",
        isRightTime: 2
      }
    }
  },

  watch: {
    'settings.coefficientKq'(coefficientKq) {
      if (coefficientKq) {
        if (this.validateData.rightNumber.test(coefficientKq)) {
          coefficientKq = coefficientKq.replace(",", ".");
          coefficientKq = parseFloat(coefficientKq);
          if (coefficientKq < 0 || coefficientKq > 1) {
            this.validateData.isRightRange = "border-warning";
          } else if (coefficientKq <= 1 && coefficientKq >= 0) {
            this.validateData.isRightRange = "border-success";
          }
        } else {
          this.validateData.isRightRange = "border-warning";
        }
      } else {
        this.validateData.isRightRange = "border-right";
      }
    },
  },

  created() {

  },

  methods: {
    setUpSettings() {
      console.log("QWE");
    }
  }
}
</script>