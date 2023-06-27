const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/nom-station", (req, res) => {
  res.json({ message: "Wow mon nom cest bob!" });
});

// http://localhost:3001/climate-day?stationID=118&Year=2011&Month=01&Day=01
app.get("/climate-day", (req, res) => {
  var axios = require("axios");

  const params = {
    format: "csv",
    stationID: req.query.stationID,
    Year: req.query.Year,
    Month: req.query.Month,
    Day: req.query.Day,
    timeframe: req.query.timeframe ? req.query.timeframe : "1",
  };

  var config = {
    method: "get",
    url: "https://climate.weather.gc.ca/climate_data/bulk_data_e.html",
    headers: {},
    params: params,
  };
});

app.get("/prevision", (req, res) => {
  var axios = require("axios");
  var airportCode = req.query.airportCode;
  var stationId = req.query.stationId;

  var station_mapping = require("./mapping/station_mapping.json");

  for (var station_airport_code in station_mapping) {
    if (station_airport_code == airportCode) {
      var stations_ids = station_mapping[station_airport_code].station_ids;
      for (var station_id in stations_ids) {
        if (stations_ids[station_id] == stationId)
          var rss_feed = station_mapping[station_airport_code].rss_feed;
      }
    }
  }

  if (rss_feed) {
    var config = {
      method: "get",
      url: rss_feed,
      headers: {},
      params: {},
    };
  }
});

app.get("/allPrevision", (req, res) => {
  var axios = require("axios");
  var stationIds = req.query.stationIds;

  var station_mapping = require("./mapping/station_mapping.json");

  let finalResponse = [];
  let requests = [];

  stationIds = stationIds.split(",");

  stationIds.forEach((stationId) => {
    for (var station_airport_code in station_mapping) {
      var stations_ids = station_mapping[station_airport_code].station_ids;
      for (var station_id in stations_ids) {
        if (stations_ids[station_id] == stationId)
          var rss_feed = station_mapping[station_airport_code].rss_feed;
      }
    }

    if (rss_feed) {
      requests.push(rss_feed);
    }
  });
});
