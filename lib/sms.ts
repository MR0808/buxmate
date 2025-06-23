'use server';

import * as ClickSend from 'clicksend';

export async function sendSMS(
    phoneNumber: string,
    message: string,
    from?: string
) {
    try {
        if (process.env.CLICKSEND_USERNAME && process.env.CLICKSEND_API_KEY) {
            // Create SMS message
            const smsMessage = new ClickSend.SmsMessage();
            smsMessage.to = phoneNumber;
            smsMessage.body = message;
            smsMessage.from = from || 'Buxmate';
            smsMessage.source = 'nextjs-app';

            const smsApi = new ClickSend.SMSApi(
                process.env.CLICKSEND_USERNAME,
                process.env.CLICKSEND_API_KEY
            );

            // Create SMS collection
            const smsCollection = new ClickSend.SmsMessageCollection();
            smsCollection.messages = [smsMessage];

            // Send SMS using Promise wrapper
            const response = await new Promise((resolve, reject) => {
                smsApi.smsSendPost(
                    smsCollection,
                    (error: any, data: any, response: any) => {
                        if (error) {
                            console.error('ClickSend API Error:', error);
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    }
                );
            });

            return {
                success: true,
                data: response,
                message: 'SMS sent successfully!'
            };
        }
    } catch (error) {
        console.error('SMS Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send SMS'
        };
    }
}

export async function sendBulkSMS(
    messages: Array<{ to: string; body: string; from?: string }>
) {
    try {
        // Initialize the API client
        const defaultClient = ClickSend.ApiClient.instance;
        const basicAuth = defaultClient.authentications['BasicAuth'];
        basicAuth.username = process.env.CLICKSEND_USERNAME!;
        basicAuth.password = process.env.CLICKSEND_API_KEY!;

        const smsApi = new ClickSend.SMSApi();

        // Create SMS messages
        const smsMessages = messages.map((msg) => {
            const smsMessage = new ClickSend.SmsMessage();
            smsMessage.to = msg.to;
            smsMessage.body = msg.body;
            smsMessage.from = msg.from || 'ClickSend';
            smsMessage.source = 'nextjs-app';
            return smsMessage;
        });

        const smsCollection = new ClickSend.SmsMessageCollection();
        smsCollection.messages = smsMessages;

        const response = await new Promise((resolve, reject) => {
            smsApi.smsSendPost(
                smsCollection,
                (error: any, data: any, response: any) => {
                    if (error) {
                        console.error('ClickSend Bulk SMS Error:', error);
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        return {
            success: true,
            data: response,
            message: `Bulk SMS sent successfully! (${messages.length} messages)`
        };
    } catch (error) {
        console.error('Bulk SMS Error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to send bulk SMS'
        };
    }
}

export async function getAccountBalance() {
    try {
        // Initialize the API client
        const defaultClient = ClickSend.ApiClient.instance;
        const basicAuth = defaultClient.authentications['BasicAuth'];
        basicAuth.username = process.env.CLICKSEND_USERNAME!;
        basicAuth.password = process.env.CLICKSEND_API_KEY!;

        const accountApi = new ClickSend.AccountApi();

        const response = await new Promise((resolve, reject) => {
            accountApi.accountGet((error: any, data: any, response: any) => {
                if (error) {
                    console.error('ClickSend Account Error:', error);
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.error('Account Balance Error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to get account balance'
        };
    }
}

export async function getSMSHistory(page = 1, limit = 15) {
    try {
        // Initialize the API client
        const defaultClient = ClickSend.ApiClient.instance;
        const basicAuth = defaultClient.authentications['BasicAuth'];
        basicAuth.username = process.env.CLICKSEND_USERNAME!;
        basicAuth.password = process.env.CLICKSEND_API_KEY!;

        const smsApi = new ClickSend.SMSApi();

        const response = await new Promise((resolve, reject) => {
            smsApi.smsHistoryGet(
                page,
                limit,
                (error: any, data: any, response: any) => {
                    if (error) {
                        console.error('ClickSend History Error:', error);
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.error('SMS History Error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to get SMS history'
        };
    }
}
