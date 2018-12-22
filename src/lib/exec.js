const inquirer = require('inquirer');
const {
  exec
} = require('child_process');

module.exports = (command) => new Promise((resolve, reject) => {
  exec(command, (err, stdout) => {
    if (err) {
      return reject({
        err,
        stdout
      });
    }
    return resolve(stdout);
  });
});