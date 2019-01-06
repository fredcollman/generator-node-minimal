"use strict";
const path = require("path");
const Generator = require("yeoman-generator");

const dotfiles = [
  "babelrc",
  "eslintrc.js",
  "flowconfig",
  "gitignore",
  "npmignore",
  "prettierrc.js"
];

module.exports = class extends Generator {
  packageName() {
    let name = this.fs.readJSON(this.destinationPath("package.json"), {}).name;
    if (!name) {
      name = path.basename(this.destinationRoot());
    }
    return name.replace(/\s+/g, "-");
  }

  async prompting() {
    this.log("Let's set up a new Node.js package!");

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your package name",
        default: this.packageName()
      },
      {
        type: "input",
        name: "description",
        message: "Describe your package",
        default: ""
      },
      {
        type: "input",
        name: "authorName",
        message: "Your name",
        default: this.user.git.name()
      },
      {
        type: "input",
        name: "authorEmail",
        message: "Your email address",
        default: this.user.git.email()
      },
      {
        type: "input",
        name: "githubUsername",
        message: "Your GitHub username",
        default: await this.user.github.username()
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
    this.fs.copy(
      this.templatePath("rollup.config.js"),
      this.destinationPath("rollup.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("src/utils.js"),
      this.destinationPath("src/utils.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("src/utils.spec.js"),
      this.destinationPath("src/utils.spec.js"),
      this.props
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
    this.yarnInstall(
      [
        "@babel/cli",
        "@babel/core",
        "@babel/node",
        "@babel/polyfill",
        "@babel/preset-env",
        "@babel/preset-flow",
        "@babel/register",
        "babel-core@^7.0.0-bridge.0",
        "babel-eslint",
        "babel-jest",
        "eslint",
        "eslint-config-prettier",
        "eslint-plugin-flowtype",
        "eslint-plugin-prettier",
        "flow-bin",
        "mocha",
        "prettier",
        "regenerator-runtime",
        "rollup"
      ],
      { dev: true }
    );
  }

  end() {
    this.spawnCommandSync("yarn", ["run", "libdefs"]);
    this.spawnCommandSync("yarn", ["run", "compile"]);
    this.spawnCommandSync("yarn", ["run", "test"]);
    this.log("Setup completely successfully");
  }
};
