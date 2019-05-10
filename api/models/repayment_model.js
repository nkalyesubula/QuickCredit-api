class Repayment{
    constructor(id, createdOn, loanId, amount){
        this.id = id;
        this.createdOn = createdOn;
        this.loanId = loanId;
        this.amount = amount;
    }
}

module.exports = Repayment;