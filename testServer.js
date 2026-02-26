const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const logoUrl = "https://shops.kiko.live/kiko-logo-white.png";
const filePath = path.resolve(__dirname, "./build", "index.html");
const { get } = require("lodash");
app.use(
  express.static(path.resolve(__dirname, "./build"), {
    index: false,
  })
);

app.get("/", function (request, response) {
  try {
    console.log("11111111=========>");
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, "ONDC Seller Registration | Sell on ONDC");
      data = data.replace(/\$OG_TWITTER_TITLE/g, "ONDC Seller Registration | Sell on ONDC");
      data = data.replace(/\$OG_IMAGE/g, logoUrl);
      var result = data.replace(
        /\$OG_DESCRIPTION/g,
        "Get 25+ ONDC orders daily within 24 hours. Best ONDC solution for Retailers. Easy 2 minute registration. Best Customer Support. Free Ecommerce Website."
      );
      response.send(result);
    });
  } catch (error) {
    console.log("error", error);
    return response.sendFile(filePath);
  }
});

app.get("*", function (request, response) {
  try {
    console.log("222222222222=========>");
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, "ONDC Seller Registration | Sell on ONDC");
      data = data.replace(/\$OG_TWITTER_TITLE/g, "ONDC Seller Registration | Sell on ONDC");
      data = data.replace(/\$OG_IMAGE/g, logoUrl);
      var result = data.replace(
        /\$OG_DESCRIPTION/g,
        "Get 25+ ONDC orders daily within 24 hours. Best ONDC solution for Retailers. Easy 2 minute registration. Best Customer Support. Free Ecommerce Website."
      );
      response.send(result);
    });
  } catch (error) {
    console.log("error", error);
    return response.sendFile(filePath);
  }
});

app.get("/webinar-registration-lead2", function (request, response) {
  try {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, "Free Restaurant Registration | Sell on Own Website");
      data = data.replace(/\$OG_TWITTER_TITLE/g, "Free Restaurant Registration | Sell on Own Website");
      data = data.replace(/\$OG_IMAGE/g, logoUrl);
      var result = data.replace(
        /\$OG_DESCRIPTION/g,
        "Start getting orders from website within 24 hours. Best solution for Restaurants. Easy 2 minute registration. Best Customer Support. Free Ecommerce Website."
      );
      response.send(result);
    });
  } catch (error) {
    console.log("error", error);
    return response.sendFile(filePath);
  }
});

// app.get('/:param', function (request, response) {
//   try {
//     const param = get(request, 'params.param', '')
//     console.log('Seller microwebsite params==>', param)
//     axios.get(`https://api.Kiko.live/api/v1/accounts/get-user-by-slug/${param}`)
//       .then(function ({ data }) {
//         const storeDetails = get(data, 'user', {});
//         console.log('storeDetails==>', storeDetails)
//         const storeLogo = get(storeDetails, 'storeLogo', {}) !== '' ? get(storeDetails, 'storeLogo', {}) : logoUrl
//         const filePath = path.resolve(__dirname, './build', 'index.html')
//         const description = `Shop with ${get(storeDetails, 'storeName', '')} today! Browse through products and find everything you need in one convenient place.`
//         const title = get(storeDetails, 'storeName', '') !== '' ? get(storeDetails, 'storeName', '') : 'Seller Micro website';
//         fs.readFile(filePath, 'utf8', function (err, data) {
//           if (err) {
//             console.log('error in testserver file==>', err)
//             return response.sendFile(filePath)
//           }
//           data = data.replace(/\$OG_TITLE/g, get(storeDetails, 'storeName', ''))
//           data = data.replace(/\$OG_TWITTER_TITLE/g, get(storeDetails, 'storeName', ''))
//           data = data.replace(/\$OG_DESCRIPTION/g, description)
//           data = data.replace('<title>Seller Micro website</title>', `<title>${title}</title>`);
//           var result = data.replace(/\$OG_IMAGE/g, storeLogo)
//           return response.send(result)
//         })
//       })
//       .catch(e => {
//         console.log('axios catch', e)
//         return response.sendFile(filePath)
//       })
//   } catch (error) {
//     console.log('error', error)
//     return response.sendFile(filePath)
//   }
// })



app.listen(port, () => console.log(`Listening on port ${port}`));