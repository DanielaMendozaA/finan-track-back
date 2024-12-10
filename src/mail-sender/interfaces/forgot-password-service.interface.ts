export interface IForgotPasswordService {
    sendForgotPasswordEmail(email: string, name: string, verificationUrl: string): Promise<void>;
}