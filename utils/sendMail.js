const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

dotenv.config();

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  GOOGLE_EMAIL,
  WEBSITE,
  // GOOGLE_PASSWORD
} = process.env;

const oAuth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: MAILING_SERVICE_REFRESH_TOKEN });

const sendMail = async (to, url, name, text) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: "entagk.pomodoro@gmail.com",
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: GOOGLE_EMAIL,
      to: to,
      subject: `${text} at ${WEBSITE}`,
      html:
        `<div class='container' style="max-width: 1200px;padding-inline: 15px;margin-inline: auto;">
          <table style="font-family: sans-serif; text-align: center;">
            <tbody>
              <tr>
                <td>
                  <h2 style="text-align: center;font-family: sans-serif;">Welcome to the <span style="color: rgb(255, 0, 47);">${WEBSITE}</span>.</h2>        
                </td>
              </tr>
              <tr>
                <td>
                  <h2>
                    Reset your password for your account.
                  </h2>
                </td>
              </tr>
              <tr>
                <td style="text-align: left; font-weight: 600;">
                  <p>Hi ${name},</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Click on the red button below to make a new password for your account.
                  </p>
                </td>
              </tr>
              <tr>
                <td >
                <a href=${url} target="_blank" style="border-radius: 5px; box-shadow: 0px 0px 10px #7a7a7a7d; background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block; color: rgb(255, 0, 47);">Set a new password</a>
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
                </td>
              </tr>
              <tr>
                <td>
                <a href=${url} target="_blank">${url}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>`
    }

    const result = await smtpTransport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = sendMail;