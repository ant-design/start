/* eslint-disable import/no-extraneous-dependencies */
const { Generator } = require('@umijs/utils');
const { join } = require('path');

module.exports = class PageGenerator extends Generator {
  constructor({ cwd, args, props }) {
    super({ cwd, args });
    this.props = props;
    this.cwd = cwd;
  }

  async writing() {
    const dirPath = '../templates/app';
    const { context, filePath } = this.props;
    const filePathMain = join(__dirname, `../.cache/${filePath}`, context.name);
    this.copyDirectory({
      context,
      path: join(__dirname, dirPath),
      target: filePathMain,
    });
  }
};
