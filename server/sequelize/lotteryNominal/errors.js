class LotteryNominalCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'LotteryNominalCommonError';
    }
}

class LotteryNominalCredentialsError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalCredentialsError';
    }
}

class LotteryNominalSameCredentialsError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalSameCredentialsError';
    }
}

class LotteryNominalNotUpdatedDataError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalNotUpdatedDataError';
    }
}

class LotteryNominalNotFoundError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalNotFoundError';
    }
}

class LotteryNominalDeletionError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalDeletionError';
    }
}

class LotteryNominalTransactionError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalTransactionError';
    }
}

class LotteryNominalGrafanaError extends LotteryNominalCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNominalGrafanaError';
    }
}

module.exports = {
    LotteryNominalCommonError,
    LotteryNominalCredentialsError,
    LotteryNominalSameCredentialsError,
    LotteryNominalNotUpdatedDataError,
    LotteryNominalNotFoundError,
    LotteryNominalDeletionError,
    LotteryNominalTransactionError,
    LotteryNominalGrafanaError
}

