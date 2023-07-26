const { CustomerCardDatas } = require('../models/CustomerCardDatas')


class transaction {

    constructor(data) {
        this.customerData = data
    }

    async credit() {
        const { customerData } = this
        const getCustomerWallet = await CustomerCardDatas.query().where('account_id', customerData.account_id).first()
        const oldBalance = parseFloat(getCustomerWallet.balance)
        const newBalance = oldBalance + parseFloat(customerData.amount)
        return CustomerCardDatas.query().patchAndFetchById(customerData.account_id, {
            balance: newBalance
        })
    }
    
   async debit() {
        const { customerData } = this
        const getCustomerWallet = await CustomerCardDatas.query().where('account_id', customerData.account_id).first()
       const oldBalance = parseFloat(getCustomerWallet.balance)
       if (oldBalance < parseFloat(customerData.amount)) {
           throw new Error('Insufficient funds')
       }
        const newBalance = oldBalance - parseFloat(customerData.amount)
        return CustomerCardDatas.query().patchAndFetchById(customerData.account_id, {
            balance: newBalance
        })
        
    }

}

module.exports = { transaction }