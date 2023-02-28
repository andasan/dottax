const SibApiV3Sdk = require('sib-api-v3-typescript');

import { config } from "@/lib/config";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
export const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = config.sibApiKey;

export default apiInstance