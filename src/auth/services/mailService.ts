import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const sgMail = require('@sendgrid/mail')
import { MailDataRequired } from '@sendgrid/mail';
import path from "path";
const fs = require("fs");

@Injectable()
export class EmailService {
    constructor(private readonly config: ConfigService) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendEmail(data: MailDataRequired): Promise<any> {
        try {
            const response = await sgMail.send(data);
            console.log('Email sent:', response);
            return response;
        } catch (error) {
            console.error('Email not sent:', error);
            throw error;
        }
    }

    async sendOtpMail(data: any): Promise<any> {
        const { email, otp, subject, message } = data;
        const imageFilePath = path.join('./resources/images/aarogya_logo.png');
        // resources/images/aarogya_logo.png
        const imageData = fs.readFileSync(imageFilePath);
        const emailData = {
            to: [email],
            from: 'rambirla02@gmail.com',
            subject: subject,
            html: `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>

<body
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div
        style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 10px; background-color: #ffffff;">
            <img src="cid:company-logo" alt="Company Logo">
        </div>
        <div style="line-height: 1.3; color: #333333;">
            <p><strong>Hello ${email},</strong></p>
            <p>${message}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999999; background-color: #f4f4f4; padding: 10px;">
            <p style="font-size: 2.8em; margin:0">${otp}</p>
        </div>
    </div>

</body>

</html>
            `,
            attachments: [
                {
                    content: imageData.toString('base64'),
                    filename: 'image.png',
                    type: 'image/png',
                    disposition: 'inline',
                    content_id: 'company-logo'
                }
            ]
        };

        try {
            await this.sendEmail(emailData);
            return 'Email sent successfully';
        } catch (error) {
            return 'Failed to send email';
        }
    }

}