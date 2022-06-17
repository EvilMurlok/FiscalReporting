<template>
  <div class="v-fiscal-report">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">Страница для формирования отчетности о реализаци электронных
            лотерейных квитанций</p>
        </div>
      </div>
    </div>
    <div class="content">
      <b-row>
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <b-form @submit.prevent="createReport">
            <base-block title="Отчетность по клубам"
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
                <div class="d-flex justify-content-end mb-1">
                  <b-button variant="alt-info"
                            class="m-1 pr-2 pl-2"
                            size="sm"
                            v-if="checkBoxesData.isSelectedAvailableAll === true"
                            @click="deselectAll({type: 'available'})"
                  >
                    <i class="si si-close opacity-50 mr-1"></i>Убрать все
                  </b-button>
                  <b-button v-else
                            variant="alt-info"
                            class="m-1 pr-2 pl-2"
                            size="sm"
                            @click="selectAll({type: 'available'})"
                  >
                    <i class="si si-check opacity-50 mr-1"></i> Выделить все
                  </b-button>
                </div>
                <b-form-checkbox-group
                    v-model="checkBoxesData.availablePartnersIds"
                    id="availablePartnersIds"
                    stacked
                >
                  <b-row class="mb-3">
                    <b-col sm="4"></b-col>
                    <b-col sm="4">
                      <label class="form-check-label font-size-h4">Активные клубы</label>
                    </b-col>
                    <b-col sm="4"></b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="1"></b-col>
                    <b-col sm="5">
                      <b-form-checkbox v-for="club in availablePartners.slice(0, halfAvailablePartnersLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"
                      >
                        <b>{{ club.name }}</b>
                      </b-form-checkbox>
                    </b-col>
                    <b-col sm="1"></b-col>
                    <b-col sm="5">
                      <b-form-checkbox v-for="club in availablePartners.slice(halfAvailablePartnersLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"

                      >
                        <b>{{ club.name }}</b>
                      </b-form-checkbox>
                    </b-col>
                  </b-row>
                </b-form-checkbox-group>
              </div>
              <div :style="{
                              'width': '90%',
                              'border-bottom': '1px solid #d8dce4ff',
                              'position': 'absolute',
                           }"
                   class="ml-2"
              >
              </div>
              <div v-if="disabledPartners.length > 0">
                <div class="form-group mt-5">
                  <div class="d-flex justify-content-end mb-1">
                    <b-button variant="alt-info"
                              class="m-1 pr-2 pl-2"
                              size="sm"
                              v-if="checkBoxesData.isSelectedDisabledAll === true"
                              @click="deselectAll({type: 'disable'})"
                    >
                      <i class="si si-close opacity-50 mr-1"></i>Убрать все
                    </b-button>
                    <b-button v-else
                              variant="alt-info"
                              class="m-1 pr-2 pl-2"
                              size="sm"
                              @click="selectAll({type: 'disable'})"
                    >
                      <i class="si si-check opacity-50 mr-1"></i> Выделить все
                    </b-button>
                  </div>
                  <b-form-checkbox-group
                      v-model="checkBoxesData.disabledPartnersIds"
                      id="disabledPartnersIds"
                      stacked
                  >
                    <b-row class="mb-3">
                      <b-col sm="4"></b-col>
                      <b-col sm="6">
                        <label class="form-check-label font-size-h4">Отключенные клубы</label>
                      </b-col>
                      <b-col sm="2"></b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="1"></b-col>
                      <b-col sm="5">
                        <b-form-checkbox v-for="club in disabledPartners.slice(0, halfDisablePartnersLength)"
                                         :key="club.id"
                                         :value="club.id"
                                         class="mb-2"
                        >
                          <span class="text-muted">{{ club.name }} (до {{ club.closedAt }})</span>
                        </b-form-checkbox>
                      </b-col>
                      <b-col sm="1"></b-col>
                      <b-col sm="5">
                        <b-form-checkbox v-for="club in disabledPartners.slice(halfDisablePartnersLength)"
                                         :key="club.id"
                                         :value="club.id"
                                         class="mb-2"

                        >
                          <span class="text-muted">{{ club.name }} (до {{ club.closedAt }})</span>
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-form-checkbox-group>
                </div>
                <div :style="{
                              'width': '90%',
                              'border-bottom': '1px solid #d8dce4ff',
                              'position': 'absolute',
                           }"
                     class="ml-2"
                >
                </div>
              </div>
              <b-row class="mt-5">
                <b-col sm="1"></b-col>
                <b-col sm="3" class="mb-3">
                  <label class="form-check-label mb-1">Начало</label>
                  <b-form-input id="startDateOfReport"
                                name="startDateOfReport"
                                type="date"
                                v-model="startDateOfReport"
                  >
                  </b-form-input>
                </b-col>
                <b-col sm="3">
                  <label class="form-check-label mb-1">Конец</label>
                  <b-form-input id="endDateOfReport"
                                name="endDateOfReport"
                                type="date"
                                v-model="endDateOfReport"
                  >
                  </b-form-input>
                </b-col>
                <b-col sm="1"></b-col>
                <b-col sm="4" class="mt-3">
                  <b-button type="submit"
                            variant="alt-info"
                            size="sm"
                            class="mt-3"
                  >
                    <i class="far fa-file opacity-50 mr-1"></i> Сформировать отчет
                  </b-button>
                </b-col>
              </b-row>
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
            </base-block>
          </b-form>
        </b-col>
        <b-col sm="2"></b-col>
      </b-row>
      <base-block title="Таблица с отчетностью"
                  rounded
                  header-bg
                  content-full
                  header-class="text-center"
                  v-if="reportTable.isVisible === true"
      >
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th :style="{
                            'width': '15%',
                            'cursor': 'pointer'
                        }"
                  rowspan="2"
              >
                <span style="cursor: pointer"
                      @click="sortField({requireSortingField: 'lotteryName'})"
                >
                  Лотерея
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['lotteryName'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['lotteryName'] === 'DESC'">
                  </i>
                </span>
              </th>
              <th :style="{
                            'width': '8%',
                            'cursor': 'pointer'
                        }"
                  rowspan="2"
              >
                <span style="cursor: pointer"
                      @click="sortField({requireSortingField: 'totalSold'})"
                >
                  Общая сумма продажи
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['totalSold'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['totalSold'] === 'DESC'">
                  </i>
                </span>
              </th>
              <th :colspan="reportTable.availableNominals.length"
                  rowspan="1"
                  class="text-center"
              >
                <span>
                  Количество проданных лотерейных квитанций по номиналам
                </span>
              </th>
              <th :style="{
                            'width': '9%',
                            'cursor': 'pointer'
                        }"
                  rowspan="2"
              >
                <span style="cursor: pointer"
                      @click="sortField({requireSortingField: 'totalWin'})"
                >
                  Выплачено выигрышей
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['totalWin'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['totalWin'] === 'DESC'">
                  </i>
                </span>
              </th>
              <th :style="{
                            'width': '8%',
                            'cursor': 'pointer'
                        }"
                  rowspan="2"
              >
                <span style="cursor: pointer"
                      @click="sortField({requireSortingField: 'totalTax'})"
                >
                  НДФЛ удержано
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['totalTax'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['totalTax'] === 'DESC'">
                  </i>
                </span>
              </th>
            </tr>
            <tr>
              <th v-for="(nominal, indexOfNominal) in reportTable.availableNominals"
                  :key="nominal"
                  :style="{
                          'width': '12px',
                          'cursor': 'pointer'
                        }"
                  rowspan="1"
                  @click="sortField({requireSortingField: nominal, requiredNominalIndex: indexOfNominal})"
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
            <tr v-for="lottery in reportTable.reportData"
                :key="lottery.lotteryName"
            >
              <td class="fw-semibold fs-sm">
                <b>{{ lottery.lotteryName }}</b>
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.totalSold }}
              </td>
              <td v-for="nominalData in lottery.nominals"
                  :key="nominalData.value"
                  class="fs-sm"
              >
                {{ nominalData.sold }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.totalWin }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.totalTax }}
              </td>
            </tr>
            <tr>
              <td class="fw-semibold fs-sm">
                <b>Итого за период</b>
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumTotalSold.toFixed(2) }}
              </td>
              <td class="fw-semibold fs-sm"
                  v-for="sumNominal in reportTable.amountsOfSoldNominals"
                  :key="sumNominal.value"
              >
                {{ sumNominal.sold }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumTotalWin.toFixed(2) }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumTotalTax.toFixed(2) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <b-button variant="alt-success"
                  size="sm"
                  class="mt-3"
                  @click="createGlobalReport({
                        from: startDateOfReport,
                        to: endDateOfReport,
                        partnerIds: [...checkBoxesData.availablePartnersIds, ...checkBoxesData.disabledPartnersIds]
                      })"
        >
          <i class="far fa-file-excel m-1 mr-2"></i>Выгрузить в Excel
        </b-button>
      </base-block>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import FileSaver from "file-saver";
