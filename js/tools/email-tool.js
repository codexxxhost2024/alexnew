import nodemailer from 'nodemailer';

export class EmailTool {
    getDeclaration() {
        return {
            name: 'sendEmail',
            description: 'Sends an email to a specified recipient.',
            parameters: {
                type: 'object',
                properties: {
                    to: { type: 'string', description: 'The email address of the recipient.' },
                    subject: { type: 'string', description: 'The subject of the email.' },
                    body: { type: 'string', description: 'The body content of the email.' }
                },
                required: ['to', 'subject', 'body']
            }
        };
    }

    async execute(args) {
        const { to, subject, body } = args;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to,
            subject,
            text: body
        };

        await transporter.sendMail(mailOptions);
        return 'Email sent successfully.';
    }
}
