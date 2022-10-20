const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

dotenv.config();

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  GOOGLE_ACCONT,
  WEBSITE,
  GOOGLE_PASSWORD
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  GOOGLE_ACCONT,
  OAUTH_PLAYGROUND
);

oauth2Client.setCredentials({
  refresh_token: MAILING_SERVICE_REFRESH_TOKEN
});

const sendMail = async (to, url, name, text) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GOOGLE_ACCONT,
        pass: GOOGLE_PASSWORD,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN
      }
    });

    const mailOptions = {
      from: `Nafees Website ${GOOGLE_ACCONT}`,
      to: to,
      subject: `${text} at ${WEBSITE}`,
      html:
        `
      <div style="max-width: 700px; margin:auto; border: 2px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ${WEBSITE}.</h2>
        <h3>Hi ${name},</h3>
        <p>
            Congratulations! You're almost set to start using ${WEBSITE}.</p>
            Just click the button below to ${text.toLowerCase()}.
        </p>
        
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${text}</a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${url}</div>
      </div>
      `
    }
    
    const result = await smtpTransport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = sendMail;