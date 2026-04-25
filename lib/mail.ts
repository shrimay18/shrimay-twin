import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNotificationToShrimay = async (question: string, studentEmail: string) => {
  await resend.emails.send({
    from: 'Twin <onboarding@resend.dev>', // You can change this later
    to: process.env.ADMIN_EMAIL!,
    subject: '🚨 New Question for the Real Shrimay!',
    html: `
      <p>Someone has a doubt your twin couldn't answer:</p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
        "${question}"
      </blockquote>
      <p>Asked by: <strong>${studentEmail}</strong></p>
      <p>Login to your admin panel to answer!</p>
    `
  });
};