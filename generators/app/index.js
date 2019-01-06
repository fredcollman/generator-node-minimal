"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

const dotfiles = [
  "babelrc",
  "eslintrc.js",
  "flowconfig",
  "gitignore",
  "npmignore",
  "prettierrc.js"
];

module.exports = class extends Generator {
  async prompting() {
    this.log("Let's set up a new Node.js package!");

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your package name",
        default: this.appname.replace(/\s+/g, "-")
      },
      {
        type: "input",
        name: "description",
        message: "Describe your package",
        default: ""
      }
    ];
    this.props = await this.prompt(prompts);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      this.props
    );
    dotfiles.forEach(file =>
      this.fs.copy(this.templatePath(file), this.destinationPath(`.${file}`))
    );
    this.fs.copyTpl(
      this.templatePath("src/_utils.js"),
      this.destinationPath("src/_utils.js"),
      { appname: this.appname }
    );
    this.fs.copy(
      this.templatePath("src/index.js"),
      this.destinationPath("src/index.js")
    );
    this.fs.copy(
      this.templatePath("bin/main.js"),
      this.destinationPath("bin/main.js")
    );
  }

  install() {
    this.yarnInstall();
  }
};
