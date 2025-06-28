import * as nodemailer from 'nodemailer';
import { config } from '../../../common/config/config';
import { ApplicationStatusEnum } from 'src/common/enums/application-status';
 
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: false,
            auth: {
                user: config.smtpUser,
                pass: config.smtpPassword,
            },
        });
    }

    async sendMail(email: string, code: string) {
        try {
            await this.transporter.sendMail({
                from: config.smtpUser,  // Sender's email
                to: email,              // Recipient's email
                subject: `Reset your password`,
                html: `
                <h3>Verify your email</h3>
                <p>Use the following verification code:</p>
                 <h2>${code}</h2>
               `,
            });

            console.log('Email sent successfully');
        }

        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        }
    }

   


}
