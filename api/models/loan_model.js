class Loan{
    constructor(id, createdOn, email, tenor, amount){
        this.id = id;
        this.user = email
        this.createdOn = createdOn;
        this.status = 'pending';
        this.repaid = false;
        this.tenor = tenor;
        this.amount = amount;
        this.interest = (0.05 * this.amount);
        this.paymentInstallment = ((amount + this.interest) / this.tenor);
        this.balance = (amount+ this.interest);
    }
}

export default Loan;