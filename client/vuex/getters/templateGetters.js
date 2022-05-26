export default {
    // Get App name
    appName: (state) => {
        return state.app.name
    },
    // Get App version
    appVersion: (state) => {
        return state.app.version
    },
    // Get App copyright year
    appCopyright: (state) => {
        return state.app.copyright
    },
    // Get app color theme
    appColorTheme: (state) => {
        return state.settings.colorTheme
    },
}