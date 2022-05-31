<template>
  <div class="v-fiscal-report-remainders">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">Просмотр остатков зарегистрированных квитанций</p>
        </div>
      </div>
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
    </div>
    <div class="content">
      <b-row>
        <b-col sm="12">
          <base-block title="Остатки лотерейных квитанций"
                      rounded
                      header-bg
                      content-full
                      header-class="text-center"
          >
            <b-form @submit.prevent="showRemainders">
              <b-row class="my-1 m-1">
                <b-col sm="2" class="mb-1">
                  <div class="mt-1">
                    <span class="h5">Остаток на </span>
                  </div>
                </b-col>
                <b-col sm="0.5">
                  <b-button variant="alt-info"
                            size="sm"
                            class="mt-1 mb-2"
                            @click="showRemainders('minus')"
                  >
                    <i class="fa fa-minus"></i>
                  </b-button>
                </b-col>
                <b-col sm="3">
                  <div class="form-group">
                    <b-form-input id="dateOfInspection"
                                  name="dateOfInspection"
                                  type="date"
                                  :max="maxDate"
                                  v-model="dateOfReport"
                    >
                    </b-form-input>
                  </div>
                </b-col>
                <b-col sm="0.5">
                  <b-button variant="alt-info"
                            size="sm"
                            class="mt-1 mb-2"
                            @click="showRemainders('plus')"
                  >
                    <i class="fa fa-plus"></i>
                  </b-button>
                </b-col>
                <b-col sm="1"></b-col>
                <b-col sm="1" class="mb-2">
                  <div>
                    <b-button type="submit"
                              variant="alt-info"
                              size="sm"
                              class="mt-1"
                    >
                      <i class="si si-info m-1 mr-2"></i>Показать
                    </b-button>
                  </div>
                </b-col>
                <b-col sm="1"></b-col>
                <b-col sm="3">
                  <div class="mb-3">
                    <b-button variant="alt-success"
                              size="sm"
                              class="mt-1"
                              @click="createExcel"
                    >
                      <i class="far fa-file-excel m-1 mr-2"></i>Выгрузить в Excel
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-form>
            <div class="table-responsive mb-0"
                 v-if="tableOfRemainders.remaindersData.length > 0"
            >
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th style="width: 20%">
                    <div :style="{
                                     'background-image': 'linear-gradient(to bottom left, transparent 48%, #d8dce4ff, transparent 50%)',
                                     'background-repeat': 'no-repeat',
                                     'text-align': 'center',
                                     'height': '100%'
                                  }"
                    >
                      <div class="mt-2 ml-7">
                        Номинал
                      </div>
                      <div class="mt-3 mr-7"
                           style="cursor: pointer"
                           @click="sortField({requireSortingField: 'lottery', indexOfDenomination: -1})"
                      >
                        Лотерея
                        <i class="si si-arrow-up m-2"
                           v-if="sortData.sortFields['lottery'] === 'ASC'">
                        </i>
                        <i class="si si-arrow-down m-2"
                           v-else-if="sortData.sortFields['lottery'] === 'DESC'">
                        </i>
                      </div>
                    </div>
                  </th>
                  <th v-for="(denomination, indexOfDenomination) in tableOfRemainders.availableDenominations"
                      :key="denomination"
                      :style="{
                                'width': `${tableOfRemainders.countOfDenominations}%`,
                                'cursor': 'pointer'
                              }"
                      @click="sortField({requireSortingField: denomination, indexOfDenomination: indexOfDenomination})"
                  >
                    <span class="ml-2">
                          {{ denomination }}
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortFields[denomination] === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortFields[denomination] === 'DESC'">
                          </i>
                    </span>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="lottery in tableOfRemainders.remaindersData"
                    :key="lottery.lottery"
                >
                  <td class="fw-semibold fs-sm">
                    {{ lottery.lottery }}
                  </td>
                  <td v-for="remainder in lottery['remainders']"
                      :key="remainder.value"
                      class="fs-sm"
                  >
                    {{ remainder.amount }}
                  </td>
                </tr>
                </tbody>
              </table>
              <div style="font-size: 0.7em"
                   class="mt-3"
              >
                Данные актуальны на {{ actualDate }} 23:59:59</div>
            </div>
          </base-block>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import FileSaver from "file-saver";
import moment from "moment";
import breakAuth from "@/utils/authorization";

