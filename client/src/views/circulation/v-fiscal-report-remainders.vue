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
            <b-form @submit.prevent="createExcel">
              <b-row class="my-1 m-1">
                <b-col sm="1.5"><p class="mt-1">Остаток на </p></b-col>
                <b-col sm="3">
                  <div class="form-group">
                    <b-form-input id="dateOfInspection"
                                  name="dateOfInspection"
                                  type="date"
                                  :max="new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)"
                                  v-model="dateOfReport"
                    >
                    </b-form-input>
                  </div>
                </b-col>
                <b-col sm="5">
                  <div class="mb-3">
                    <b-button type="submit"
                              variant="alt-info"
                              size="sm"
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
                  <th style="width: 20%">
                    <div :style="{
                                     'background-image': 'linear-gradient(to bottom left, transparent 48%, #d8dce4ff, transparent 50%)',
                                     'background-repeat': 'no-repeat',
                                     'text-align': 'center',
                                     'height': '100%',
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
                      :key="remainder"
                      class="fs-sm"
                  >
                    {{ remainder }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div style="font-size: 0.7em">Данные актуальны на {{actualDate}} 23:59:59</div>
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
          0.1: "",
          0.2: "",
          0.3: "",
          0.4: "",
          0.5: "",
          1: "",
          2: "",
          3: "",
          4: ""
        }
      },

      dateOfReport: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10),
      actualDate: new Date(new Date(new Date(new Date().setHours(new Date().getHours() + 3))).setDate(new Date(new Date().setHours(new Date().getHours() + 3)).getDate() - 1)).toISOString().slice(0, 10),
      tableOfRemainders: {
        countOfDenominations: 80 / 9,
        availableDenominations: [0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 3, 4],
        remaindersData: [
          {"lottery": "Гамбусаки Хушхол", "remainders": [16010, 7638, 4432, 4441, 5097, 2843, 1141, 574, 9]},
          {"lottery": "Дурдонаи Гаронбахо", "remainders": [16108, 7623, 4287, 4403, 5042, 2751, 983, 383, 222]},
          {"lottery": "Киссахои Помир", "remainders": [632, 2329, 1423, 1452, 1627, 980, 416, 185, 444]},
          {"lottery": "Хирадманди Хушхол", "remainders": [9884, 4701, 2632, 2704, 3115, 1677, 564, 210, 111]},
          {"lottery": "Хоча Насриддин", "remainders": [38364, 17808, 9746, 10032, 11610, 6062, 1948, 698, 432]},
        ],
      }
    }
  },

  methods: {
    createExcel() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (this.dateOfReport > new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10)) {
        this.messages_data.messages.push({
          text: "Можно выбрать дни из прошлого или текущий день!"
        });
      }
      if (!this.messages_data.messages.length) {
        this.$http
            .get("/excel-reports/create-remainders-report/", {responseType: "blob"})
            .then(res => {
              console.log(res.data);
              FileSaver.saveAs(res.data, "RemaindersTickets.xlsx")
            })
            .catch(err => console.error(err));
      }
    },

    sortField({requireSortingField = "lottery", indexOfDenomination = -1}) {
      if (indexOfDenomination >= 0) {
        requireSortingField = parseFloat(requireSortingField);
      }
      let sortedType = "ASC";
      for (let sortField in this.sortData.sortFields) {
        sortField = (sortField !== "lottery") ? parseFloat(sortField) : sortField;
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
          if (lhs["remainders"][indexOfDenomination] > rhs["remainders"][indexOfDenomination]) {
            return this.sortData.sortComparator[sortedType + ">"];
          }
          if (lhs["remainders"][indexOfDenomination] < rhs["remainders"][indexOfDenomination]) {
            return this.sortData.sortComparator[sortedType + "<"];
          }
          return 0;
        });
      }
    }
  }

}
</script>