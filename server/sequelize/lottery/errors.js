class LotteryCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = 'LotteryCommonError';
    }
}

class LotteryCredentialsError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryCredentialsError';
    }
}

class LotterySameCredentialsError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotterySameCredentialsError';
    }
}

class LotteryNotUpdatedDataError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNotUpdatedDataError';
    }
}

class LotteryNotFoundError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryNotFoundError';
    }
}

class LotteryDeletionError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryDeletionError';
    }
}

class LotteryTransactionError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryTransactionError';
    }
}

class LotteryGrafanaError extends LotteryCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = 'LotteryGrafanaError';
    }
}

module.exports = {
    LotteryCommonError,
    LotteryCredentialsError,
    LotterySameCredentialsError,
    LotteryNotUpdatedDataError,
    LotteryNotFoundError,
    LotteryDeletionError,
    LotteryTransactionError,
    LotteryGrafanaError
}

