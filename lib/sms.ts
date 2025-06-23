// SMS service with proper ES6 imports
import twilio from 'twilio';

// For other providers, you can also use:
// import { SNS } from '@aws-sdk/client-sns' // AWS SNS
// import messagebird from 'messagebird' // MessageBird
// import { Vonage } from '@vonage/server-sdk' // Vonage

interface SMSResult {
    success: boolean;
    error?: string;
    messageId?: string;
}

export async function sendSMS(
    phoneNumber: string,
    message: string
): Promise<SMSResult> {
    try {
        // Twilio implementation
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            const result = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });

            return {
                success: true,
                messageId: result.sid
            };
        }

        // AWS SNS implementation (alternative)
        // if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        //   const sns = new SNS({
        //     region: process.env.AWS_REGION || 'us-east-1',
        //     credentials: {
        //       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     },
        //   })

        //   const result = await sns.publish({
        //     PhoneNumber: phoneNumber,
        //     Message: message,
        //   })

        //   return {
        //     success: true,
        //     messageId: result.MessageId
        //   }
        // }

        // MessageBird implementation (alternative)
        // if (process.env.MESSAGEBIRD_ACCESS_KEY) {
        //   const messagebirdClient = messagebird(process.env.MESSAGEBIRD_ACCESS_KEY)
        //
        //   const result = await new Promise((resolve, reject) => {
        //     messagebirdClient.messages.create({
        //       originator: process.env.MESSAGEBIRD_ORIGINATOR || 'YourApp',
        //       recipients: [phoneNumber],
        //       body: message
        //     }, (err: any, response: any) => {
        //       if (err) reject(err)
        //       else resolve(response)
        //     })
        //   })

        //   return { success: true, messageId: (result as any).id }
        // }

        // Vonage implementation (alternative)
        // if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
        //   const vonage = new Vonage({
        //     apiKey: process.env.VONAGE_API_KEY,
        //     apiSecret: process.env.VONAGE_API_SECRET,
        //   })

        //   const result = await vonage.sms.send({
        //     to: phoneNumber,
        //     from: process.env.VONAGE_FROM_NUMBER || 'YourApp',
        //     text: message,
        //   })

        //   return { success: true, messageId: result.messages[0]['message-id'] }
        // }

        // Fallback for development/testing
        console.log(`SMS to ${phoneNumber}: ${message}`);
        return { success: true, messageId: 'dev-' + Date.now() };
    } catch (error) {
        console.error('SMS sending failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send SMS'
        };
    }
}

// Helper function to validate phone number format
export function isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic E.164 format validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
}

// Helper function to format phone number for display
export function formatPhoneForDisplay(phoneNumber: string): string {
    // Remove + and format for display
    const cleaned = phoneNumber.replace(/^\+/, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        // US number format
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phoneNumber;
}
