export interface AuditLogDetails {
    currentEmail?: string;
    newEmail?: string;
    oldEmail?: string;
    otpSent?: boolean;
    remainingAttempts?: number;
    verificationMethod?: string;
    [key: string]: any;
}
