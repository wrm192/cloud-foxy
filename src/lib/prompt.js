const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * Inquirer helper for prompting with a single question 
 */
async function prompt(question) {
  const responses = await inquirer.prompt([question]);
  return responses[question.name];
}

module.exports = prompt;