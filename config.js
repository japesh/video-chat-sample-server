// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {
    // Twilio Account SID - found on your dashboard
    accountSid: "AC2f7e4b21cfd0166da298a927198f84e5",

    // Twilio Auth Token - found on your dashboard
    authToken: "353f7961a425f33ad7990438c6c05c93",

    apiKeySid:"SK842b462797f8fb2d0025f23b56451ab6",

    apiKeySecret:"myMGdOYIkDLgqaifMC0TqeYGiEapYpfl",
    // A Twilio number that you have purchased through the twilio.com web
    // interface or API
    // twilioNumber: process.env.TWILIO_NUMBER,

    // The port your web application will run on
    port: process.env.PORT || 3000,
    // Connection URL
    mongoUrl :'mongodb://localhost:27017',

    dbName :'TwillioSample',
};
