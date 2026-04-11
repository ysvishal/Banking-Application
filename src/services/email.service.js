require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Platinum Banking" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegisterationMail(userEmail, name) {
  const subject = "Welcome to Platinum Bank";
  const text = `Hello ${name}, thank you for registering at Platinum Bank, we are glad to serve you with quality and secure banking services`;
  const html = `<p>Hello ${name},</p> <p>thank you for registering at Platinum Bank, we are glad to serve you with our quality and secure banking services</p>`;
  sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful";
  const text = `Hello ${name}, your transaction of ${amount} to account ${toAccount} was successful`;
  const html = `<p>Hello ${name},</p> <p>Your transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> was successful</p>`;
  sendEmail(userEmail, subject, text, html);
}

async function sendReceivedFundsEmail(userEmail, name, amount, fromAccount) {
  const subject = `Amount Credited`;
  const text = `Hello ${name}, you have received $${amount} from account ${fromAccount}`;
  const html = `<p>Hello ${name},</p> <p>You have received <strong>$${amount}</strong> from account <strong>${fromAccount}</strong></p>`;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegisterationMail,
  sendTransactionEmail,
  sendReceivedFundsEmail
};
