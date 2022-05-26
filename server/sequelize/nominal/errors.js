class NominalCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'NominalCommonError';
    }
}

class NominalCredentialsError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalCredentialsError';
    }
}

class NominalSameCredentialsError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalSameCredentialsError';
    }
}

class NominalNotUpdatedDataError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalNotUpdatedDataError';
    }
}

class NominalNotFoundError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalNotFoundError';
    }
}

class NominalDeletionError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalDeletionError';
    }
}

class NominalTransactionError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalTransactionError';
    }
}

class NominalGrafanaError extends NominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'NominalGrafanaError';
    }
}

module.exports = {
    NominalCommonError,
    NominalCredentialsError,
    NominalSameCredentialsError,
    NominalNotUpdatedDataError,
    NominalNotFoundError,
    NominalDeletionError,
    NominalTransactionError,
    NominalGrafanaError
}

