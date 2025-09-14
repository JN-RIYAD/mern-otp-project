const nodemailer = require("nodemailer");

async function sendTestMail() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"MERN OTP App" <no-reply@example.com>',
    to: "test@example.com",
    subject: "Test OTP",
    text: "Your OTP is 123456",
  });

  console.log("✅ Message sent: %s", info.messageId);
  console.log("👀 Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

sendTestMail().catch(console.error);
