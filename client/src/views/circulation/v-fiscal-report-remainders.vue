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
            <b-row v-if="loading.isLoading === true"
                   class="mt-2"
            >
              <b-col sm="1"></b-col>
              <b-col sm="1">
                <div>
                  <i class="fa fa-2x fa-cog fa-spin"></i>
                </div>
              </b-col>
              <b-col sm="5">
                <div class="mt-1">
                  {{ this.loading.availablePhrases[this.loading.currentPhraseIndex] }}
                </div>
              </b-col>
            </b-row>
            <div class="table-responsive mb-0"
                 v-if="tableOfRemainders.remaindersData.length > 0"
            >
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th style="width: 15%">
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
                  <th v-for="(nominal, indexOfNominal) in tableOfRemainders.availableNominals"
                      :key="nominal"
                      :style="{
                                'width': '12px',
                                'cursor': 'pointer'
                              }"
                      @click="sortField({requireSortingField: nominal, indexOfNominal: indexOfNominal})"
                  >
                    <span class="ml-2">
                          {{ nominal }}
                          <i class="si si-arrow-up m-2"
                             v-if="sortData.sortFields[nominal] === 'ASC'">
                          </i>
                          <i class="si si-arrow-down m-2"
                             v-else-if="sortData.sortFields[nominal] === 'DESC'">
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

      loading: {
        isLoading: false,
        availablePhrases: [
          "Составляем отчет...", "Тратим спины...",
          "Участвуем в лотерее...", "Переводим бумагу на отчет...",
          "Выигрываем джекпот...", "Делаем ставки...",
          "Призываем удачу...", "Перемешиваем лотерейные билеты..."
        ],
        currentPhraseIndex: 0,
      },

      dateOfReport: moment().subtract(1, "day").format().slice(0, 10),
      maxDate: moment().subtract(1, "day").format().slice(0, 10),
      actualDate: moment().subtract(2, "day").format().slice(0, 10),
      tableOfRemainders: {
        countOfNominals: 0,
        availableNominals: [],
        remaindersData: [],
      }
    }
  },

  created() {
    this.loading.isLoading = true;
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
            this.tableOfRemainders.remaindersData = [];
            this.tableOfRemainders.availableNominals = [];
            this.tableOfRemainders.countOfNominals = 0;
            this.sortData.sortFields = {"lottery": "ASC",};
            if (res.data.status === "success") {
              this.preprocessingOfRemainders(res.data.remaindersData);
            }
            this.loading.isLoading = false;
            this.messages_data = {type: res.data.status, messages: res.data.messages};
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    preprocessingOfRemainders(remaindersData) {
      const tempRemaindersData = remaindersData;
      // необходимо сформировать список ВСЕХ номиналов в системе для таблицы
      for (let lottery of tempRemaindersData) {
        for (let remainder of lottery.remainders) {
          if (this.tableOfRemainders.availableNominals.findIndex(availableNominal => availableNominal === remainder.value) < 0) {
            this.tableOfRemainders.availableNominals.push(remainder.value);
          }
        }
      }
      // для отображения на странице всех номиналов определенной ширины
      this.tableOfRemainders.countOfNominals = 85 / this.tableOfRemainders.availableNominals.length;

      // отсортировать список ВСЕХ номиналов от меньшего к большему
      this.tableOfRemainders.availableNominals.sort((lhs, rhs) => {
        return parseFloat(lhs) - parseFloat(rhs);
      });

      // заполняем массив для сортировки по номиналам
      for (let availableNominal of this.tableOfRemainders.availableNominals) {
        this.sortData.sortFields[availableNominal] = "";
      }
      // console.log(this.sortData.sortFields);
      // console.log(this.tableOfRemainders.availableNominals);

      // теперь надо создать таблицу, где для каждого номинала будет информация
      // (если у какой-то лотереи нет какого-то номинала, тогда ставим "-")
      // this.tableOfRemainders.remaindersData.forEach(rem => console.log('3u3a', rem));

      for (let lottery of tempRemaindersData) {
        const tempRemainders = [];
        for (let availableNominal of this.tableOfRemainders.availableNominals) {
          const receivedNominal = lottery.remainders.find(remainder => remainder.value === availableNominal);
          if (receivedNominal) {
            tempRemainders.push({value: receivedNominal.value, amount: receivedNominal.amount});
          } else {
            tempRemainders.push({value: availableNominal, amount: "-"});
          }
        }
        this.tableOfRemainders.remaindersData.push({
          lottery: lottery.lottery,
          remainders: tempRemainders
        });
        // tempRemainders.forEach(rem => console.log(rem));
      }
      // this.tableOfRemainders.remaindersData.forEach(rem => console.log('4u4a', rem));
    },

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
        this.loading.isLoading = true;
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
                this.tableOfRemainders.remaindersData = [];
                this.tableOfRemainders.availableNominals = [];
                this.tableOfRemainders.countOfNominals = 0;
                this.sortData.sortFields = {"lottery": "ASC",};
                if (res.data.status === "success") {
                  this.preprocessingOfRemainders(res.data.remaindersData);
                }
                this.loading.isLoading = false;
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

    sortField({requireSortingField = "lottery", indexOfNominal = -1}) {
      console.error(requireSortingField);
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
          console.log(lhs.remainders[indexOfNominal].value, lhs.remainders[indexOfNominal].amount);
          console.log(lhs.remainders[indexOfNominal].value, rhs.remainders[indexOfNominal].amount);
          const lhsValue = (lhs.remainders[indexOfNominal].amount !== "-") ? lhs.remainders[indexOfNominal].amount : 1;
          const rhsValue = (rhs.remainders[indexOfNominal].amount !== "-") ? rhs.remainders[indexOfNominal].amount : 1;
          if (lhsValue > rhsValue) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhsValue < rhsValue) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
          return 0;
        });
      }
    }
  }

}
</script>