class PackCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'PackCommonError';
    }
}

class PackCredentialsError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackCredentialsError';
    }
}

class PackSameCredentialsError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackSameCredentialsError';
    }
}

class PackNotUpdatedDataError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackNotUpdatedDataError';
    }
}

class PackNotFoundError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackNotFoundError';
    }
}

class PackDeletionError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackDeletionError';
    }
}

class PackTransactionError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackTransactionError';
    }
}

class PackGrafanaError extends PackCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PackGrafanaError';
    }
}

module.exports = {
    PackCommonError,
    PackCredentialsError,
    PackSameCredentialsError,
    PackNotUpdatedDataError,
    PackNotFoundError,
    PackDeletionError,
    PackTransactionError,
    PackGrafanaError
}

