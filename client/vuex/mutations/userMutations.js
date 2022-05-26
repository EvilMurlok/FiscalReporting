export default {
    SET_USER: (state, newUser) => {
        state.user.id = newUser.id;
        state.user.username = newUser.username;
        state.user.role = newUser.role;
        state.user.created = newUser.created;
    },
}