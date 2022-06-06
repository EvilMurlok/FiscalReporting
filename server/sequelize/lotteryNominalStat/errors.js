class LotteryNominalStatCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'LotteryNominalStatCommonError';
    }
}

class LotteryNominalStatCredentialsError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatCredentialsError';
    }
}

class LotteryNominalStatSameCredentialsError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatSameCredentialsError';
    }
}

class LotteryNominalStatNotUpdatedDataError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatNotUpdatedDataError';
    }
}

class LotteryNominalStatNotFoundError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatNotFoundError';
    }
}

class LotteryNominalStatDeletionError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatDeletionError';
    }
}

class LotteryNominalStatTransactionError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatTransactionError';
    }
}

class LotteryNominalStatGrafanaError extends LotteryNominalStatCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalStatGrafanaError';
    }
}

module.exports = {
    LotteryNominalStatCommonError,
    LotteryNominalStatCredentialsError,
    LotteryNominalStatSameCredentialsError,
    LotteryNominalStatNotUpdatedDataError,
    LotteryNominalStatNotFoundError,
    LotteryNominalStatDeletionError,
    LotteryNominalStatTransactionError,
    LotteryNominalStatGrafanaError
}

