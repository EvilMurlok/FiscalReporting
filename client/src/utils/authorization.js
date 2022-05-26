import store from "../../vuex/store"
import router from "@/router/router";

const breakAuth = async (res) => {
    const username = store.getters.USER.username;
    await store.dispatch("SET_USER", {username: "", email: "", phone: ""});
    router.push({
        name: "login",
        params: {
            username: username,
            messages_data: {type: res.data.status, messages: res.data.messages}
        }
    });
}
export default {
    breakAuth
};