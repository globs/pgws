const pg        = require('pg');
const express   = require('express');
const app       = express();
var json2csv = require('json2csv');
var fields = [ 'date', 'open', 'high', 'low', 'close'];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const config = {
    user: 'postgres',
    database: 'cryptolina',
    password: 'B6cw[)nv',
    port: 5432,
	host : '35.197.241.20'
};

// pool takes the object above as parameter
const pool = new pg.Pool(config);

app.get('/', (req, res, next) => {
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Peut pas se connecter a la DB" + err);
       }
       client.query("select TO_CHAR(CAST(TIMESTAMP 'epoch' + cast(a.date as integer) * INTERVAL '1 second' as DATE), 'YYYY-MM-DD') date, open, high, low, close  from crypto.ohlc  a where a.tck_from = 'TRX'", function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
//            res.status(200).send(result.rows);
		console.log(json2csv({ data: result.rows, fields: fields , del: '\t', newLine :'\r\n'}));
//            res.status(200).send(json2csv({ data: result.rows, fields: fields , del: '\t', newLine :'\r\n'}));		
  res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(json2csv({ data: result.rows, fields: fields , del: '\t', newLine :'\r\n'}));
       })
   })
});

app.listen(3001, function () {
    console.log('Server is running.. on Port 3001');
});
