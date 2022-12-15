const elastic = require("elasticsearch");
const elasticClient = elastic.Client({
  host: "elasticsearch:9200",
});

exports.searchVideo = async (req, res) => {
  if (req.query.date) {
    console.log("no date");
    var gte = "";
    var lte = "";

    if(req.query.date == "5min"){
      gte = "now-5m";
      lte = "now";
    }
    if (req.query.date == "today") {
      gte = "now/d";
      lte = "now/d";
    }
    if (req.query.date == "30min") {
      gte = "now-30m";
      lte = "now";
    }
    if (req.query.date == "hour") {
      gte = "now-1h";
      lte = "now";
    }
    if (req.query.date == "week") {
      gte = "now-1w";
      lte = "now";
    }
    if (req.query.date == "month") {
      gte = "now-1M";
      lte = "now";
    }
    if (req.query.date == "year") {
      gte = "now-1y";
      lte = "now";
    }

    elasticClient
      .search({
        index: "videos",
        // filterPath: ['hits.hits._source'],
        body: {
          query: {
            bool: {
              minimum_should_match: 2,
              should: [
                {
                  bool: {
                    minimum_should_match: 2,
                    should: [
                      {
                        range: {
                          "data.created_at": {
                            gte: gte,
                          }
                        }
                      },
                      {
                        range: {
                          "data.created_at": {
                            lte: lte,
                          }
                        }
                      }
                    ],
                  },
                },
                {
                  bool: {
                    minimum_should_match: 1,
                    should: [

                      {
                        simple_query_string: {
                          fields: ["data.name"],
                          query: `${req.query.video}~`,
                        }
                      },

                      {
                        simple_query_string: {
                          fields: ["data.user.username"],
                          query: `${req.query.video}~`,
                        }
                      },
                    ],
                  },
                },
              ],
            },
          },
        },

      })
      .then((resp) => {
        return res.status(200).json({
          videos: resp.hits.hits,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          msg: "Error",
          err,
        });
      });
  } else if (req.query.video) {
    console.log("no video");
    elasticClient
      .search({
        index: "videos",
        body: {
          query: {
            bool: {
              minimum_should_match: 1,
              should: [
                {
                  simple_query_string: {
                    fields: ["data.name"],
                    query: `${req.query.video}~`,
                  }
                },
                {
                  simple_query_string: {
                    fields: ["data.user.username"],
                    query: `${req.query.video}~`,
                  }
                },
              ],
            },
          },
        },
      })

      .then((resp) => {
        return res.status(200).json({
          videos: resp.hits.hits,

        });

      })
      .catch((err) => {

        console.log(err);
        return res.status(500).json({
          msg: "Error",
          err,
        });
      })
  } else {

    elasticClient
      .search({
        // filterPath: ['hits.hits._source'],
        index: "videos",
        body: {
          query: {
            match_all: {}
          }
        },
      })
      .then((resp) => {
        return res.status(200).json({
          videos: resp.hits.hits,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          msg: "Error",
          err,
        });
      });
  }

};
