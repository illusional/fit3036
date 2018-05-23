/* eslint-disable no-console */

import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import { calculate, getNodes } from '../src/processing/processing';

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
  const roadOption = req.query.roadOption;

  calculate(left, top, right, bottom, roadOption)
    .then(result => {
      res.send({success: true, result });
    }).catch(er => {
      console.log(er);
      res.send({success: false, message: er.message });
    });
});

app.post("/api/coordinates", function(req, res) {
  // const { left, top, right, bottom } = req.params;
  const bbox = req.query.bbox.split(",");
  const [left, bottom, right, top] = bbox;
  const roadOption = req.query.roadOption;

  getNodes(left, top, right, bottom, roadOption)
    .then(result => {
      res.send({success: true, result });
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
    console.log(`Started on port: ${port}`);
  }
});
