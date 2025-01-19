import { Logger } from '../utils/logger.js';
import nodemailer from 'nodemailer';

export class EmailSenderTool {
    getDeclaration() {
        return {
            name: 'emailSender',
            description: 'Sends an email to one or more recipients.',
            parameters: {
                type: 'object',
                properties: {
                    recipients: {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'email'
                        },
                        description: 'An array of email addresses to send the email to.'
                    },
                    subject: {
                        type: 'string',
                        description: 'The subject line of the email.'
                    },
                    body: {
                        type: 'string',
                        description: 'The content of the email.'
                    },
                    attachment: {
                        type: 'string',
                        description: 'File to be attached, must be a URL or a base64 encoded string.'
                    }
                },
                required: [
                    'recipients',
                    'subject',
                    'body'
                ]
            }
        };
    }

    async execute(args) {
        try {
            Logger.info('Executing emailSender', args);
            const { recipients, subject, body, attachment } = args;

            // Create a transporter object using nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use Gmail as the email service
                auth: {
                    user: process.env.EMAIL_USER || 'codexxxhost@gmail.com', // Replace with your email or use environment variables
                    pass: process.env.EMAIL_PASSWORD || 'MasterCodexxx120221!@#' // Replace with your email password or use environment variables
                }
            });

            // Define the email options
            const mailOptions = {
                from: process.env.EMAIL_USER || 'codexxxhost@gmail.com', // Replace with your email or use environment variables
                to: recipients.join(', '), // Convert the array of recipients to a comma-separated string
                subject: subject,
                text: body,
                attachments: attachment ? [{
                    filename: 'attachment',
                    path: attachment
                }] : []
            };

            // Send the email
            await transporter.sendMail(mailOptions);

            // Log and return the result
            const result = `Email sent to ${recipients.join(', ')} with subject: ${subject} and body: ${body}. Attachment: ${attachment || 'none'}`;
            Logger.info(result);
            return result;
        } catch (error) {
            Logger.error('emailSender failed', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}