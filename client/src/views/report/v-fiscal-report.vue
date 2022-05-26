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
                    v-model="checkBoxesData.availableClubsIds"
                    id="availableClubsIds"
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
                      <b-form-checkbox v-for="club in availableClubs.slice(0, halfAvailableClubsLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"
                      >
                        <b>{{ club.clubName }}</b>
                      </b-form-checkbox>
                    </b-col>
                    <b-col sm="1"></b-col>
                    <b-col sm="5">
                      <b-form-checkbox v-for="club in availableClubs.slice(halfAvailableClubsLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"

                      >
                        <b>{{ club.clubName }}</b>
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
                    v-model="checkBoxesData.disabledClubsIds"
                    id="disabledClubsIds"
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
                      <b-form-checkbox v-for="club in disabledClubs.slice(0, halfDisableClubsLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"
                      >
                        <span class="text-muted">{{ club.clubName }}</span>
                      </b-form-checkbox>
                    </b-col>
                    <b-col sm="1"></b-col>
                    <b-col sm="5">
                      <b-form-checkbox v-for="club in disabledClubs.slice(halfDisableClubsLength)"
                                       :key="club.id"
                                       :value="club.id"
                                       class="mb-2"

                      >
                        <span class="text-muted">{{ club.clubName }}</span>
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
              <b-row class="mt-5">
                <b-col sm="1"></b-col>
                <b-col sm="3" class="mb-3">
                  <label class="form-check-label mb-1">Начало</label>
                  <b-form-input id="startDateOfReport"
                                name="startDateOfReport"
                                type="datetime-local"
                                v-model="startDateOfReport"
                  >
                  </b-form-input>
                </b-col>
                <b-col sm="3">
                  <label class="form-check-label mb-1">Конец</label>
                  <b-form-input id="endDateOfReport"
                                name="endDateOfReport"
                                type="datetime-local"
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
        <b-col sm="2">
        </b-col>
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
                      @click="sortField({requireSortingField: 'lottery'})"
                >
                  Лотерея
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['lottery'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['lottery'] === 'DESC'">
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
                      @click="sortField({requireSortingField: 'totalSum'})"
                >
                  Общая сумма продажи
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['totalSum'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['totalSum'] === 'DESC'">
                  </i>
                </span>
              </th>
              <th :colspan="reportTable.availableDenominations.length"
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
                      @click="sortField({requireSortingField: 'paidOutWinning'})"
                >
                  Выплачено выигрышей
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['paidOutWinning'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['paidOutWinning'] === 'DESC'">
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
                      @click="sortField({requireSortingField: 'withheldTax'})"
                >
                  НДФЛ удержано
                  <i class="si si-arrow-up m-2"
                     v-if="sortData.sortFields['withheldTax'] === 'ASC'">
                  </i>
                  <i class="si si-arrow-down m-2"
                     v-else-if="sortData.sortFields['withheldTax'] === 'DESC'">
                  </i>
                </span>
              </th>
            </tr>
            <tr>
              <th v-for="(denomination, indexDenomination) in reportTable.availableDenominations"
                  :key="denomination"
                  :style="{
                          'width': `${reportTable.countOfDenominations}%`,
                          'cursor': 'pointer'
                        }"
                  rowspan="1"
                  @click="sortField({requireSortingField: denomination, requiredDenominationIndex: indexDenomination})"
              >
                <span class="ml-2">
                      {{ denomination }}
                      <i class="si si-arrow-up m-2"
                         v-if="sortData.sortFields[denomination] === 'ASC'">
                      </i>
                      <i class="si si-arrow-down m-2"
                         v-else-if="sortData.sortFields[denomination] === 'DESC'">
                      </i>
                </span></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="lottery in reportTable.reportData"
                :key="lottery.lottery"
            >
              <td class="fw-semibold fs-sm">
                <b>{{ lottery.lottery }}</b>
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.totalSum }}
              </td>
              <td v-for="remainder in lottery.denominations"
                  :key="remainder"
                  class="fs-sm"
              >
                {{ remainder }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.paidOutWinning }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ lottery.withheldTax }}
              </td>
            </tr>
            <tr>
              <td class="fw-semibold fs-sm">
                <b>Итого за период</b>
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumTotalSum.toFixed(2) }}
              </td>
              <td class="fw-semibold fs-sm"
                  v-for="sumRemainder in reportTable.amountsOfDenominations"
                  :key="sumRemainder"
              >
                {{ sumRemainder }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumPaidOutWinning.toFixed(2) }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ +reportTable.sumWithheldTax.toFixed(2) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <b-button variant="alt-info"
                  size="sm"
                  class="mt-3"
                  @click="createGlobalReport"
        >
          <i class="far fa-file opacity-50 mr-1"></i>Выгрузить в Эксель
        </b-button>
      </base-block>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import FileSaver from "file-saver";

