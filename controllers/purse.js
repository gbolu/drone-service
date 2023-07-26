
const { Wallet } = require('../models/Wallet')
const { generateChecksum } = require('../_helpers/helpers')

class purse {

    constructor(data) {
        this.customerData = data
    }

    async createWallet() {
        const { customerData } = this
        return  Wallet.query().insert({
                    account_id: customerData.account_id,
                    balance: 0,
                    checksum: generateChecksum()
                })
    }

    async fundWallet() {
        const { customerData } = this
        const getCustomerWallet = await Wallet.query().where('account_id', customerData.account_id).first()
        const oldBalance = parseFloat(getCustomerWallet.balance)
        const newBalance = oldBalance + parseFloat(customerData.amount)

        return Wallet.query().patchAndFetchById(customerData.account_id, {
            balance: newBalance
        })
    
        
    }

    async debitWallet() {
        const { customerData } = this
        const getCustomerWallet = await Wallet.query().where('account_id', customerData.account_id).first()
        const oldBalance = parseFloat(getCustomerWallet.balance)
        const newBalance = oldBalance - parseFloat(customerData.amount)
        return Wallet.query().patchAndFetchById(customerData.account_id, {
            balance: newBalance
        })
        
        
    }

    async getWalletBalance() {
        const { customerData } = this
        const getCustomerWallet = await Wallet.query().where('account_id', customerData.account_id).first()
        return getCustomerWallet
    }

    async getWalletTransactions() {
        const { customerData } = this
        const getCustomerWalletTransactions = await Wallet.query().where('account_id', customerData.account_id)
        return getCustomerWalletTransactions
    }

    async getWalletTransaction() { 
        const { customerData } = this
        const getCustomerWalletTransaction = await Wallet.query().where('id', customerData.id)
        return getCustomerWalletTransaction
    }

     


}

module.exports =  purse 