export default {
  name: "v-fiscal-report-remainders",

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
          "lottery": "ASC",
        }
      },

      dateOfReport: moment().format().slice(0, 10),
      maxDate: moment().format().slice(0, 10),
      actualDate: moment().subtract(1, "day").format().slice(0, 10),
      tableOfRemainders: {
        countOfDenominations: 0,
        availableDenominations: [],
        remaindersData: [],
      }
    }
  },

  created() {
    this.$http
        .get("/stats/balance-report/", {
          params: {
            date: this.dateOfReport
          }
        })
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            if (res.data.status === "success") {
              this.tableOfRemainders.remaindersData = res.data.remaindersData;
              this.tableOfRemainders.availableDenominations = this.tableOfRemainders.remaindersData[0].remainders.map(remainder => remainder.value);
              this.tableOfRemainders.countOfDenominations = 80 / this.tableOfRemainders.remaindersData[0].remainders.length;
              for (let denomination of this.tableOfRemainders.availableDenominations) {
                this.sortData.sortFields[denomination] = "";
              }
            } else {
              this.tableOfRemainders.remaindersData = this.tableOfRemainders.availableDenominations = [];
              this.tableOfRemainders.countOfDenominations = 0;
              this.sortData.sortFields = {"lottery": "ASC",};
            }
            this.messages_data = {type: res.data.status, messages: res.data.messages};
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    showRemainders(movement = "no") {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.dateOfReport === this.maxDate && movement === "plus") {
        this.messages_data = {
          type: "warning", messages: [{
            text: "Уже и так выбрана максимальная дата!"
          }]
        };
      } else {
        if (movement === "plus") {
          this.dateOfReport = moment(this.dateOfReport).add(1, "day").format("YYYY-MM-DD");
        } else if (movement === "minus") {
          this.dateOfReport = moment(this.dateOfReport).subtract(1, "day").format("YYYY-MM-DD");
        }
        this.$http
            .get("/stats/balance-report/", {
              params: {
                date: this.dateOfReport
              }
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.status === "success") {
                  this.tableOfRemainders.remaindersData = res.data.remaindersData;
                  this.tableOfRemainders.availableDenominations = this.tableOfRemainders.remaindersData[0].remainders.map(remainder => remainder.value);
                  this.tableOfRemainders.countOfDenominations = 80 / this.tableOfRemainders.remaindersData[0].remainders.length;
                  for (let denomination of this.tableOfRemainders.availableDenominations) {
                    this.sortData.sortFields[denomination] = "";
                  }
                } else {
                  this.tableOfRemainders.remaindersData = this.tableOfRemainders.availableDenominations = [];
                  this.tableOfRemainders.countOfDenominations = 0;
                  this.sortData.sortFields = {"lottery": "ASC",};
                }
                this.messages_data = {type: res.data.status, messages: res.data.messages};
              }
            })
            .catch(err => console.error(err));
      }
    },

    createExcel() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.dateOfReport > this.maxDate) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }
      if (!this.messages_data.messages.length) {
        this.$http
            .get("/excel-reports/create-remainders-report/",
                {
                  responseType: "blob",
                  params: {
                    date: this.dateOfReport
                  }
                })
            .then(res => {
              if (res.data.status === "warning") {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
              } else {
                FileSaver.saveAs(res.data, "CirculationsPerDay.xlsx")
              }
            })
            .catch(err => console.error(err));
      }
    },

    sortField({requireSortingField = "lottery", indexOfDenomination = -1}) {
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        if (requireSortingField === sortField) {
          sortedType = this.sortData.sortFields[sortField] = this.sortData.sortChangeType[this.sortData.sortFields[requireSortingField]]
        } else {
          this.sortData.sortFields[sortField] = "";
        }
      }
      if (requireSortingField === "lottery") {
        this.tableOfRemainders.remaindersData.sort((lhs, rhs) => {
          if (lhs[requireSortingField] > rhs[requireSortingField]) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhs[requireSortingField] < rhs[requireSortingField]) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
          return 0;
        });
      } else {
        this.tableOfRemainders.remaindersData.sort((lhs, rhs) => {
          if (lhs["remainders"][indexOfDenomination].amount > rhs["remainders"][indexOfDenomination].amount) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhs["remainders"][indexOfDenomination].amount < rhs["remainders"][indexOfDenomination].amount) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
          return 0;
        });
      }
    }
  }

}
</script>