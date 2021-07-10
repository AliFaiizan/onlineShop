const MongoClient = require("mongodb").MongoClient;

let _db;

const MongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://AliShop:(Dev@787)@cluster0.vmqff.mongodb.net/Shop?retryWrites=true&w=majority",
    { useNewUrlParser: true,useUnifiedTopology: true }
  )
    .then((client) => {
      if (client) _db = client.db();
      else throw "no client";
      
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

const GetDb = () => {
  if (_db) return _db;
  throw "no database found";
};
module.exports.GetDb = GetDb;
module.exports.MongoConnect = MongoConnect;