export default {
  name: "v-fiscal-report",

  components: {
    BaseMessage
  },

  computed: {
    halfAvailableClubsLength: function () {
      return (this.availableClubs.length % 2) ? ~~(this.availableClubs.length / 2) + 1 : ~~(this.availableClubs.length / 2);
    },

    halfDisableClubsLength: function () {
      return (this.disabledClubs.length % 2) ? ~~(this.disabledClubs.length / 2) + 1 : ~~(this.disabledClubs.length / 2);
    },

    maxAvailableDate: function () {
      const currentTime = new Date().setHours(new Date().getHours() + 3);
      const maxDate = new Date(new Date(new Date(currentTime).setHours(2)).setMinutes(59)).toISOString().slice(0, 16);
      console.log(maxDate);
      return maxDate;
    }
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},

      checkBoxesData: {
        availableClubsIds: [],
        disabledClubsIds: [],
        isSelectedAvailableAll: false,
        isSelectedDisabledAll: false,
      },

      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortFields: {
          "lottery": "ASC",
          "totalSum": "",
          "paidOutWinning": "",
          "withheldTax": ""
        }
      },

      availableClubs: [
        {clubName: "ДЖ.Расулов, Пролетар 2 (Согд)", id: 1},
        {clubName: "Чавонон/Аэропорт (Душанбе)", id: 2},
        {clubName: "Карабоев/Ганджина (Душанбе)", id: 3},
        {clubName: "Худжанд, 34мкр (Согд)", id: 4},
        {clubName: "Айни 269/9км (Душанбе)", id: 5},
        {clubName: "Спитамен 1, Нау 1 (Согд)", id: 6},
        {clubName: "Спитамен 2, Нау 2 (Согд)", id: 7},
        {clubName: "Зафарабад (Согд)", id: 8},
        {clubName: "Куляб 1 (Хатлон)", id: 9},
        {clubName: "Гулакандоз, Пролетар 1 (Согд)", id: 10},
        {clubName: "Борбад (Хатлон)", id: 11},
        {clubName: "Дусти (Душанбе)", id: 12},
      ],

      disabledClubs: [
        {clubName: "Лохути (Душанбе) (до 09.11.2021)", id: 13},
        {clubName: "Турсунзаде, Сомони (Душанбе) (до 21.04.2022)", id: 14},
        {clubName: "Ура-Тюбе 1 (Согд) (до 30.11.2021)", id: 15},
        {clubName: "Сомониён, Рудаки (Душанбе) (до 17.10.2021)", id: 16},
        {clubName: "Корвон (Душанбе) (до 21.04.2022)", id: 17},
        {clubName: "Гафурова (Душанбе) (отключен)", id: 18},
        {clubName: "Бустон (Согд) (до 07.02.2022)", id: 19},
        {clubName: "Курган-Тюбе, Май (Халтон) (до 30.11.2021)", id: 20},
        {clubName: "Шахристан (Согд) (до 15.10.2021)", id: 21},
      ],

      loading: {
        isLoading: false,
        availablePhrases: [
          "Составляем отчет...", "Крутим рулетку...",
          "Участвуем в лотерее...", "Переводим бумагу на отчет...",
          "Выигрываем джекпот...", "Делаем ставки...",
          "Призываем удачу...", "Перемешиваем лотерейные билеты..."
        ],
        currentPhraseIndex: 0,
      },

      reportTable: {
        isVisible: false,
        countOfDenominations: 0.0,
        availableDenominations: [0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 3, 4, 5, 10, 15],
        reportData: [
          {
            "lottery": "Гамбусаки Хушхол",
            "totalSum": 517.9,
            "denominations": [16010, 7638, 4432, 4441, 5097, 2843, 1141, 574, 9, 7, 2, 1],
            "paidOutWinning": 447.91,
            "withheldTax": 58.23
          },
          {
            "lottery": "Дурдонаи Гаронбахо",
            "totalSum": 6.9,
            "denominations": [16108, 7623, 4287, 4403, 5042, 2751, 983, 383, 222, 140, 12, 2],
            "paidOutWinning": 456.91,
            "withheldTax": 0.23
          },
          {
            "lottery": "Киссахои Помир",
            "totalSum": 32.9,
            "denominations": [4632, 2329, 1423, 1452, 1627, 980, 416, 185, 444, 234, 43, 3],
            "paidOutWinning": 74.91,
            "withheldTax": 3.23
          },
          {
            "lottery": "Мевахо",
            "totalSum": 11.9,
            "denominations": [38364, 17808, 9746, 10032, 11610, 6062, 1948, 698, 432, 521, 87, 4],
            "paidOutWinning": 532.91,
            "withheldTax": 5.23
          },
          {
            "lottery": "Рохи Абрешим",
            "totalSum": 2029.9,
            "denominations": [43242, 15432, 8864, 10032, 3435, 5232, 1948, 698, 432, 34, 2, 1],
            "paidOutWinning": 53.91,
            "withheldTax": 65.23
          },
          {
            "lottery": "Хирадманди Хушхол",
            "totalSum": 30.9,
            "denominations": [12343, 9647, 5436, 4441, 5097, 2843, 1141, 574, 376, 125, 45, 7],
            "paidOutWinning": 2.91,
            "withheldTax": 34.23
          },
          {
            "lottery": "Хоча Насриддин",
            "totalSum": 60.9,
            "denominations": [12525, 9432, 7453, 3264, 6532, 6436, 2321, 235, 124, 53, 54, 34],
            "paidOutWinning": 52.91,
            "withheldTax": 9.23
          },
        ],
        sumTotalSum: 0.0,
        amountsOfDenominations: [],
        sumPaidOutWinning: 0.0,
        sumWithheldTax: 0.0,
      },
      startDateOfReport: "",
      endDateOfReport: ""
    }
  },

  created() {
    const currentTime = new Date(new Date().setHours(new Date().getHours() + 3));
    const yesterday = new Date(new Date(currentTime).setDate(currentTime.getDate() - 1));
    this.startDateOfReport = new Date(new Date(yesterday.setHours(3)).setMinutes(0)).toISOString().slice(0, 16);
    this.endDateOfReport = new Date(new Date(currentTime.setHours(2)).setMinutes(59)).toISOString().slice(0, 16);

  },

  methods: {
    selectAll({type = "available"}) {
      if (type === "available") {
        this.checkBoxesData.availableClubsIds = [];
        this.checkBoxesData.availableClubsIds = this.availableClubs.map(club => club.id);
        this.checkBoxesData.isSelectedAvailableAll = true;
      } else {
        this.checkBoxesData.disabledClubsIds = [];
        this.checkBoxesData.disabledClubsIds = this.disabledClubs.map(club => club.id);
        this.checkBoxesData.isSelectedDisabledAll = true;
      }
    },

    deselectAll({type = "available"}) {
      if (type === "available") {
        this.checkBoxesData.availableClubsIds = [];
        this.checkBoxesData.isSelectedAvailableAll = false;
      } else {
        this.checkBoxesData.disabledClubsIds = [];
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
      if (this.startDateOfReport >= this.endDateOfReport) {
        this.messages_data.messages.push({
          text: "Начальная дата не может быть позже, чем конечная!"
        });
      }
      if (!this.checkBoxesData.availableClubsIds.length &&
          !this.checkBoxesData.disabledClubsIds.length) {
        this.messages_data.messages.push({
          text: "Выберите хотя бы один клуб!"
        });
      }
      if (!this.messages_data.messages.length) {
        this.loading.isLoading = true;
        // TODO запрос в бд на сбор информации
        const timeId = setInterval(() => {
          this.loading.currentPhraseIndex = Math.floor(Math.random() * (this.loading.availablePhrases.length - 1));
          console.log("QWEQWEQWE");
        }, 2000);

        // TODO конец запроса

        for (let availableDenomination of this.reportTable.availableDenominations) {
          this.sortData.sortFields[availableDenomination] = "";
        }
        this.reportTable.amountsOfDenominations = Array(this.reportTable.availableDenominations.length).fill(0.0);
        console.log(this.sortData.sortFields);
        for (let lottery of this.reportTable.reportData) {
          this.reportTable.sumTotalSum += lottery.totalSum;
          this.reportTable.sumPaidOutWinning += lottery.paidOutWinning;
          this.reportTable.sumWithheldTax += lottery.withheldTax;
          for (let indexDenominations in lottery["denominations"]) {
            this.reportTable.amountsOfDenominations[indexDenominations] += lottery["denominations"][indexDenominations];
          }
        }
        this.reportTable.countOfDenominations = 60 / this.reportTable.availableDenominations.length;
        setTimeout(() => {
          clearInterval(timeId);
          [this.reportTable.isVisible, this.loading.isLoading] = [true, false];
        }, 15000);

      }
    },

    createGlobalReport() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .get("/excel-reports/create-global-report/", {responseType: "blob"})
          .then(res => {
            console.log(res.data);
            FileSaver.saveAs(res.data, "FiscalReport.xlsx")
          })
          .catch(err => console.error(err));
    },

    sortField({requireSortingField = "lottery", requiredDenominationIndex = -1}) {
      if (requiredDenominationIndex >= 0) {
        requireSortingField = parseFloat(requireSortingField);
      }
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        sortField = (!["lottery", "totalSum", "paidOutWinning", "withheldTax"].includes(sortField)) ? parseFloat(sortField) : sortField;
        if (requireSortingField === sortField) {
          sortedType = this.sortData.sortFields[sortField] = this.sortData.sortChangeType[this.sortData.sortFields[requireSortingField]]
        } else {
          this.sortData.sortFields[sortField] = "";
        }
      }
      if (requiredDenominationIndex >= 0) {
        this.reportTable.reportData.sort((lhs, rhs) => {
          if (lhs["denominations"][requiredDenominationIndex] > rhs["denominations"][requiredDenominationIndex]) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhs["denominations"][requiredDenominationIndex] < rhs["denominations"][requiredDenominationIndex]) {
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