class PartnerCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'PartnerCommonError';
    }
}

class PartnerCredentialsError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerCredentialsError';
    }
}

class PartnerSameCredentialsError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerSameCredentialsError';
    }
}

class PartnerNotUpdatedDataError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerNotUpdatedDataError';
    }
}

class PartnerNotFoundError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerNotFoundError';
    }
}

class PartnerDeletionError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerDeletionError';
    }
}

class PartnerTransactionError extends PartnerCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'PartnerTransactionError';
    }
}

module.exports = {
    PartnerCommonError,
    PartnerCredentialsError,
    PartnerSameCredentialsError,
    PartnerNotUpdatedDataError,
    PartnerNotFoundError,
    PartnerDeletionError,
    PartnerTransactionError,
}

