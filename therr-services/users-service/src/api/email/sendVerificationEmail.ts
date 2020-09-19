import sendEmail from './sendEmail';

export interface ISendVerificationEmailConfig {
    charset?: string;
    subject: string;
    toAddresses: string[];
}

export interface ITemplateParams {
    name: string;
    userName: string;
    verificationCode: string;
}

export default (emailParams: ISendVerificationEmailConfig, templateParams: ITemplateParams) => {
    const html = `
        <h1>Therr App: User Account Verification</h1>
        <h2>Welcome, ${templateParams.name}!</h2>
        <h3>Username: ${templateParams.userName}</h3>
        <p>Click the following link to verify your account.</p>
        <p><a href="https://www.therr.app/verify-account?code=${templateParams.verificationCode}">https://www.therr.app/verify-account</a></p>
        <p></p>
        <p>If you are unable to click the link, copy paste the following URL in the browser:</p>
        <p>https://www.therr.app/verify-account?code=${templateParams.verificationCode}</p>
    `;

    return sendEmail({
        ...emailParams,
        html,
    });
};
