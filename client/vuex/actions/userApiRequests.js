import Vue from "vue";

export default {
    GET_USER_INFO_FROM_API({commit}) {
        return Vue.prototype.$http
            .get("/auth/user-profile/")
            .then(res => {
                if (res.data.isLoggedIn === false) {
                    commit("SET_USER", {id: 0, username: "", role: "", created: ""});
                    throw ({type: res.data.status, messages: res.data.messages});
                } else {
                    console.log(res.data.user)
                    commit("SET_USER", res.data.user);
                    return res;
                }
            })
            .catch(err => {
                throw err;
            });
    },
}