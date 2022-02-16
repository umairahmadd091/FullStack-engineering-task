import fetch from "node-fetch";
import express from "express";
const app = express();
import async from "async";
import RSVP from "rsvp";
import https from "https";

app.use(
  express.urlencoded({
    extended: true,
  })
);

const parseTitle = (body) => {
  let match = body.match(/<title>([^<]*)<\/title>/);
  if (!match || typeof match[1] !== "string")
    throw new Error("Unable to parse the title tag");
  return match[1];
};


//////////////////////////////////////////

app.get("/task1/i/want/title", (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(404).end("Missing url query parameter");
  const newAdress = address.substring(0, 11);

  const request = https.request(
    newAdress !== "https://www" ? "https://www." + address : address,
    (res) => {
      res.on("data", (d) => {
        let title = parseTitle(d.toString());
        process.stdout.write(
          `<h1>List of Websites:</h1> <ul><li> ${address} - ${title}</li></ul>`
        );
      });
    }
  );
  request.on("error", (error) => {
    console.error(error);
  });

  request.end();

});


// ////////////////////////////////////////////////////

app.get("/task2/i/want/title", (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(404).end("Missing url query parameter");
  const newAdress = address.substring(0, 11);

  async
    .parallel([
      async () => {
        const data = await fetch(
          newAdress !== "https://www" ? "https://www." + address : address
        );
        const textData = await data.text();
        return parseTitle(textData);
      },
    ])
    .then((title) => {
      const query = `<h1>List of Websites:</h1> <ul><li> ${address} - ${title}</li></ul>`;
      res.send(query);
    })
    .catch((e) => res.status(404).send(`<li> ${address} - No Response </li>`));
});

// ////////////////////////////////////////////

app.get("/task3/i/want/title", (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(404).end("Missing url query parameter");

  const newAdress = address.substring(0, 11);

  let promise = new RSVP.Promise((resolve, reject) => {
    fetch(newAdress !== "https://www" ? `https://www.${address}` : address)
      .then((res) => res.text())
      .then((body) => parseTitle(body))
      .then((title) => resolve(title))
      .catch((e) => reject(e));
  });

  promise
    .then((title) => {
      const query = `<h1>List of Websites:</h1> <ul><li> ${address} - ${title}</li></ul>`;

      res.send(query);
    })
    .catch((error) => {
      res.status(404).send(`<li> ${address} - No Response </li>`);
    });
});

app.listen(3000, () => {
  console.log("server running on 3000");
});