import breakAuth from "@/utils/authorization";
import moment from "moment";

export default {
  name: "v-fiscal-report",

  components: {
    BaseMessage
  },

  computed: {
    halfAvailablePartnersLength: function () {
      return (this.availablePartners.length % 2) ? ~~(this.availablePartners.length / 2) + 1 : ~~(this.availablePartners.length / 2);
    },

    halfDisablePartnersLength: function () {
      return (this.disabledPartners.length % 2) ? ~~(this.disabledPartners.length / 2) + 1 : ~~(this.disabledPartners.length / 2);
    },

    maxAvailableDate: function () {
      return moment().subtract(1, "day").format("YYYY-MM-DD");
    }
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},

      checkBoxesData: {
        availablePartnersIds: [],
        disabledPartnersIds: [],
        isSelectedAvailableAll: false,
        isSelectedDisabledAll: false,
      },

      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortFields: {
          "lotteryName": "ASC",
          "totalSold": "",
          "totalWin": "",
          "totalTax": ""
        }
      },

      availablePartners: [],

      disabledPartners: [],

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

      reportTable: {
        isVisible: false,
        maxCountOfNominals: 0,
        availableNominals: [],
        reportData: [],
        sumTotalSold: 0.0,
        amountsOfSoldNominals: [],
        sumTotalWin: 0.0,
        sumTotalTax: 0.0,
      },
      startDateOfReport: "",
      endDateOfReport: ""
    }
  },

  created() {
    this.startDateOfReport = moment().subtract(1, "day").format("YYYY-MM-DD");
    this.endDateOfReport = moment().subtract(1, "day").format("YYYY-MM-DD");
    this.$http
        .get("/partner/get-all-partners/")
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            [this.availablePartners, this.disabledPartners] = [res.data.availablePartners, res.data.disabledPartners];
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    selectAll({type = "available"}) {
      if (type === "available") {
        this.checkBoxesData.availablePartnersIds = [];
        this.checkBoxesData.availablePartnersIds = this.availablePartners.map(club => club.id);
        this.checkBoxesData.isSelectedAvailableAll = true;
      } else {
        this.checkBoxesData.disabledPartnersIds = [];
        this.checkBoxesData.disabledPartnersIds = this.disabledPartners.map(club => club.id);
        this.checkBoxesData.isSelectedDisabledAll = true;
      }
    },

    deselectAll({type = "available"}) {
      if (type === "available") {
        this.checkBoxesData.availablePartnersIds = [];
        this.checkBoxesData.isSelectedAvailableAll = false;
      } else {
        this.checkBoxesData.disabledPartnersIds = [];
        this.checkBoxesData.isSelectedDisabledAll = false;
      }
    },

    createReport() {
      this.reportTable.isVisible = false;
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.startDateOfReport > this.maxAvailableDate || this.endDateOfReport > this.maxAvailableDate) {
        this.messages_data.messages.push({
          text: "Выбранные даты могут быть исключительно прошлыми (то есть вчера и ранее)!"
        });
      }
      if (this.startDateOfReport > this.endDateOfReport) {
        this.messages_data.messages.push({
          text: "Начальная дата не может быть позже, чем конечная!"
        });
      }
      if (!this.checkBoxesData.availablePartnersIds.length &&
          !this.checkBoxesData.disabledPartnersIds.length) {
        this.messages_data.messages.push({
          text: "Выберите хотя бы один клуб!"
        });
      }
      if (!this.messages_data.messages.length) {
        this.loading.isLoading = true;
        // this.loading.isLoading = true;
        // TODO запрос в бд на сбор информации
        this.$http
            .get("/stats/sells-report/", {
              params: {
                from: this.startDateOfReport,
                to: this.endDateOfReport,
                partnerIds: [...this.checkBoxesData.availablePartnersIds, ...this.checkBoxesData.disabledPartnersIds]
              }
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.reportTable.availableNominals = [];
                this.reportTable.reportData = [];
                this.reportTable.amountsOfSoldNominals = [];
                [this.reportTable.sumTotalSold, this.reportTable.sumTotalTax, this.reportTable.sumTotalWin] = [0.0, 0.0, 0.0];
                if (res.data.status === "success") {
                  console.log(res.data.sellsData);
                  const tempReportTable = res.data.sellsData;
                  // сначала создаем массив из ВСЕХ полученных номиналов
                  for (let lottery of tempReportTable) {
                    for (let nominal of lottery.nominals) {
                      if (this.reportTable.availableNominals.findIndex(availableNominal => availableNominal === nominal.value) < 0) {
                        this.reportTable.availableNominals.push(nominal.value);
                        // суммарное количество по номиналам
                        this.reportTable.amountsOfSoldNominals.push({
                          value: nominal.value,
                          sold: 0
                        });
                      }
                    }
                  }
                  // сортировка от самого наименьшего номинала до самого наибольшего
                  this.reportTable.availableNominals.sort((lhs, rhs) => {
                    return parseFloat(lhs) - parseFloat(rhs);
                  });
                  // для нормального отображения таблицы с остатками по номиналам необходимо вычислить ширину колонок
                  this.reportTable.maxCountOfNominals = 60 / this.reportTable.availableNominals.length;

                  // сортировка массива с суммарными количествами по номиналу от меньшего номинала к большему
                  this.reportTable.amountsOfSoldNominals.sort((lhs, rhs) => {
                    return parseFloat(lhs.value) - parseFloat(rhs.value);
                  });

                  // заполняем массив для сортировки по номиналам
                  for (let availableNominal of this.reportTable.availableNominals) {
                    this.sortData.sortFields[availableNominal] = "";
                  }
                  console.log(this.sortData.sortFields);

                  // теперь надо создать таблицу, где для каждого номинала будет информация
                  // (если у какой-то лотереи нет какого-то номинала, тогда ставим "-")
                  for (let lottery of tempReportTable) {
                    const tempNominals = [];
                    for (let availableNominal of this.reportTable.availableNominals) {
                      const receivedNominal = lottery.nominals.find(nominal => nominal.value === availableNominal);
                      if (receivedNominal) {
                        console.log(receivedNominal.sold);
                        tempNominals.push({value: receivedNominal.value, sold: receivedNominal.sold});
                      } else {
                        tempNominals.push({value: availableNominal, sold: "-"});
                      }
                    }

                    // вычисляем суммарную статистику по каждой лотерее, по каждому номиналу
                    this.reportTable.sumTotalSold += lottery.totalSold;
                    this.reportTable.sumTotalWin += lottery.totalWin;
                    this.reportTable.sumTotalTax += lottery.totalTax;
                    for (let nominal of tempNominals) {
                      // если в суммировании такой номинал еще не встречался, тогда добавляем его и приравниваем к 0
                      if (nominal.sold !== "-") {
                        const amountOfSoldNominal = this.reportTable.amountsOfSoldNominals.find(amount => amount.value === nominal.value);
                        amountOfSoldNominal.sold += nominal.sold;
                      }
                    }

                    // добавляем в итоговый массив преобразованные данные
                    this.reportTable.reportData.push({
                      lotteryName: lottery.lotteryName,
                      nominals: tempNominals,
                      totalSold: +lottery.totalSold.toFixed(2),
                      totalWin: +lottery.totalWin.toFixed(2),
                      totalTax: +lottery.totalTax.toFixed(2)
                    });
                  }

                  this.reportTable.sumTotalSold = +this.reportTable.sumTotalSold.toFixed(2);
                  this.reportTable.sumTotalWin = +this.reportTable.sumTotalWin.toFixed(2);
                  this.reportTable.sumTotalTax = +this.reportTable.sumTotalTax.toFixed(2);
                  this.reportTable.isVisible = true;
                }
                this.loading.isLoading = false;
                this.messages_data = {type: res.data.status, messages: res.data.messages}
              }
            })
            .catch(err => console.error(err));
        // TODO конец запроса

        // const timeId = setInterval(() => {
        //   this.loading.currentPhraseIndex = Math.floor(Math.random() * (this.loading.availablePhrases.length - 1));
        //   console.log("QWEQWEQWE");
        // }, 2000);

        // setTimeout(() => {
        //   clearInterval(timeId);
        //   [this.reportTable.isVisible, this.loading.isLoading] = [true, false];
        // }, 15000);

      }
    },

    createGlobalReport({from = "", to = "", partnerIds = []}) {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .get("/excel-reports/create-global-report/", {
            responseType: "blob",
            params: {
              from: from,
              to: to,
              partnerIds: partnerIds
            }
          })
          .then(res => {
            console.log(res.data);
            FileSaver.saveAs(res.data, "FiscalReport.xlsx")
          })
          .catch(err => console.error(err));
    },

    sortField({requireSortingField = "lotteryName", requiredNominalIndex = -1}) {
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        if (requireSortingField === sortField) {
          sortedType = this.sortData.sortFields[sortField] = this.sortData.sortChangeType[this.sortData.sortFields[requireSortingField]]
        } else {
          this.sortData.sortFields[sortField] = "";
        }
      }
      if (requiredNominalIndex >= 0) {
        this.reportTable.reportData.sort((lhs, rhs) => {
          const lhsValue = (lhs.nominals[requiredNominalIndex].sold !== "-") ? lhs.nominals[requiredNominalIndex].sold : 0;
          const rhsValue = (rhs.nominals[requiredNominalIndex].sold !== "-") ? rhs.nominals[requiredNominalIndex].sold : 0;
          if (lhsValue > rhsValue) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhsValue < rhsValue) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
        });
      } else {
        this.reportTable.reportData.sort((lhs, rhs) => {
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
}


</script>