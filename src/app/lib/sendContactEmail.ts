"use server"
import z from "zod"
import nodemailer from "nodemailer"

export const handleEmailFormSubmit = async (formData: FormData) => {
  const gmailEmail = process.env.EMAIL
  const gmailPassword = process.env.PASSWORD

  const validated = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    body: z.string()
  }).parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    body: formData.get("body"),
  })

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });

  const mailOptions = {
    from: gmailEmail,
    to: "scottdkey+contact@gmail.com",
    subject: `homepage contact from ${validated.firstName} ${validated.lastName}`,
    text: `contact email: ${validated.email} -- message: ${validated.body}`,
    html: `<p>Name: ${validated.firstName} ${validated.lastName}</p><p>From: ${validated.email}</p><p>Body: ${validated.body}</p>`

  }

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Error sending email`, {
          ...mailOptions,
          ...err
        })
        reject(err)
      } else {
        console.log('email sent', {
          ...mailOptions,
          info: info.messageId
        })
        resolve(info)
      }
    });
  });



  return validated
};