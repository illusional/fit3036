import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import calculate from '../src/processing/calculation';

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));


app.post("/api/calculate", function(req, res) {
  // const { left, top, right, bottom } = req.params;
  const bbox = req.query.bbox.split(",");
  const [left, bottom, right, top] = bbox;

  calculate(left, top, right, bottom)
    .then(result => {
      res.send(result);
    }).catch(er => {
      console.log(er);
      res.send({success: false, message: er.message });
    });
});

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Started on port:${port}`);
    // open(`http://localhost:${port}`);
  }
});
