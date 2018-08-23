exports.creds = process.env.KELNER_CRED
  ? JSON.parse(process.env.KELNER_CRED)
  : {
    url: "http://localhost:8080",
    secret: "secret"
  }
