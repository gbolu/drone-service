require('dotenv').config()
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid') 
const { isEmpty, generateOTP, generateReferralCode, hashMyPassword } = require('../_helpers/helpers')
const { otp_type }  = require('../enums/otp')
const { readFileAndSendEmail } = require('../services/email')
const messages = require('../constants/messages')
const { Account } = require('../models/Account')
const { Otp } = require('../models/Otp')
const { CustomerBankAccount } = require('../models/CustomerBankAccount')
const { CustomerCardDatas } = require('../models/CustomerCardDatas')
const { CustomerBvnDetails } = require('../models/CustomerBvnDetails')
const { initializePayment, resolveBVN, getBanks, resolveAccountNumber } = require('../services/payment')
const { bvnResolve } = require('../services/qoreid')
const purse = require('./purse')
const { createWallet } = new purse()

/**
 * create customer, 
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
        createWallet(account_id)

        // await Wallet.query().insert({
        //     account_id: account_id,
        //     balance: 0,
        //     checksum: generateChecksum()
        // })
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



/**
 * verify otp
 */
 const verifyOTP = async (req, res) => {

     const { email, otp } = req.params
     try {
         // check if email exists
         const checkIfOTPAndEmailExistsTogether = await Otp.query()
             .where('email', email)
             .where('otp', otp)
             .where('type',  otp_type.createAccount) //type = 1 for account otp verification 
             .orderBy('created_at', 'desc')
             .limit(1, true)
    
         if (isEmpty(checkIfOTPAndEmailExistsTogether)){
             throw new Error(messages.OtpMismatch)
         }
         //otp exists, check if otp is still valid
         const elapsedTime = Date.now() -  checkIfOTPAndEmailExistsTogether[0].created_at
         if ((Math.floor(elapsedTime / 60000) > process.env.OTPExpirationTime))
         {
             //log here that otp has expired
             throw new Error(messages.OtpExpired)
         }

         //otp is valid, go ahead to delete otp and update email verification for customer
        // await Otp.query().deleteById(parseInt(checkIfOTPAndEmailExistsTogether[0].id))
         await Otp.query().delete().where('email', email)

         await Account.query().patch({is_email_verified: true}).where('email', email);

         const dataToUpdate = {}
        //send welcome email 
        readFileAndSendEmail (email, "WELCOME ONBOARD", dataToUpdate, 'welcome')
            
        res.status(200).send({
            status: "success",
            message: messages.OtpVerificationSuccessful
        })
         

     } catch (error) {
         //todo: add logger
        res.status(400).send({
            status: "error",
            message: error.message
        })
     }


 }



 /**
 * resend otp
 */
const resendOTP = async (req, res) => {
    
    const { email } = req.params 
    const _otp = generateOTP()
    try {

        const getOtpInitiallySentToCustomer = await Otp.query()
            .delete()
            .where('email', email)
            .where('type',  otp_type.createAccount)
           
       

        const resendOtpToCreatedUser = await Otp.query().insert({
            email: email,
            otp: _otp,
            type: otp_type.createAccount
        })
        
        if (isEmpty(resendOtpToCreatedUser)) {
           //log the exact error usinf a logger 
            //Todo: Add a logger here
            throw new Error(messages.GeneralError)
        }

        //otp successfully create, send to customer by email
        let dataReplacement = {
            "fullname": ``,
            "otp": `${_otp}`
        }

        readFileAndSendEmail(email, "RESEND OTP", dataReplacement, "otp")            
    
        res.status(200).send({
            status: "success",
            message: messages.OtpResentSentSuccessfully
        })

    } catch (error) {
        //add logger 
        console.log(error.message)

        res.status(400).send({
            status: "error",
            message: messages.GeneralError
        })
    }


  
}



 /**
 * Start Forget Password 
 */
  const startForgetPassword = async (req, res) => {
    
    const { email } = req.params 
    const _otp = generateOTP()
    try {

        const getCustomerDetail = await Account.query().where('email', email)
       
        if (isEmpty(getCustomerDetail)) {
            throw new Error(messages.CustomerNotFound)
        }

        //email found and customer account fetched, send otp to customer email
        const sendOtpToCreatedUser = await Otp.query().insert({
                email: email,
                otp: _otp,
                type: otp_type.forgetPassword //type = 2 for start forget password
                
        })
        
        if (isEmpty(sendOtpToCreatedUser)) {
           //log the exact error using a logger 
            //Todo: Add a logger here
            throw new Error(messages.GeneralError)
        }

        //otp successfully created, send to customer by email
        let dataReplacement = {
            "fullname": ` ${getCustomerDetail.lastname}, ${getCustomerDetail.othernames}`,
            "otp": `${_otp}`
        }

        readFileAndSendEmail(email, "FORGET PASSWORD", dataReplacement, "forget_password")            
           
        
        res.status(200).send({
            status: "success",
            message: messages.ResetPasswordSuccessfully
        })

    } catch (error) {
        //add logger 
        res.status(400).send({
            status: "error",
            message: error.message
        })
    }


  
}
     
 /**
 * Verify Otp on Forget Password 
 */
  const verfiyOtpOnForgetPassword = async (req, res) => {
    
    const { email, otp } = req.params 
    try {
          const checkIfOtpMatch = await Otp.query()
                                           .where('email', email)
                                           .where('type', otp_type.forgetPassword)
                                           .where('otp', otp)
       
        if (isEmpty(checkIfOtpMatch)) {
            throw new Error(messages.OtpMismatch)
        }

         //go ahead to delete otp to proceed the forget password
         await Otp.query().delete().where('email', email)
        
        res.status(200).send({
            status: "success",
            message: "Otp match, You can go ahead to set a new password."
        })

    } catch (error) {
        //add logger 
        res.status(400).send({
            status: "error",
            message: error.message
        })
    }


  
  }

