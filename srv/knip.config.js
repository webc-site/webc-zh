export default {
  entry: ["lib/main.js", "sh/*.js", "test/*.js", "docker/*.js"],
  project: ["**/*.js"],
  ignoreDependencies: ["nodemon"],
  ignoreFiles: ["conf/R.js"],
  ignoreBinaries: ["mise", "down", "up"],
};
