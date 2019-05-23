class Loan{
    constructor(email, tenor, amount){
        this.user = email
        this.tenor = tenor;
        this.amount = amount;
        this.interest = (0.05 * this.amount);
        this.paymentInstallment = ((amount + this.interest) / this.tenor);
        this.balance = (amount+ this.interest);
    }
}

export default Loan;