var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gaudi3490@gmail.com',
    pass: process.env.PASSWORD
  }
});

// var mailOptions = {
//   from: 'gaudi3490@gmail.com',
//   to: 'gauravaudichya786@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

exports.sendEmail=async(email, subject, body)=> {
    var mailOptions = {
      from: 'gaudi3490@gmail.com',
      to: email,
      subject: subject,
      text: body
    };
    
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
}


  