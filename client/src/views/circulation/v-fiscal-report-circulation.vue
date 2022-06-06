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
                <span class="h5">Лотерея</span>
                <div class="form-group ml-3">
                  <b-form-select size="md"
                                 v-model="selectedLotteryId"
                                 :options="availableLotteriesNames"
                  ></b-form-select>
                </div>
                <div class="ml-2 mb-4">
                  <b-button type="submit"
                            variant="alt-info"
                            size="sm"
                            :disabled="selectedLotteryId === 0"
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
                        @click="sortField({requireSortingField: 'value'})"
                    >
                        <span class="ml-2">
                          Номинал
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortFields['value'] === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortFields['value'] === 'DESC'">
                          </i>
                        </span>
                    </th>
                    <th :style="{
                                'width': '40%',
                                'cursor': 'pointer'
                             }"
                        @click="sortField({requireSortingField: 'currentAmount'})"
                    >
                        <span class="ml-2">
                          Текущий остаток
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortFields['currentAmount'] === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortFields['currentAmount'] === 'DESC'">
                          </i>
                        </span>
                    </th>
                    <th class="text-center" style="width: 35%;">Вносимый тираж</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="nominal in nominals"
                      :key="nominal.id"
                  >
                    <td class="fw-semibold fs-sm">
                      {{ nominal.value }}
                    </td>
                    <td class="fs-sm">{{ nominal.currentAmount }}</td>
                    <td>
                      <b-form-input type="number"
                                    size="md"
                                    id="broughtCirculation"
                                    name="broughtCirculation"
                                    pattern="^[0-9]+$"
                                    v-model="nominal.broughtCirculation"
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
import breakAuth from "@/utils/authorization";
import moment from "moment";

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
        sortFields: {
          "value": "ASC",
          "currentAmount": "",
        },
      },

      availableLotteriesNames: [],

      selectedLotteryId: 0,
      nominals: [],
    }
  },

  watch: {
    'selectedLotteryId'(selectedLotteryId) {
      this.$http
          .get(`/stats/balance/${selectedLotteryId}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.nominals = [];
              for (let nominal of res.data.nominals) {
                nominal.broughtCirculation = 0;
                nominal.value = Number(nominal.value);
                this.nominals.push(nominal);
              }
              // сортировка по такому же принципу
              let [sortedField, sortType] = ["", ""];
              for (let sortedFieldIndex in this.sortData.sortFields) {
                if (this.sortData.sortFields[sortedFieldIndex]) {
                  [sortedField, sortType] = [sortedFieldIndex, this.sortData.sortFields[sortedFieldIndex]];
                }
              }
              this.nominals.sort((lhs, rhs) => {
                if (lhs[sortedField] > rhs[sortedField]) {
                  return this.sortData.sortComparator[sortType + ">"];
                }
                if (lhs[sortedField] < rhs[sortedField]) {
                  return this.sortData.sortComparator[sortType + "<"];
                }
                return 0;
              });
            }
          })
          .catch(err => console.error(err));


    }
  },

  created() {
    this.$http
        .get("/lottery/get-all-lotteries/")
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            for (let lottery of res.data.lotteries) {
              this.availableLotteriesNames.push({
                text: lottery.name,
                value: lottery.id
              });
            }
            this.selectedLotteryId = this.availableLotteriesNames[0].value;
          }
        })
        .catch(err => console.error(err))
  },

  methods: {
    addNewCirculations() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }

      const lottery = {
        lotteryId: this.selectedLotteryId,
        date: moment().format("YYYY-MM-DD"),
        nominals: []
      };
      for (let nominal of this.nominals) {
        if (nominal.broughtCirculation) {
          lottery.nominals.push({
            id: nominal.id,
            broughtCirculation: nominal.broughtCirculation
          });
        }
      }
      this.nominals.map(function (nominal) {
        if (nominal.broughtCirculation) {
          return {
            id: nominal.id,
            broughtCirculation: nominal.broughtCirculation
          };
        }
      });

      if (!lottery.nominals.length) {
        this.messages_data.messages.push({
          text: `В лотерее надо заполнить данные хотя бы об одном номинале!`
        });
      } else {
        let [isSomeNotNumber, rightNumber] = [false, /^[0-9]+$/];
        for (let nominal of lottery.nominals) {
          if (typeof nominal.broughtCirculation === "string" && !rightNumber.test(String(nominal.broughtCirculation))) {
            isSomeNotNumber = true;
            nominal.broughtCirculation = Number(nominal.broughtCirculation);
          }
        }
        if (isSomeNotNumber) {
          this.messages_data.messages.push({
            text: "Вводиться должны исключительно неотрицательные целые числа!"
          });
        }
      }

      if (!this.messages_data.messages.length) {
        this.$http
            .post("/pack/make-pack/", lottery)
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
              }
            })
            .catch(err => console.error(err));
      }
    },

    sortField({requireSortingField = 'value'}) {
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        if (requireSortingField === sortField) {
          sortedType = this.sortData.sortFields[sortField] = this.sortData.sortChangeType[this.sortData.sortFields[requireSortingField]]
        } else {
          this.sortData.sortFields[sortField] = "";
        }
      }
      this.nominals.sort((lhs, rhs) => {
        if (lhs[requireSortingField] > rhs[requireSortingField]) {
          return this.sortData.sortComparator[sortedType + ">"];
        }
        if (lhs[requireSortingField] < rhs[requireSortingField]) {
          return this.sortData.sortComparator[sortedType + "<"];
        }
        return 0;
      });
    }
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