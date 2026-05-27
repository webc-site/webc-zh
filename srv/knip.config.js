export default {
  entry: ["src/main.js", "sh/**/*.js", "test/*.js", "docker/*.js"],
  project: ["**/*.js"],
  ignoreDependencies: ["nodemon"],
  ignoreFiles: ["conf/*.js", "conf/**/*.js"],
  ignoreBinaries: ["mise", "down", "up"],
};
