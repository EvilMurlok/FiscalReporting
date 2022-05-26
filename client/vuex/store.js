import Vue from 'vue'
import Vuex from 'vuex'

// getters
import templateGetters from "./getters/templateGetters";
import userGetters from "./getters/userGetters";

// mutations
import templateMutations from "./mutations/templateMutations";
import userMutations from "./mutations/userMutations";

// actions
import userActions from "./actions/userActions";
import userApiRequests from "./actions/userApiRequests";

Vue.use(Vuex);

const getters = {...templateGetters, ...userGetters};
const mutations = {...templateMutations, ...userMutations};
const actions = {...userActions, ...userApiRequests};


export default new Vuex.Store({
    state: {
        app: {
            name: 'OneUI Vue Edition',
            version: process.env.PACKAGE_VERSION,
            copyright: new Date().getFullYear()
        },

        // Default layout options
        layout: {
            header: true,
            sidebar: true,
            sideOverlay: true,
            footer: true
        },

        settings: {
            colorTheme: '', // 'amethyst', 'city', 'flat', 'modern', 'smooth'
            sidebarLeft: true,
            sidebarMini: false,
            sidebarDark: true,
            sidebarVisibleDesktop: true,
            sidebarVisibleMobile: false,
            sideOverlayVisible: false,
            sideOverlayHoverable: false,
            pageOverlay: true,
            headerFixed: true,
            headerDark: false,
            headerSearch: false,
            headerLoader: false,
            pageLoader: false,
            rtlSupport: false,
            sideTransitions: true,
            mainContent: '' // 'boxed', ''narrow'
        },

        permissions: [],
        user: { id: 0, username: "", role: "", created: ""},
    },
    mutations,
    actions,
    getters,
});