class HardDayCommonError extends Error {
    constructor(message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'HardDayCommonError';
    }
}

class HardDayCredentialsError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDayCredentialsError';
    }
}

class HardDaySameCredentialsError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDaySameCredentialsError';
    }
}

class HardDayNotUpdatedDataError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDayNotUpdatedDataError';
    }
}

class HardDayNotFoundError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDayNotFoundError';
    }
}

class HardDayDeletionError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDayDeletionError';
    }
}

class HardDayTransactionError extends HardDayCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = 'HardDayTransactionError';
    }
}

module.exports = {
    HardDayCommonError,
    HardDayCredentialsError,
    HardDaySameCredentialsError,
    HardDayNotUpdatedDataError,
    HardDayNotFoundError,
    HardDayDeletionError,
    HardDayTransactionError,
}

