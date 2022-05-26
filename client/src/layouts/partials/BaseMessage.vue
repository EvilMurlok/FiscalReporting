<template>
  <div id="page-messages">
    <b-alert v-if="message_data.type === 'warning'"
             variant="warning"
             class="d-flex align-items-center justify-content-between"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-exclamation-circle mr-3"></i>
      </div>
      <div class="flex-fill mr-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>

    <b-alert v-else-if="message_data.type === 'success'"
             variant="success"
             class="d-flex align-items-center"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-check mr-3"></i>
      </div>
      <div class="flex-fill ml-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>

    <b-alert v-else-if="message_data.type === 'info'"
             variant="info"
             class="d-flex align-items-center"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-info-circle mr-3"></i>
      </div>
      <div class="flex-fill ml-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: "BaseMessage",
  props: {
    message_data: {
      type: Object,
      default() {
        return {type: "warning", item: {}};
      }
    }
  },
}
</script>