/**
 * Complete Forget Password 
 */
const completeForgetPassword = async (req, res) => {
      
    const { email, newPassword } = req.body
    try{
        //hash the password
        const newPasswordHashAndSalt = await hashMyPassword(newPassword)

        const updatePasswordHashAndSalt = await Account.query().update({
            password_salt: newPasswordHashAndSalt[0],
            password_hash: newPasswordHashAndSalt[1],
        })
        .where("email", email)
       
        if (!updatePasswordHashAndSalt) {
            //log the exact error usinf a logger 
                //Todo: Add a logger here
            console.log("cannot update the customers password: ",updatePasswordHashAndSalt )
                throw new Error(messages.GeneralError)
            }
     
             res.status(200).send({
                 status: "success",
                 message: messages.PasswordChangedSuccessfully
             })

         
} catch (error) {
    //add logger 
        console.log("error catch: ", error.message)
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 * Add BVN 
 */
 const addBvnToProfile = async (req, res) => {
      
    const {  email, bvn } = req.body
    try {
        //todos:
        //call a service to resolve bvn, get the phone
        //send otp to the phone
        const sentOtpTpBvnPhone = bvnResolve(bvn)
        const getPhoneFromBvn = ""
        const _otp = generateOTP()
        await Otp.query().insert({
            email: getPhoneFromBvn,
            otp: _otp,
            type: otp_type.bvn //type = 3 for add bvn
         })
        res.status(200).send({
            status: "success",
            message: "An otp has been sent to your Bvn phone number"
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

 }

 /**
 * verify BVN 
 */
  const verifyOtpSentToBvn = async (req, res) => {
      
    const { otp, phone } = req.params
    try {
        const checkIfOTPIsValid = await Otp.query()
            .where('otp', otp)
            .where('email', phone)
            .where('type',  otp_type.bvn) //type = 3 for bvn otp verification
            .orderBy('created_at', 'desc')
            .limit(1, true)

        if (isEmpty(checkIfOTPIsValid)){
            throw new Error(messages.OtpMismatch)
        }
        //otp exists, check if otp is still valid
        const elapsedTime = Date.now() -  checkIfOTPIsValid[0].created_at
        if ((Math.floor(elapsedTime / 60000) > process.env.OTPExpirationTime))
        {
            //log here that otp has expired
            throw new Error(messages.OtpExpired)
        }
        //otp is valid, go ahead to update bvn to verified
        await CustomerBvnDetails.query()
            .update({ is_verified: true })
            .where('id', checkIfOTPIsValid[0].id)
        //delete otp
        await Otp.query().delete().where('email', phone)

        res.status(200).send({
            status: "success",
            message: "Bvn verified successfully"
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

  }

/**
 * Change password
*/
const changeCustomersPassword = async (req, res) => {
      
        const { email } = req.body.userData
        const { newPassword, confrimNewPassword } = req.body
        try {
            if (newPassword !== confrimNewPassword) {
                throw new Error(messages.PasswordMismatch)
            }
            const newPasswordHashAndSalt = await hashMyPassword(newPassword)
            await Account.query().update({
                password_salt: newPasswordHashAndSalt[0],
                password_hash: newPasswordHashAndSalt[1],
            }).where("email", email)

            res.status(200).send({
                status: "success",
                message: "Password successfully updated"
            })
    
                
        } catch (error) {
        //add logger 
        res.status(400).send({
            status: "error",
            message: error.message
        })
    }
    
}

/**
 * Uploads
*/
const uploads = async (req, res) => {
      
    const { type } = req.params
    try {
    



        res.status(200).send({
            status: "success",
            message: "Password successfully updated"
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 * get Bank
*/
const getBankLists = async (req, res) => { 
    try {
    
        const getBankLists = await getBanks()

        res.status(200).send({
            status: "success",
            message: "Banks successfully fetched",
            data: getBankLists.data
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 * Add Bank Account
*/
const addCustomerBankAccount = async (req, res) => {
      //userData is passed from the authorization middleware
    const { bankCode, accountNumber, bankName, userData } = req.body 
    const checkIfBvnIsVerified = await CustomerBvnDetails.query().where('account_id', userData.customer)
    
    if (!checkIfBvnIsVerified[0].is_verified) throw new Error(messages.BvnNotVerified)

    try {
        const checkIfBankAccountExists = await CustomerBankAccount.query().where('bank_account_number', accountNumber)
       
        if (!isEmpty(checkIfBankAccountExists)) {
            throw new Error(messages.BankAccountExists)
        }
        //resolve account from paystack
        const resolveCustomerAccountNumber = await resolveAccountNumber(accountNumber, bankCode)
       
        if (resolveCustomerAccountNumber.data.status == false) {
            throw new Error(resolveCustomerAccountNumber.data.message)
        }

        //go ahead to add bank into table
        await CustomerBankAccount.query().insert({
            customer_bank_id: uuidv4(),
            account_id: userData.customer, //customer_id
            bank_name: bankName,
            bank_code: bankCode,
            bank_account_number: accountNumber,
            account_name: resolveCustomerAccountNumber.data.data.account_name, // .data is from axios and the second .data is from paystack object
            bank_id: resolveCustomerAccountNumber.data.data.bank_id // .data is from axios and the second .data is from paystack object
        })
        

        res.status(200).send({
            status: "success",
            message: "Bank Account successfully added"
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 *  Bank Account Enquiry
*/
const BankAccountEnquiry = async (req, res) => {
      
    const { bankCode, accountNumber, bankName,  } = req.body
    try {
        const resolveCustomerAccountNumber = await resolveAccountNumber(accountNumber, bankCode)
       
        if (resolveCustomerAccountNumber.data.status == false) {
            throw new Error(resolveCustomerAccountNumber.data.message)
        }

        res.status(200).send({
            status: "success",
            message: resolveCustomerAccountNumber.data.message,
            data: resolveCustomerAccountNumber.data.data
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 * Get customer Bank Account
*/
const getCustomerBankAccount = async (req, res) => {

    const { userData }  = req.body // passed from the authorization
    try {
        const checkIfBankAccountExists = await CustomerBankAccount.query().where('account_id', userData.customer)

        res.status(200).send({
            status: "success",
            message: "Bank Account fetched",
            data: checkIfBankAccountExists
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
 * Delete Bank Account
*/
const deleteCustomerBankAccount = async (req, res) => {
    const { bankId } = req.params
    try {
 
        await CustomerBankAccount.query().delete().where('bank_id', bankId)

        res.status(200).send({
                status: "success",
                message: "Bank Account deleted successfully"
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}


/**
 * get customer cards
*/
const getCustomerCards = async (req, res) => {
    const { userData } = req.body //picked from authorization middleware
    try {
        //get all cards 
       const customerBankData =  await CustomerCardDatas.query().where('account_id', userData.customer)

        res.status(200).send({
            status: "success",
            message: "Customer cards fetched",
            data: customerBankData
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}

/**
* Delete Bank Account
*/
const deleteCustomerCardDetails = async (req, res) => {
    const { cardId } = req.params
     try {
        
     await CustomerCardDatas.query().delete().where('customer_card_id', cardId)
 
        res.status(200).send({
            status: "success",
            message: "Card successfully deleted"
        })
 
            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
 }
 
}

 const updateCustomerData = async (req, res) => {
    const { userData } = req.body
    try {
    
 
 
 
        res.status(200).send({
            status: "success",
            message: "Details successfully updated"
        })
 
            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
 }
 
}
 


/**
 * add card and fund wallet
*/
const startFundWalletWithNewCard = async (req, res) => {

    const { amount, saveCard, userData } = req.body //userData is picked from authorization middleware
    try {
       //add card
        /*
            2. verify payment
            3. add card to db

        */
       const amountToDebit = amount || 100 
        const startAdCardPayment = await initializePayment(amountToDebit, userData.email)
        if (startAdCardPayment.data.status == false) {
            throw new Error(messages.InitializeTransactionError)
        } 
      
        res.status(200).send({
            status: "success",
            message: "Payment Initialized",
            data: customerBankData
        })

            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
}

}



const dashboard = async (req, res) => {
    const {customer_id} = req.params
    try {
    
 
 
 
        res.status(200).send({
            status: "success",
            message: "Dashboard successfully fetched"
        })
 
            
    } catch (error) {
    //add logger 
    res.status(400).send({
        status: "error",
        message: error.message
    })
 }
 
}
 



module.exports = {
    create,
    verifyOTP,
    resendOTP,
    startForgetPassword,
    verfiyOtpOnForgetPassword,
    completeForgetPassword,
    addBvnToProfile,
    verifyOtpSentToBvn,
    changeCustomersPassword,
    uploads,
    getBankLists,
    addCustomerBankAccount,
    getCustomerBankAccount,
    deleteCustomerBankAccount,
    getCustomerCards,
    deleteCustomerCardDetails,
    dashboard,
    updateCustomerData,
    BankAccountEnquiry,
    startFundWalletWithNewCard
    
}