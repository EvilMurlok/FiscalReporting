<template>
  <div class="v-fiscal-report-circulation-history">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 mb-0">На этой странице Вы можете просмотреть историю выпуска тиражей</p>
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
          <base-block title="История выпуска тиражей"
                      rounded
                      header-bg
                      content-full
                      header-class="text-center"
          >
            <b-form @submit.prevent="createExcel">
              <b-row class="my-1 m-1 mb-2">
                <b-col sm="2" class="mb-1">
                  <div class="mt-1">
                    <span class="h5">История за</span>
                  </div>
                </b-col>
                <b-col sm="0.5">
                  <b-button variant="alt-info"
                            size="sm"
                            class="mt-1 mb-2"
                            @click="showHistory('minus')"
                  >
                    <i class="fa fa-minus"></i>
                  </b-button>
                </b-col>
                <b-col sm="3" class="mb-2">
                  <b-form-input id="historyDate"
                                name="historyDate"
                                type="date"
                                :max="maxDate"
                                v-model="historyDate"
                  >
                  </b-form-input>
                </b-col>
                <b-col sm="0.5">
                  <b-button variant="alt-info"
                            size="sm"
                            class="mt-1 mb-2"
                            @click="showHistory('plus')"
                  >
                    <i class="fa fa-plus"></i>
                  </b-button>
                </b-col>
                <b-col sm="1"></b-col>
                <b-col sm="2" class="mb-2">
                  <div>
                    <b-button variant="alt-info"
                              size="sm"
                              class="mt-1"
                              @click="showHistory"
                    >
                      <i class="si si-info m-1 mr-2"></i>Показать
                    </b-button>
                  </div>
                </b-col>
                <b-col sm="3" class="mt-1">
                  <div>
                    <b-button variant="alt-success"
                              size="sm"
                              @click="createExcel"
                              :disabled="historyLotteryData.length === 0"
                    >
                      <i class="far fa-file-excel m-1 mr-2"></i>Выгрузить в Excel
                    </b-button>
                  </div>
                </b-col>
              </b-row>
              <b-row class="my-1 m-1 mb-4">

              </b-row>
            </b-form>
            <div class="table-responsive"
                 v-if="historyLotteryData.length > 0"
            >
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th :style="{
                                'width': '15%',
                                'cursor': 'pointer'
                             }"
                      @click="sortField({requireSortingField: 'dateOfIssue'})"
                  >
                    <span class="ml-2">
                      Дата выпуска
                      <i class="si si-arrow-up m-2"
                         v-if="sortData.sortFields['dateOfIssue'] === 'ASC'">
                      </i>
                      <i class="si si-arrow-down m-2"
                         v-else-if="sortData.sortFields['dateOfIssue'] === 'DESC'">
                      </i>
                    </span>
                  </th>
                  <th :style="{
                                'width': '25%',
                                'cursor': 'pointer'
                              }"
                      style=""
                      @click="sortField({requireSortingField: 'lottery'})">
                    <span class="ml-2">
                      Лотерея
                      <i class="si si-arrow-up m-2"
                         v-if="sortData.sortFields['lottery'] === 'ASC'">
                      </i>
                      <i class="si si-arrow-down m-2"
                         v-else-if="sortData.sortFields['lottery'] === 'DESC'">
                      </i>
                    </span>
                  </th>
                  <th style="width: 45%">
                    Состав тиража
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="lottery in historyLotteryData"
                    :key="lottery.id"
                >
                  <td class="fw-semibold fs-sm">
                    {{ lottery.dateOfIssue }}
                  </td>
                  <td class="fw-semibold fs-sm">
                    {{ lottery.lottery }}
                  </td>
                  <td class="fw-semibold fs-sm">
                    <b-row>
                      <b-col sm="2"></b-col>
                      <b-col sm="3">
                        <div v-for="denomination in lottery.composition.slice(0, halfLength(lottery.composition))"
                             :key="denomination.value"
                             class="mb-2"
                        >
                          <b>{{ denomination.value }}</b>: {{ denomination.amount }}
                        </div>
                      </b-col>
                      <b-col sm="2"></b-col>
                      <b-col sm="3">
                        <div v-for="denomination in lottery.composition.slice(halfLength(lottery.composition))"
                             :key="denomination.value"
                             class="mb-2"
                        >
                          <b>{{ denomination.value }}</b>: {{ denomination.amount }}
                        </div>
                      </b-col>
                    </b-row>
                  </td>
                </tr>
                </tbody>
              </table>
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
  name: "v-fiscal-report-circulation-history",

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
          "dateOfIssue": "",
          "lottery": "ASC",
        }
      },
      historyDate: moment().format().slice(0, 10),
      maxDate: moment().format().slice(0, 10),
      historyLotteryData: []
    }
  },

  created() {
    this.$http
        .get("/pack/history/", {
          params: {
            date: this.historyDate
          }
        })
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            if (res.data.status === "success") {
              console.log(res.data.history);

              this.historyLotteryData = res.data.history;
            }
            this.messages_data = {type: res.data.status, messages: res.data.messages};
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    halfLength: function (arr) {
      return (arr.length % 2) ? ~~(arr.length / 2) + 1 : ~~(arr.length / 2);
    },

    showHistory(movement = "no") {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.historyDate === this.maxDate && movement === "plus") {
        this.messages_data = {
          type: "warning", messages: [{
            text: "Уже и так выбрана максимальная дата!"
          }]
        };
      } else {
        if (movement === "plus") {
          this.historyDate = moment(this.historyDate).add(1, "day").format("YYYY-MM-DD");
        } else if (movement === "minus") {
          this.historyDate = moment(this.historyDate).subtract(1, "day").format("YYYY-MM-DD");
        }
        this.$http
            .get("/pack/history/", {
              params: {
                date: this.historyDate
              }
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.status === "success") {
                  this.historyLotteryData = res.data.history;
                } else {
                  this.historyLotteryData = [];
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
      if (this.historyDate > this.maxDate) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }

      if (!this.messages_data.messages.length) {
        this.$http
            .get("/excel-reports/create-history-report/", {
              responseType: "blob",
              params: {
                date: this.historyDate
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

    sortField({requireSortingField = 'dateOfIssue'}) {
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        if (requireSortingField === sortField) {
          sortedType = this.sortData.sortFields[sortField] = this.sortData.sortChangeType[this.sortData.sortFields[requireSortingField]]
        } else {
          this.sortData.sortFields[sortField] = "";
        }
      }
      this.historyLotteryData.sort((lhs, rhs) => {
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
