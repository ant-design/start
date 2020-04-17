/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const archiver = require('archiver');
const { join } = require('path');

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  if (!req.query.filePath) {
    res.status(500).send({ error: '文件名错误啦' });
  }
  const { filePath } = req.query;
  const pathsName = filePath.split('/');
  const appName = pathsName[pathsName.length - 1];
  const filePathMain = join(__dirname, `../.cache/${filePath}`);

  const archive = archiver('zip');
  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });

  // on stream closed we can end the request
  archive.on('end', function () {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  // set the archive name
  res.attachment(`${appName}.zip`);

  // this is the streaming magic
  archive.pipe(res);

  const directories = [filePathMain];

  for (const i in directories) {
    archive.directory(directories[i], directories[i].replace(filePathMain, `${appName}`));
  }

  archive.finalize();
});

module.exports = router;
