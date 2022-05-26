<template>
  <div class="v-main">
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">
            Добро пожаловать в фискальный контур отчетности национальной электронной лотереи Республики Таджикистан
          </p>
        </div>
      </div>
    </div>
    <!-- END Hero -->
    <div class="content">
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
    </div>


    <!-- Page Content -->
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";

export default {
  name: "v-retrieve-projects",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
    }
  },

  created() {

  },

  methods: {

  }
}

</script>