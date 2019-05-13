class Repayment{
    constructor(id, userId, createdOn, loanId, amount){
        this.id = id;
        this.userId = userId;
        this.createdOn = createdOn;
        this.loanId = loanId;
        this.amount = amount;
    }
}

module.exports = Repayment;