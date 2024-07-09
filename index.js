const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.post('/referral', async (req, res) => {
  const { name, email, message } = req.body;

  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
  
    const referral = await prisma.referral.create({
      data: { name, email, message }
    });

    await sendEmailNotification(name, email, message);

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function sendEmailNotification(name, email, message) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com',
    subject: 'New Referral',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  await transporter.sendMail(mailOptions);
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
