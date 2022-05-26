import Vue from 'vue'
import Router from 'vue-router'
import store from "../../vuex/store"

// auth
import vLogin from '@/views/authorization/v-login';

// main
import vMain from '@/views/main/v-main';

// settings Kq
import vFiscalReportKq from "@/views/settingsKq/v-settings-kq";

// circulation
import vFiscalReportCirculation from "@/views/circulation/v-fiscal-report-circulation";
import vFiscalReportRemainders from "@/views/circulation/v-fiscal-report-remainders";
import vFiscalReportCirculationHistory from "@/views/circulation/v-fiscal-report-circulation-history";

// checks
import vFiscalReportInspections from "@/views/checks/v-fiscal-report-inspections";

// report
import vFiscalReport from "@/views/report/v-fiscal-report";

// user
import vRetrieveUser from "@/views/user/v-user-info";

// root
import vRegisterUser from "@/views/root/v-register-user";

// errors
import vNotFoundPage from "@/views/errors/v-not-found"

import LayoutSimple from '@/layouts/variations/Simple';
import LayoutBackend from '@/layouts/variations/BackendStarter';


Vue.use(Router);

let router = new Router({
    // mode: "history",
    routes: [
        // guests
        {
            path: '/',
            redirect: '/login/'
        },
        {
            path: '/login/',
            component: LayoutSimple,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/login/',
                    name: 'login',
                    component: vLogin
                }
            ]
        },

        // root
        {
            path: '/register-user/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresRoot: true,
            },
            children: [
                {
                    path: '/register-user/',
                    name: 'registerUser',
                    component: vRegisterUser
                }
            ]
        },

        // admin
        {
            path: '/fiscal-report-kq/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresAdmin: true,
            },
            children: [
                {
                    path: '/fiscal-report-kq/',
                    name: 'fiscalReportKq',
                    component: vFiscalReportKq
                }
            ]
        },
        {
            path: '/fiscal-report-inspections/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresAdmin: true,
            },
            children: [
                {
                    path: '/fiscal-report-inspections/',
                    name: 'fiscalReportInspections',
                    component: vFiscalReportInspections
                }
            ]
        },

        // specialist
        {
            path: '/fiscal-report-circulation/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresSpecialist: true,
            },
            children: [
                {
                    path: '/fiscal-report-circulation/',
                    name: 'fiscalReportCirculation',
                    component: vFiscalReportCirculation
                }
            ]
        },

        // employee
        {
            path: '/fiscal-report-remainders/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresEmployee: true
            },
            children: [
                {
                    path: '/fiscal-report-remainders/',
                    name: 'fiscalReportRemainders',
                    component: vFiscalReportRemainders
                }
            ]
        },
        {
            path: '/fiscal-report-circulation-history/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresEmployee: true
            },
            children: [
                {
                    path: '/fiscal-report-circulation-history/',
                    name: 'fiscalReportCirculationHistory',
                    component: vFiscalReportCirculationHistory
                }
            ]
        },
        {
            path: '/fiscal-report/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresEmployee: true
            },
            children: [
                {
                    path: '/fiscal-report/',
                    name: 'fiscalReport',
                    component: vFiscalReport
                }
            ]
        },
        {
            path: '/main/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresEmployee: true
            },
            children: [
                {
                    path: '/main/',
                    name: 'main',
                    component: vMain
                }
            ]
        },
        {
            path: '/retrieve-user/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
                requiresEmployee: true
            },
            children: [
                {
                    path: '/retrieve-user/',
                    name: 'retrieveUser',
                    component: vRetrieveUser
                }
            ]
        },

        {
            path: "/not-found-page/",
            component: vNotFoundPage,
            children: [
                {
                    path: "/not-found-page/",
                    name: "notFoundPage",
                    component: vNotFoundPage
                }
            ]
        },
    ]
});

function checkRole(requiredRole = "employee", next) {
    const codeOfRole = {"employee": 0, "specialist": 1, "admin": 2, "root": 3};
    if (codeOfRole[store.getters.USER.role] >= codeOfRole[requiredRole]) {
        next();
    } else {
        router.push({
            name: "notFoundPage",
        });
    }
}

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        store.dispatch("GET_USER_INFO_FROM_API")
            .then(res => {
                if (res.data) {
                    console.log("Пользователь успешно авторизован!");
                    if (to.matched.some(record => record.meta.requiresRoot)) {
                        checkRole("root", next);
                    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
                        checkRole("admin", next);
                    } else if (to.matched.some(record => record.meta.requiresSpecialist)) {
                        checkRole("specialist",  next);
                    } else if (to.matched.some(record => record.meta.requiresEmployee)) {
                        checkRole("employee", next);
                    }
                    // // if we wanna filter some data and stay on the same page we gotta refresh the page!
                    // if (from.name === to.name) {
                    //     router.go(0);
                    // }
                }
            })
            .catch(e => {
                router.push({
                    name: "login",
                    params: {
                        messages_data: {type: e.type, messages: e.messages}
                    }
                });
            });
    } else if (to.matched.some(record => record.meta.guest)) {
        if (store.getters.USER.username) {
            next({name: 'main'});
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;