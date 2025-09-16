export const runtime = 'nodejs'

import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST ?? 'smtp-relay.brevo.com',
  port: Number(process.env.BREVO_SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER!,
    pass: process.env.BREVO_SMTP_PASS!,
  },
})

export async function sendVerificationEmail(to: string, link: string) {
  const html = `
    <div style="font-family:Inter,system-ui">
      <h2>Sri Datta Print Center</h2>
      <p>Thanks for signing up. Please verify your email:</p>
      <p><a href="${link}" style="background:#111827;color:#fff;padding:10px 16px;border-radius:12px;text-decoration:none">Verify my email</a></p>
      <p>If the button doesn’t work, paste this in your browser:<br>${link}</p>
    </div>`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? 'no-reply@sridattaprintcenter.com',
    to,
    subject: 'Verify your account',
    html,
  })
}


