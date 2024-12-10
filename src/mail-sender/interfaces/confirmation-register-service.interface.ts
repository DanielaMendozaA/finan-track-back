export interface IConfirmationRegisterService {
    sendVerificationEmail(email: string, name: string, verificationUrl: string): Promise<void>;
}