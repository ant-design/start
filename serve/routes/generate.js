/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const yParser = require('yargs-parser');
const Generator = require('../tools/AppGenerator');

const router = express.Router();

router.post('/', async function (req, res) {
  try {
    const { name, keywords = [], description, authors = [] } = req.body;
    // "xiaohuoni <448627663@qq.com> (https://github.com/xiaohuoni)"
    const authorsStr = authors.map((author) => `${author.name} <${author.email}> (${author.url})`);
    const props = {
      filePath: new Date().getTime(),
      context: {
        name,
        description,
        keywords: JSON.stringify(keywords),
        authors: JSON.stringify(authorsStr),
      },
    };
    const args = yParser(process.argv.slice(2));

    const generator = new Generator({
      cwd: process.cwd(),
      props,
      args,
    });
    await generator.run();
    res.json({ filePath: `${props.filePath}/${name}` });
  } catch (error) {
    res.json({ code: 500, message: '服务端出错了！' });
  }
});

module.exports = router;
