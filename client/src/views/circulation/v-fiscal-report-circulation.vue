<template>
  <div class="v-fiscal-report-circulation">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">На этой странице Вы можете внести количество зарегистрированных
            квитанций</p>
        </div>
      </div>
    </div>
    <div class="content">
      <b-row class="">
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <b-form @submit.prevent="addNewCirculations">
            <base-block title="Внесение зарегистрированных квитанций"
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
              <div class="d-flex justify-content-between">
                <p>Лотерея</p>
                <div class="form-group ml-3">
                  <b-form-select size="md"
                                 v-model="selectedLotteryName"
                                 :options="availableLotteriesNames"
                  ></b-form-select>
                </div>
                <div class="ml-2 mb-4">
                  <b-button type="submit"
                            variant="alt-info"
                            size="sm"
                  >
                    <i class="fa fa-plus m-1 mr-2"></i>Внести тираж
                  </b-button>
                </div>
              </div>
              <div class="table-responsive">

                <table class="table table-bordered table-striped table-vcenter">
                  <thead>
                  <tr>
                    <th :style="{
                                'width': '25%',
                                'cursor': 'pointer'
                             }"
                        @click="sortField({sortedField: 'nominal'})"
                    >
                        <span class="ml-2">
                          Номинал
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortTypeNominal === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortTypeNominal === 'DESC'">
                          </i>
                        </span>
                    </th>
                    <th :style="{
                                'width': '40%',
                                'cursor': 'pointer'
                             }"
                        @click="sortField({sortedField: 'currentAmount'})"
                    >
                        <span class="ml-2">
                          Текущий остаток
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortTypeCurrentAmount === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortTypeCurrentAmount === 'DESC'">
                          </i>
                        </span>
                    </th>
                    <th class="text-center" style="width: 35%;">Вносимый тираж</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="lottery in availableLotteries[selectedLotteryName]"
                      :key="lottery.nominal"
                  >
                    <td class="fw-semibold fs-sm">
                      {{ lottery.nominal }}
                    </td>
                    <td class="fs-sm">{{ lottery.currentAmount }}</td>
                    <td>
                      <b-form-input type="number"
                                    size="md"
                                    id="broughtCirculation"
                                    name="broughtCirculation"
                                    pattern="^[0-9]+$"
                                    v-model="lottery.broughtCirculation"
                      >
                      </b-form-input>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </base-block>
          </b-form>
        </b-col>
        <b-col sm="2"></b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";

export default {
  name: "v-fiscal-report-circulation",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},

      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortedField: "nominal",
        sortTypeNominal: "ASC",
        sortTypeCurrentAmount: "",
      },

      availableLotteriesNames: [
        {value: "Дурдонаи Гаронбахо", text: "Дурдонаи Гаронбахо"},
        {value: "Хирадманди Хушхол", text: "Хирадманди Хушхол"},
        {value: "Киссахои Помир", text: "Киссахои Помир"},
        {value: "Хоча Насриддин", text: "Хоча Насриддин"},
        {value: "Гамбусаки Хушхол", text: "Гамбусаки Хушхол"},
        {value: "Хоча Насриддин", text: "Хоча Насриддин"},
        {value: "Миср", text: "Миср"},
        {value: "Мевахо", text: "Мевахо"},
        {value: "Киссахо", text: "Киссахо"},
        {value: "Рохи Абрешим", text: "Рохи Абрешим"},
      ],

      selectedLotteryName: "Дурдонаи Гаронбахо",

      availableLotteries: {
        "Дурдонаи Гаронбахо": [
          {nominal: 0.1, currentAmount: 1400, broughtCirculation: 0},
          {nominal: 0.2, currentAmount: 1300, broughtCirculation: 0},
          {nominal: 0.3, currentAmount: 1100, broughtCirculation: 0},
          {nominal: 0.4, currentAmount: 2400, broughtCirculation: 0},
          {nominal: 0.5, currentAmount: 300, broughtCirculation: 0},
        ],
        "Хирадманди Хушхол": [
          {nominal: 0.2, currentAmount: 2300, broughtCirculation: 0},
          {nominal: 0.4, currentAmount: 200, broughtCirculation: 0},
          {nominal: 0.5, currentAmount: 2100, broughtCirculation: 0},
          {nominal: 0.6, currentAmount: 600, broughtCirculation: 0},
        ],
        "Киссахои Помир": [{nominal: 0.3, currentAmount: 100, broughtCirculation: 0}],
        "Хоча Насриддин": [{nominal: 0.4, currentAmount: 1900, broughtCirculation: 0}],
        "Гамбусаки Хушхол": [{nominal: 0.5, currentAmount: 2400, broughtCirculation: 0}],
        "Миср": [{nominal: 0.6, currentAmount: 4500, broughtCirculation: 0}],
        "Мевахо": [{nominal: 0.7, currentAmount: 500, broughtCirculation: 0}],
        "Киссахо": [{nominal: 0.8, currentAmount: 1300, broughtCirculation: 0}],
        "Рохи Абрешим": [{nominal: 0.9, currentAmount: 400, broughtCirculation: 0}],
      },
    }
  },

  watch: {
    'selectedLotteryName'() {
      for (let availableLotteryIndex in this.availableLotteries) {
        for (let availableLottery of this.availableLotteries[availableLotteryIndex]) {
          availableLottery.broughtCirculation = 0;
        }
      }
    }
  },

  methods: {
    addNewCirculations() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      const lottery = this.availableLotteries[this.selectedLotteryName];
      let [isSomeNotZero, isSomeNotNumber, rightNumber] = [false, false, /^[0-9]+$/];
      for (let nominal of lottery) {
        if (typeof nominal.broughtCirculation === "string" && !rightNumber.test(nominal.broughtCirculation)) {
          isSomeNotNumber = true;
        }

        console.log(typeof nominal.broughtCirculation, nominal.broughtCirculation);
        if (nominal.broughtCirculation !== 0 && nominal.broughtCirculation !== "0") {
          isSomeNotZero = true;
        }

      }

      if (!isSomeNotZero) {
        this.messages_data.messages.push({
          text: `В лоттерее ${this.selectedLotteryName} надо заполнить данные хотя бы об одном номинале!`
        });
      }
      if (isSomeNotNumber) {
        this.messages_data.messages.push({
          text: "Вводиться должны исключительно неотрицательные целые числа!"
        });
      }

      if (!this.messages_data.messages.length) {
        console.log("QWE");
      }
    },

    sortField({sortedField = "nominal"}) {
      let sortedType = "ASC";
      this.sortData.sortedField = sortedField;
      if (sortedField === "nominal") {
        sortedType = this.sortData.sortTypeNominal = this.sortData.sortChangeType[this.sortData.sortTypeNominal];
        this.sortData.sortTypeCurrentAmount = "";
      } else if (sortedField === "currentAmount") {
        sortedType = this.sortData.sortTypeCurrentAmount = this.sortData.sortChangeType[this.sortData.sortTypeCurrentAmount];
        this.sortData.sortTypeNominal = "";
      }
      for (let availableLottery in this.availableLotteries) {
        this.availableLotteries[availableLottery].sort((lhs, rhs) => {
          if (lhs[this.sortData.sortedField] > rhs[this.sortData.sortedField]) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhs[this.sortData.sortedField] < rhs[this.sortData.sortedField]) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
          return 0;
        });
      }
    },
  }

}
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance: textfield; /* Firefox */
}

</style>