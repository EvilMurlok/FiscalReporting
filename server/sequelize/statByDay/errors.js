class StatByDayCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'StatByDayCommonError';
    }
}

class StatByDayCredentialsError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayCredentialsError';
    }
}

class StatByDaySameCredentialsError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDaySameCredentialsError';
    }
}

class StatByDayNotUpdatedDataError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayNotUpdatedDataError';
    }
}

class StatByDayNotFoundError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayNotFoundError';
    }
}

class StatByDayDeletionError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayDeletionError';
    }
}

class StatByDayTransactionError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayTransactionError';
    }
}

class StatByDayGrafanaError extends StatByDayCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'StatByDayGrafanaError';
    }
}

module.exports = {
    StatByDayCommonError,
    StatByDayCredentialsError,
    StatByDaySameCredentialsError,
    StatByDayNotUpdatedDataError,
    StatByDayNotFoundError,
    StatByDayDeletionError,
    StatByDayTransactionError,
    StatByDayGrafanaError
}

