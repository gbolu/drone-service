require('dotenv').config()
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid') 
const { isEmpty, generateOTP, generateReferralCode, hashMyPassword } = require('../_helpers/helpers')
const { otp_type }  = require('../enums/otp')
const { readFileAndSendEmail } = require('../services/email')
const messages = require('../constants/messages')
const { Account } = require('../models/Account')
const { Investment } = require('../models/I')
const { Wallet } = require('../models/Wallet')

/**
 * create investment, 
 * 
 */
const create = async(req, res) => {
    
    const { lastname, othernames, email, password, referrer_code } = req.body

    try {
         // check if email exists
        const checkIfAccountExists = await Account.query().where('email', email)
       
        if (!isEmpty(checkIfAccountExists)) {
            throw new Error(messages.CustomerExist)
        }

        //hash the password
        const getPasswordSaltAndhash = await hashMyPassword(password)
        const account_id = uuidv4()
        //email does not exists, create customer
        const createNewCustomer = await Account.query().insert({
            account_id: account_id,
            lastname: lastname,
            othernames: othernames,
            email: email,
            password_salt: getPasswordSaltAndhash[0],
            password_hash: getPasswordSaltAndhash[1],
            referrer_code: generateReferralCode(),
            who_referred_customer: referrer_code
        })
        
        //error occured: query couldnt execute properly  - this is likely on us
        if (isEmpty(createNewCustomer)) {
            //log the exact error usinf a logger 
            //Todo: Add a logger here
            throw new Error(messages.GeneralError)
        }
        //create wallet for customer

        await Wallet.query().insert({
            account_id: account_id,
            checksum: "checksum to be done"
        })
        //account successfully created, send otp to customer email
        const _otp = generateOTP()
        const sendOtpToCreatedUser = await Otp.query().insert({
                email: email,
                otp: _otp,
                type: otp_type.createAccount
        })
        
        if (isEmpty(sendOtpToCreatedUser)) {
           //log the exact error usinf a logger 
            //Todo: Add a logger here
            throw new Error(messages.GeneralError)
        }

        //otp successfully create, send to customer by email
        let dataReplacement = {
            "fullname": ` ${lastname}, ${othernames}`,
            "otp": `${_otp}`
        }

        readFileAndSendEmail(email, "OTP", dataReplacement, "otp")            
           
        res.status(201).send({
            status: "success",
            message: messages.CustomerCreated
        })
        
    } catch (error) {

        res.status(400).send({
            status: "error",
            message: error.message
        })
    }
}





module.exports = {
    create,

    
}