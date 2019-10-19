exports.creds = process.env.KELNER_CRED
  ? JSON.parse(process.env.KELNER_CRED)
  : {
    url: "http://localhost:3000",
    secret: "secret"
  }
