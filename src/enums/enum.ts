enum AUTH_STATUS {
    INIT = 0,
    LOADING = 1,
    SUCCESS = 2,
    ERROR = 3
}

enum ROLES {
    ADMIN = "ADMIN",
    USER = "USER"
}

enum LANGUAGES {
    IT = "IT",
    EN = "EN"
}

enum ALERT_COLOR {
    SUCCESS = "green",
    ERROR = "red",
    WARNING = "yellow"
}

export {
    AUTH_STATUS,
    ROLES,
    LANGUAGES,
    ALERT_COLOR
}