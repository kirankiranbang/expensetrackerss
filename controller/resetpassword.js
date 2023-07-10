const uuid = require('uuid');
const sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Forgotpassword = require('../models/forgotpassword');

const dotenv = require('dotenv');
dotenv.config();

const forgotpassword = async (req, res, next) => {

    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        const id = uuid.v4();
        console.log(user);
        console.log(email);

        user.createForgotpassword({ id , active: true })
            .catch(err => { throw new Error(err) })

            const client = sib.ApiClient.instance   
            const apiKey = client.authentications['api-key']
            console.log( 'xsmtpsib-cf8c64d192584f881521ce86cf555849f9c4ab6c44564a151651fc97e4ed4e75-7Zd2BSb3CTNLtsaX')

            apiKey.apiKey = process.env.API_KEY       
            const tranEmailApi = new sib.TransactionalEmailsApi(); // we can send emails
            
            const sender = {   // The sender's email has to be the email account that you have used for the SendinBlue account
                email: 'kiranab433@gmail.com',
                name: 'kiran B',
            }        
                
            const receivers = [
                {
                    email: email,
                },
            ]                
            
            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Password ',
                 textContent: `Follow the link and reset the password `,
                htmlContent: `<h1>click on the link below to reset the password</h1><br>
                    <a href="http://localhost:4000/password/resetpassword/${id}">Reset your Password</a>`,
                    params: {
                        role: 'Frontend',
                    },
                }).then( (response) => {
                    //console.log('after transaction');
                    return res.status(202).json({sucess: true, message: "password mail sent Successful"});
                }).catch(err => console.log(err))   
     }catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }
}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label><br>
                                        <input name="newpassword" type="password" required></input><br>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                 console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}


