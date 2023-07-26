require('dotenv').config()
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid') 
const { isEmpty } = require('../_helpers/helpers')
const bcrypt = require('bcrypt')
const messages = require('../constants/messages')
const { Account } = require('../models/Account')


/**

 * logs the customer into the app, 
 * 
 */
const login = async (req, res) => {

    let payload
    const { email, password } = req.body
    try {
        // check if email exists
        const checkIfAccountExists = await Account.query().where('email', email)
       
        if (isEmpty(checkIfAccountExists)) {
            //log that the email does not exist
            throw new Error("Invalid Email or Password")
        }

        payload = checkIfAccountExists[0]

        const compareCustomerPassword = await bcrypt.compare(password, payload.password_hash)

        if (compareCustomerPassword === false) {
            throw new Error("Invalid Email or Password")
        }

        const dataToAddInMyPayload = {
            email: payload.email,
            username: payload.username,
            customer: payload.id,
            _id: uuidv4()
            }
            jwt.sign(dataToAddInMyPayload, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRES_TIME },
            (err, token) => {
                if (err) {
                    //log the exact error in a logger
                    throw new Error("Something went wrong")
                }
                 
                res.setHeader('authorization', token)
                res.status(200).send({
                    status: "success",
                    message: messages.LoginSuccessful
                })
                   
                }
        

           )


    }
    catch (error) {
        //log the exact eerror in a logger
        console.log("Cant login now, try again later")
        res.status(400).send({
            status: "error",
            message: error.message ??  "Something went wrong"
        })
    }

}




module.exports = {
    login
}