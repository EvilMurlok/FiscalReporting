<template>
  <!-- Sidebar -->
  <!--
    Sidebar Mini Mode - Display Helper classes

    Adding 'smini-hide' class to an element will make it invisible (opacity: 0) when the sidebar is in mini mode
    Adding 'smini-show' class to an element will make it visible (opacity: 1) when the sidebar is in mini mode
    If you would like to disable the transition animation, make sure to also add the 'no-transition' class to your element

    Adding 'smini-hidden' to an element will hide it when the sidebar is in mini mode
    Adding 'smini-visible' to an element will show it (display: inline-block) only when the sidebar is in mini mode
    Adding 'smini-visible-block' to an element will show it (display: block) only when the sidebar is in mini mode
    -->
  <nav id="sidebar" aria-label="Main Navigation">
    <slot>
      <!-- Side Header -->
      <div class="content-header pl-2  bg-white-5">
        <!-- Logo -->
        <router-link to="/">
          <span class="smini-visible pt-4">
            <img src="../../../public/logo_loto.png" alt="App Logo"
                 style="width: 25%;height: 20%">
          </span>
          <span class="smini-hide tracking-wider ml-5">
            <img src="../../../public/logo_loto.png" alt="App Logo"
                 style="display:inline-block;height:40px; width:90px">
          </span>
        </router-link>

        <!-- END Logo -->

        <!-- Extra -->
        <div>
          <!-- Options -->
          <b-dropdown size="sm" variant="dual" class="d-inline-block ml-2" menu-class="font-size-sm smini-hide border-0"
                      right no-caret ref="oneDropdownOptions">
            <template #button-content>
              <i class="si si-settings"></i>
            </template>
            <li @click="$refs.oneDropdownOptions.hide(true)">
              <!-- Color Themes -->
              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between"
                 @click.prevent="$store.commit('setColorTheme', { theme: '' })" href="#">
                <span>Default</span>
                <i class="fa fa-circle text-default"></i>
              </a>
              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between"
                 @click.prevent="$store.commit('setColorTheme', { theme: 'amethyst' })" href="#">
                <span>Amethyst</span>
                <i class="fa fa-circle text-amethyst"></i>
              </a>
              <!--              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between" @click.prevent="$store.commit('setColorTheme', { theme: 'city' })" href="#">-->
              <!--                <span>City</span>-->
              <!--                <i class="fa fa-circle text-city"></i>-->
              <!--              </a>-->
              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between"
                 @click.prevent="$store.commit('setColorTheme', { theme: 'flat' })" href="#">
                <span>Flat</span>
                <i class="fa fa-circle text-flat"></i>
              </a>
              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between"
                 @click.prevent="$store.commit('setColorTheme', { theme: 'modern' })" href="#">
                <span>Modern</span>
                <i class="fa fa-circle text-modern"></i>
              </a>
              <!--              <a class="dropdown-item font-w500 d-flex align-items-center justify-content-between" @click.prevent="$store.commit('setColorTheme', { theme: 'smooth' })" href="#">-->
              <!--                <span>Smooth</span>-->
              <!--                <i class="fa fa-circle text-smooth"></i>-->
              <!--              </a>-->
              <!-- END Color Themes -->

              <div role="separator" class="dropdown-divider"></div>

              <!-- Sidebar Styles -->
              <base-layout-modifier tag="a" action="sidebarStyleLight" class="dropdown-item font-w500">
                Sidebar Light
              </base-layout-modifier>
              <base-layout-modifier tag="a" action="sidebarStyleDark" class="dropdown-item font-w500">
                Sidebar Dark
              </base-layout-modifier>
              <!-- Sidebar Styles -->

              <div role="separator" class="dropdown-divider"></div>

              <!-- Header Styles -->
              <base-layout-modifier tag="a" action="headerStyleLight" class="dropdown-item font-w500">
                Header Light
              </base-layout-modifier>
              <base-layout-modifier tag="a" action="headerStyleDark" class="dropdown-item font-w500">
                Header Dark
              </base-layout-modifier>
              <!-- Header Styles -->
            </li>
          </b-dropdown>
          <!-- Options -->

          <!-- Close Sidebar, Visible only on mobile screens -->
          <base-layout-modifier size="sm" variant="dual" action="sidebarClose" class="d-lg-none ml-1">
            <i class="fa fa-fw fa-times"></i>
          </base-layout-modifier>
          <!-- END Close Sidebar -->
        </div>
        <!-- END Extra -->
      </div>
      <!-- END Side Header -->

      <!-- Sidebar Scrolling -->
      <simplebar class="js-sidebar-scroll">
        <div class="smini-hide tracking-wider ml-3 mt-3">
          <span style="font-size: 0.7em"
                v-if="$store.getters.USER.role === 'admin'"
          >
            Администратор отчетности ЭЛК
          </span>
          <span style="font-size: 0.7em"
                v-else-if="$store.getters.USER.role === 'specialist'"
          >
            Отчетность о реализации ЭЛК
          </span>
          <span style="font-size: 0.7em"
                v-else-if="$store.getters.USER.role === 'root'"
          >
            Пользователь c 'root'-правами
          </span>
          <span style="font-size: 0.7em"
                v-else-if="$store.getters.USER.role === 'employee'"
          >
            Сотрудник фискальных органов
          </span>

        </div>
        <!-- Side Navigation -->
        <div class="content-side">
          <base-navigation :nodes="navigation"></base-navigation>
        </div>
        <!-- END Side Navigation -->
      </simplebar>
      <!-- END Sidebar Scrolling -->
    </slot>
  </nav>
  <!-- END Sidebar -->
</template>

<script>
// SimpleBar, for more info and examples you can check out https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-vue
import simplebar from 'simplebar-vue'

// Get navigation data
import menuList from '@/data/menu'

export default {
  name: 'BaseSidebar',
  props: {
    classes: String
  },
  components: {
    simplebar
  },
  data() {
    return {
      // Get main navigation
      navigation: (this.$store.getters.USER.role === "specialist") ?
              menuList.specialist : (this.$store.getters.USER.role === "admin") ?
              menuList.admin : (this.$store.getters.USER.role === "root") ? menuList.root : menuList.employee
    }
  },


}
</script>
