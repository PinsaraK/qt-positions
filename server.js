const express = require("express");
const axios = require("axios");
const url = require("url");
const { response } = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

let finaltoken = "";
let finaldata = {};

app.get("/login", (req, res) => {
  res.redirect(
    `https://login.questrade.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=https://2e6c5e142f8b.ngrok.io/oauth`
  );
});

app.get("/oauth", async (req, res) => {
  const code = req.query.code;
  console.log(req.query);

  await axios
    .post(
      `https://login.questrade.com/oauth2/token?client_id=${process.env.CLIENT_ID}&code=${code}&grant_type=authorization_code&redirect_uri=https://2e6c5e142f8b.ngrok.io/oauth`
    )
    .then((response) => response.data)
    .then((data) => {
      console.log("data: ", data);
      finaldata = data;
      finaltoken = data.access_token;
    })
    .catch((err) => {
      console.error(err);
    });
  res.redirect(
    url.format({
      pathname: "/",
      query: {
        ac_token: finaltoken,
        rf_token: finaldata.refresh_token,
      },
    })
  );
});

app.get("/data", async (req, res) => {
  const response = await axios
    .get(finaldata.api_server + "v1/accounts", {
      headers: { Authorization: "Bearer " + finaltoken },
    })
    .catch((err) => console.log(err));
  res.json(response.data);
});

app.get("/positions/:number", async (req, res) => {
  const number = req.params.number;
  const positions = await axios
    .get(finaldata.api_server + `v1/accounts/${number}/positions`, {
      headers: { Authorization: "Bearer " + finaltoken },
    })
    .catch((err) => console.log(err));

  res.json(positions.data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
