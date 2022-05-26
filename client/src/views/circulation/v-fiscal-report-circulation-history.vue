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
              <b-row class="my-1 m-1 mb-4">
                <b-col sm="1.5" class="mb-1"><span>История за</span></b-col>
                <b-col sm="3" class="mb-3">
                  <b-form-input id="historyDate"
                                name="historyDate"
                                type="date"
                                :max="new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)"
                                v-model="historyDate"
                  >
                  </b-form-input>
                </b-col>
                <b-col sm="5">
                  <div>
                    <b-button type="submit"
                              variant="alt-info"
                              size="sm"
                              class="mt-1"
                    >
                      <i class="fa fa-plus m-1 mr-2"></i>Выгрузить в Excel
                    </b-button>
                  </div>
                </b-col>
                <b-col sm="2.5"></b-col>
              </b-row>
            </b-form>
            <div class="table-responsive">
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
                             :key="denomination[0]"
                             class="mb-2"
                        >
                          <b>{{ denomination[0] }}</b>: {{ denomination[1] }}
                        </div>
                      </b-col>
                      <b-col sm="2"></b-col>
                      <b-col sm="3">
                        <div v-for="denomination in lottery.composition.slice(halfLength(lottery.composition))"
                             :key="denomination[0]"
                             class="mb-2"
                        >
                          <b>{{ denomination[0] }}</b>: {{ denomination[1] }}
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
          "dateOfIssue": "ASC",
          "lottery": "",
        }
      },

      historyDate: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10),
      historyLotteryData: [
        {
          dateOfIssue: "2022-02-25", lottery: "Дурдонаи Гаронбахо", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [0.5, 20000], [1, 5000], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 9
        },
        {
          dateOfIssue: "2022-03-20", lottery: "Хоча Насриддин", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [0.5, 20000], [5, 1000], [10, 324]
          ], id: 7
        },
        {
          dateOfIssue: "2022-04-07", lottery: "Хирадманди Хушхол", composition: [
            [0.1, 100000], [0.4, 40000], [0.5, 20000], [1, 5000], [2, 7500], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 6
        },
        {
          dateOfIssue: "2022-05-02", lottery: "Гамбусаки Хушхол", composition: [
            [0.1, 100000], [0.2, 80000], [2, 7500], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 8
        },
        {
          dateOfIssue: "2022-05-04", lottery: "Гамбусаки Хушхол", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [0.5, 20000], [1, 5000], [2, 7500], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 1
        },
        {
          dateOfIssue: "2022-05-04", lottery: "Дурдонаи Гаронбахо", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [0.5, 20000], [1, 5000], [4, 540], [5, 1000], [10, 324]
          ], id: 4
        },
        {
          dateOfIssue: "2022-05-05", lottery: "Киссахои Помир", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [4, 540], [5, 1000], [10, 324]
          ], id: 10
        },
        {
          dateOfIssue: "2022-05-06", lottery: "Киссахои Помир", composition: [
            [0.1, 100000], [0.2, 80000], [2, 7500], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 5
        },
        {
          dateOfIssue: "2022-05-14", lottery: "Хоча Насриддин", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [2, 7500], [3, 4600], [4, 540], [5, 1000], [10, 324]
          ], id: 2
        },
        {
          dateOfIssue: "2022-05-20", lottery: "Хирадманди Хушхол", composition: [
            [0.1, 100000], [0.2, 80000], [0.3, 60000], [0.4, 40000], [0.5, 20000], [1, 5000], [2, 7500], [3, 4600]
          ], id: 3
        },
      ]
    }
  },

  methods: {
    halfLength: function (arr) {
      return (arr.length % 2) ? ~~(arr.length / 2) + 1 : ~~(arr.length / 2);
    },

    createExcel() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.historyDate > new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }

      if (!this.messages_data.messages.length) {
        this.$http
            .get("/excel-reports/create-history-report/", {responseType: "blob"})
            .then(res => {
              console.log(res.data);
              FileSaver.saveAs(res.data, "CirculationsPerDay.xlsx")
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
