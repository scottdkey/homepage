
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email`, mailOptions)
    } else {
      console.log('email sent', {
        ...mailOptions,
        info: info.messageId
      })
    }
  })


  console.log(validated)

  return validated
};