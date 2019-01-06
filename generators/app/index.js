"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

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
  }

  // install() {
  //   this.installDependencies();
  // }
};
