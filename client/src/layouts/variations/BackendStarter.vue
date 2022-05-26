<template>
  <base-layout :layout-classes="layoutClasses">
    <!-- Sidebar Content -->
    <!-- Using the available v-slot, we can override the default Sidebar content from layouts/partials/Sidebar.vue -->
    <template>
      <!-- Side Header -->
      <div class="content-header bg-white-5">
        <!-- Logo -->
        <!--        <router-link to="/landing" class="font-w600 text-dual">-->
        <span class="smini-visible">
            <i class="fa fa-circle-notch text-primary"></i>
        </span>
        <span class="smini-hide font-size-h5 tracking-wider">
            <span class="font-w400">Fiscal Reporting</span>
        </span>
        <!--        </router-link>-->
        <!-- END Logo -->

        <!-- Extra -->
        <div>
          <!-- Close Sidebar, Visible only on mobile screens -->
          <base-layout-modifier size="sm"
                                variant="dual"
                                action="sidebarClose"
                                class="d-lg-none ml-2"
          >
            <i class="fa fa-times"></i>
          </base-layout-modifier>
          <!-- END Close Sidebar -->
        </div>
        <!-- END Extra -->
      </div>
      <!-- END Side Header -->

      <!-- Sidebar Scrolling -->
      <simplebar class="js-sidebar-scroll">
        <!-- Side Navigation -->
        <div class="content-side">
          <base-navigation
              :nodes="
                      [
                          {
                            name: 'Dashboard',
                            to: '/backend/dashboard',
                            icon: 'si si-speedometer'
                          },
                          {
                            name: 'Page Packs',
                            icon: 'si si-layers',
                            subActivePaths: '/backend/pages-packs',
                            sub: [
                              {
                                name: 'Boxed Backend',
                                icon: 'si si-magnet',
                                subActivePaths: '/backend-boxed',
                                sub: [
                                  {
                                    name: 'Dashboard',
                                    to: '/backend-boxed/dashboard'
                                  },
                                  {
                                    name: 'Search',
                                    to: '/backend-boxed/search'
                                  },
                                  {
                                    name: 'Simple 1',
                                    to: '/backend-boxed/simple1'
                                  },
                                  {
                                    name: 'Simple 2',
                                    to: '/backend-boxed/simple2'
                                  },
                                  {
                                    name: 'Image 1',
                                    to: '/backend-boxed/image1'
                                  },
                                  {
                                    name: 'Image 2',
                                    to: '/backend-boxed/image2'
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            name: 'User Interface',
                            heading: true
                          },
                          {
                            name: 'Blocks',
                            icon: 'si si-energy',
                            subActivePaths: '/backend/blocks',
                            sub: [
                              {
                                name: 'Styles',
                                to: '/backend/blocks/styles'
                              },
                              {
                                name: 'Options',
                                to: '/backend/blocks/options'
                              },
                              {
                                name: 'Forms',
                                to: '/backend/blocks/forms'
                              },
                              {
                                name: 'Themed',
                                to: '/backend/blocks/themed'
                              },
                              {
                                name: 'API',
                                to: '/backend/blocks/api'
                              }
                            ]
                          },
                          {
                            name: 'Elements',
                            icon: 'si si-badge',
                            subActivePaths: '/backend/elements',
                            sub: [
                              {
                                name: 'Grid',
                                to: '/backend/elements/grid'
                              },
                              {
                                name: 'Typography',
                                to: '/backend/elements/typography'
                              },
                              {
                                name: 'Icons',
                                to: '/backend/elements/icons'
                              },
                              {
                                name: 'Buttons',
                                to: '/backend/elements/buttons'
                              },
                              {
                                name: 'Button Groups',
                                to: '/backend/elements/button-groups'
                              },
                              {
                                name: 'Dropdowns',
                                to: '/backend/elements/dropdowns'
                              },
                              {
                                name: 'Tabs',
                                to: '/backend/elements/tabs'
                              },
                              {
                                name: 'Navigation',
                                to: '/backend/elements/navigation'
                              },
                              {
                                name: 'Horizontal Navigation',
                                to: '/backend/elements/navigation-horizontal'
                              },
                              {
                                name: 'Progress',
                                to: '/backend/elements/progress'
                              },
                              {
                                name: 'Alerts',
                                to: '/backend/elements/alerts'
                              },
                              {
                                name: 'Tooltips',
                                to: '/backend/elements/tooltips'
                              },
                              {
                                name: 'Popovers',
                                to: '/backend/elements/popovers'
                              },
                              {
                                name: 'Modals',
                                to: '/backend/elements/modals'
                              },
                              {
                                name: 'Images',
                                to: '/backend/elements/images'
                              },
                              {
                                name: 'Timeline',
                                to: '/backend/elements/timeline'
                              },
                              {
                                name: 'Ribbons',
                                to: '/backend/elements/ribbons'
                              },
                              {
                                name: 'Animations',
                                to: '/backend/elements/animations'
                              },
                              {
                                name: 'Color Themes',
                                to: '/backend/elements/color-themes'
                              }
                            ]
                          },
                          {
                            name: 'Tables',
                            icon: 'si si-grid',
                            subActivePaths: '/backend/tables',
                            sub: [
                              {
                                name: 'Styles',
                                to: '/backend/tables/styles'
                              },
                              {
                                name: 'Responsive',
                                to: '/backend/tables/responsive'
                              },
                              {
                                name: 'Helpers',
                                to: '/backend/tables/helpers'
                              },
                              {
                                name: 'Pricing',
                                to: '/backend/tables/pricing'
                              }
                            ]
                          },
                          {
                            name: 'Forms',
                            icon: 'si si-note',
                            subActivePaths: '/backend/forms',
                            sub: [
                              {
                                name: 'Elements',
                                to: '/backend/forms/elements'
                              },
                              {
                                name: 'Custom Controls',
                                to: '/backend/forms/custom-controls'
                              },
                              {
                                name: 'Layouts',
                                to: '/backend/forms/layouts'
                              },
                              {
                                name: 'Input Groups',
                                to: '/backend/forms/input-groups'
                              },
                              {
                                name: 'Plugins',
                                to: '/backend/forms/plugins'
                              },
                              {
                                name: 'Editors',
                                to: '/backend/forms/editors'
                              },
                              {
                                name: 'Validation',
                                to: '/backend/forms/validation'
                              }
                            ]
                          },
                          {
                            name: 'Develop',
                            heading: true
                          },
                          {
                            name: 'Plugins',
                            icon: 'si si-wrench',
                            subActivePaths: '/backend/plugins',
                            sub: [
                              {
                                name: 'Appear',
                                to: '/backend/plugins/appear'
                              },
                              {
                                name: 'Image Cropper',
                                to: '/backend/plugins/image-cropper'
                              },
                              {
                                name: 'Charts',
                                to: '/backend/plugins/charts'
                              },
                              {
                                name: 'Calendar',
                                to: '/backend/plugins/calendar'
                              },
                              {
                                name: 'Carousel',
                                to: '/backend/plugins/carousel'
                              },
                              {
                                name: 'Syntax Highlighting',
                                to: '/backend/plugins/syntax-highlighting'
                              },
                              {
                                name: 'Rating',
                                to: '/backend/plugins/rating'
                              },
                              {
                                name: 'Dialogs',
                                to: '/backend/plugins/dialogs'
                              },
                              {
                                name: 'Notifications',
                                to: '/backend/plugins/notifications'
                              },
                              {
                                name: 'Gallery',
                                to: '/backend/plugins/gallery'
                              }
                            ]
                          },
                          {
                            name: 'Layout',
                            icon: 'si si-magic-wand',
                            subActivePaths: '/backend/layout',
                            sub: [
                              {
                                name: 'Page',
                                subActivePaths: '/backend/layout/page',
                                sub: [
                                  {
                                    name: 'Default',
                                    to: '/backend/layout/page/default'
                                  },
                                  {
                                    name: 'Flipped',
                                    to: '/backend/layout/page/flipped'
                                  }
                                ]
                              },
                              {
                                name: 'Main Content',
                                subActivePaths: '/backend/layout/main-content',
                                sub: [
                                  {
                                    name: 'Full Width',
                                    to: '/backend/layout/main-content/full-width'
                                  },
                                  {
                                    name: 'Narrow',
                                    to: '/backend/layout/main-content/narrow'
                                  },
                                  {
                                    name: 'Boxed',
                                    to: '/backend/layout/main-content/boxed'
                                  }
                                ]
                              },
                              {
                                name: 'Header',
                                subActivePaths: '/backend/layout/header',
                                sub: [
                                  {
                                    name: 'Fixed',
                                    heading: true
                                  },
                                  {
                                    name: 'Light',
                                    to: '/backend/layout/header/fixed-light'
                                  },
                                  {
                                    name: 'Dark',
                                    to: '/backend/layout/header/fixed-dark'
                                  },
                                  {
                                    name: 'Static',
                                    heading: true
                                  },
                                  {
                                    name: 'Light',
                                    to: '/backend/layout/header/static-light'
                                  },
                                  {
                                    name: 'Dark',
                                    to: '/backend/layout/header/static-dark'
                                  }
                                ]
                              },
                              {
                                name: 'Sidebar',
                                subActivePaths: '/backend/layout/sidebar',
                                sub: [
                                  {
                                    name: 'Mini',
                                    to: '/backend/layout/sidebar/mini'
                                  },
                                  {
                                    name: 'Light',
                                    to: '/backend/layout/sidebar/light'
                                  },
                                  {
                                    name: 'Dark',
                                    to: '/backend/layout/sidebar/dark'
                                  },
                                  {
                                    name: 'Hidden',
                                    to: '/backend/layout/sidebar/hidden'
                                  }
                                ]
                              },
                              {
                                name: 'Side Overlay',
                                subActivePaths: '/backend/layout/side-overlay',
                                sub: [
                                  {
                                    name: 'Visible',
                                    to: '/backend/layout/side-overlay/visible'
                                  },
                                  {
                                    name: 'Hover Mode',
                                    to: '/backend/layout/side-overlay/hover-mode'
                                  },
                                  {
                                    name: 'No Page Overlay',
                                    to: '/backend/layout/side-overlay/no-page-overlay'
                                  }
                                ]
                              },
                              {
                                name: 'Loaders',
                                to: '/backend/layout/loaders'
                              },
                              {
                                name: 'API',
                                to: '/backend/layout/api'
                              }
                            ]
                          },
                          {
                            name: 'Multi Level Menu',
                            icon: 'si si-puzzle',
                            sub: [
                              {
                                name: 'Link 1-1',
                                to: '#'
                              },
                              {
                                name: 'Link 1-2',
                                to: '#'
                              },
                              {
                                name: 'Sub Level 2',
                                sub: [
                                  {
                                    name: 'Link 2-1',
                                    to: '#'
                                  },
                                  {
                                    name: 'Link 2-2',
                                    to: '#'
                                  },
                                  {
                                    name: 'Sub Level 3',
                                    sub: [
                                      {
                                        name: 'Link 4-1',
                                        to: '#'
                                      },
                                      {
                                        name: 'Link 4-2',
                                        to: '#'
                                      },
                                      {
                                        name: 'Sub Level 5',
                                        sub: [
                                          {
                                            name: 'Link 5-1',
                                            to: '#'
                                          },
                                          {
                                            name: 'Link 5-2',
                                            to: '#'
                                          },
                                          {
                                            name: 'Sub Level 6',
                                            sub: [
                                              {
                                                name: 'Link 6-1',
                                                to: '#'
                                              },
                                              {
                                                name: 'Link 6-2',
                                                to: '#'
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            name: 'Pages',
                            heading: true
                          },
                          {
                            name: 'Generic',
                            icon: 'si si-layers',
                            subActivePaths: '/backend/pages/generic',
                            sub: [
                              {
                                name: 'Blank',
                                to: '/backend/pages/generic/blank'
                              },
                              {
                                name: 'Blank (Block)',
                                to: '/backend/pages/generic/blank-block'
                              },
                              {
                                name: 'Search',
                                to: '/backend/pages/generic/search'
                              },
                              {
                                name: 'Profile',
                                to: '/backend/pages/generic/profile'
                              },
                              {
                                name: 'Invoice',
                                to: '/backend/pages/generic/invoice'
                              },
                              {
                                name: 'FAQ',
                                to: '/backend/pages/generic/faq'
                              },
                              {
                                name: 'Inbox',
                                to: '/backend/pages/generic/inbox'
                              },
                              {
                                name: 'Maintenance',
                                to: '/maintenance'
                              },
                              {
                                name: 'Status',
                                to: '/status'
                              },
                              {
                                name: 'Coming Soon',
                                to: '/coming-soon'
                              }
                            ]
                          },
                          {
                            name: 'Authentication',
                            icon: 'si si-lock',
                            subActivePaths: '/backend/pages/auth',
                            sub: [
                              {
                                name: 'All',
                                to: '/backend/pages/auth/all'
                              },
                              {
                                name: 'Sign In',
                                to: '/auth/signin'
                              },
                              {
                                name: 'Sign In 2',
                                to: '/auth/signin2'
                              },
                              {
                                name: 'Sign In 3',
                                to: '/auth/signin3'
                              },
                              {
                                name: 'Sign Up',
                                to: '/auth/signup'
                              },
                              {
                                name: 'Sign Up 2',
                                to: '/auth/signup2'
                              },
                              {
                                name: 'Sign Up 3',
                                to: '/auth/signup3'
                              },
                              {
                                name: 'Lock Screen',
                                to: '/auth/lock'
                              },
                              {
                                name: 'Lock Screen 2',
                                to: '/auth/lock2'
                              },
                              {
                                name: 'Lock Screen 3',
                                to: '/auth/lock3'
                              },
                              {
                                name: 'Pass Reminder',
                                to: '/auth/reminder'
                              },
                              {
                                name: 'Pass Reminder 2',
                                to: '/auth/reminder2'
                              },
                              {
                                name: 'Pass Reminder 3',
                                to: '/auth/reminder3'
                              }
                            ]
                          },
                          {
                            name: 'Error Pages',
                            icon: 'si si-fire',
                            subActivePaths: '/backend/pages/errors',
                            sub: [
                              {
                                name: 'All',
                                to: '/backend/pages/errors/all'
                              },
                              {
                                name: '400',
                                to: '/errors/400'
                              },
                              {
                                name: '401',
                                to: '/errors/401'
                              },
                              {
                                name: '403',
                                to: '/errors/403'
                              },
                              {
                                name: '404',
                                to: '/errors/404'
                              },
                              {
                                name: '500',
                                to: '/errors/500'
                              },
                              {
                                name: '503',
                                to: '/errors/503'
                              }
                            ]
                          },
                      ]"
          >
          </base-navigation>
        </div>
        <!-- END Side Navigation -->
      </simplebar>
      <!-- END Sidebar Scrolling -->
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header>
      <!-- Header Content -->
      <div class="content-header">
        <!-- Left Section -->
        <div class="d-flex align-items-center">
          <!-- Toggle Sidebar -->
          <base-layout-modifier action="sidebarToggle"
                                size="sm"
                                variant="dual"
                                class="mr-2 d-lg-none"
          >
            <i class="fa fa-fw fa-bars"></i>
          </base-layout-modifier>
          <!-- END Toggle Sidebar -->

          <!-- Toggle Mini Sidebar -->
          <base-layout-modifier action="sidebarMiniToggle"
                                size="sm"
                                variant="dual"
                                class="mr-2 d-none d-lg-inline-block"

          >
            <i class="fa fa-fw fa-ellipsis-v"></i>
          </base-layout-modifier>
          <!-- END Toggle Mini Sidebar -->
        </div>
        <!-- END Left Section -->

        <!-- Right Section -->
        <div class="d-flex align-items-center justify-content-around">
          <!--           Toggle Side Overlay-->
          <!--          <base-layout-modifier action="sideOverlayToggle" variant="dual" size="sm" class="ml-2">-->
          <!--            <i class="fa fa-fw fa-list-ul fa-flip-horizontal"></i>-->
          <!--          </base-layout-modifier>-->
          <b-button variant="light"
                    class="mr-4"
                    v-click-ripple
                    to="/retrieve-user/"
          >
            <i class="fa fa-user opacity-50 mr-1"></i>{{ $store.getters.USER.username }} ({{ $store.getters.USER.role}})
          </b-button>
          <b-button variant="alt-danger"
                    @click="logout"
                    v-click-ripple
          >
            <i class="si si-logout opacity-50 mr-1"></i> Выход
          </b-button>
          <!--           END Toggle Side Overlay-->
        </div>
        <!-- END Right Section -->
      </div>
      <!-- END Header Content -->
    </template>
    <!-- END Header Content -->

    <!-- Footer Content -->
    <!-- Using the available v-slot, we can override the default Footer content from layouts/partials/Footer.vue -->
    <template>
      <div class="content py-3">
        <b-row class="font-size-sm">
          <b-col sm="6"
                 order-sm="2"
                 class="py-1 text-center text-sm-right"
          >
            <!--            Crafted with <i class="fa fa-heart text-danger"></i> by <a class="font-w600" href="https://1.envato.market/5Noyb" target="_blank">pixelcave</a>-->
          </b-col>
          <b-col sm="6"
                 order-sm="1"
                 class="py-1 text-center text-sm-left"
          >
            <b>Fiscal Report 0.0.1</b> &copy; 2022
          </b-col>
        </b-row>
      </div>
    </template>
    <!-- END Footer Content -->
  </base-layout>
</template>

<script>
import BaseLayout from '../Base'
import {mapActions} from "vuex";

// SimpleBar, for more info and examples you can check out https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-vue
import simplebar from 'simplebar-vue'

export default {
  name: 'LayoutBackend',
  components: {
    BaseLayout,
    simplebar
  },
  data() {
    return {
      // Override and set custom CSS classes to the container of each base layout element
      layoutClasses: {
        sideOverlay: '',
        sidebar: '',
        header: '',
        footer: ''
      }
    }
  },
  created() {
    // Set default elements for this layout
    this.$store.commit('setLayout', {
      header: true,
      sidebar: true,
      // sideOverlay: true,
      sideOverlay: false,
      footer: true
    })

    // Set various template options
    this.$store.commit('headerStyle', {mode: 'light'})
    this.$store.commit('mainContent', {mode: 'full'})
  },
  methods: {
    ...mapActions(["SET_USER"]),
    logout() {
      this.$http
          .get("/auth/logout/")
          .then(res => {
            this.SET_USER({username: "", phone: "", email: ""});
            this.$router.push({
              name: "login",
              params: {
                username: res.data.username,
                messages_data: {type: res.data.status, messages: res.data.messages}
              }
            });
          })
          .catch(error => console.error(error));
    }
  }
}
</script>
