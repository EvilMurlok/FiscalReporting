class ParcelCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'ParcelCommonError';
    }
}

class ParcelCredentialsError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelCredentialsError';
    }
}

class ParcelSameCredentialsError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelSameCredentialsError';
    }
}

class ParcelNotUpdatedDataError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelNotUpdatedDataError';
    }
}

class ParcelNotFoundError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelNotFoundError';
    }
}

class ParcelDeletionError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelDeletionError';
    }
}

class ParcelTransactionError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelTransactionError';
    }
}

class ParcelGrafanaError extends ParcelCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'ParcelGrafanaError';
    }
}

module.exports = {
    ParcelCommonError,
    ParcelCredentialsError,
    ParcelSameCredentialsError,
    ParcelNotUpdatedDataError,
    ParcelNotFoundError,
    ParcelDeletionError,
    ParcelTransactionError,
    ParcelGrafanaError
}

