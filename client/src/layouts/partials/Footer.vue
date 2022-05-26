<template>
  <!-- Footer -->
  <footer id="page-footer">
    <slot>
      <div class="bg-white">
        <div class="content py-3">
          <b-row class="font-size-sm text-muted font-w500">
            <b-col sm="4"></b-col>
            <b-col sm="3" class="py-1 text-center">
              <b>Fiscal Report Admin Panel 0.0.1</b> &copy; 2022
            </b-col>
            <b-col sm="3"></b-col>
            <b-col sm="2" class="py-1 text-center">
              <div>
                Created with <i class="fa fa-heart text-danger"></i> by
                <a class="font-w600" href="https://pixmove.ru/" target="_blank">PixMove</a>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </slot>
  </footer>
  <!-- END Footer -->
</template>

<script>
export default {
  name: 'BaseFooter',
  props: {
    classes: String
  }
}
</script>
