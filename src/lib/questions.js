function filterOptions(options, str) {
  str = str === undefined ? '' : str;
  return Promise.resolve(options.filter((opt) => opt.name.includes(str)));
}

function buildProjectQuestion(projects) {
  const choices =  projects.map((project) => ({
    key: project.projectId,
    name: project.name,
    value: project
  }));
  return {
    type: 'autocomplete',
    name: 'projectId',
    message: 'Select a project (type to filter)',
    source:  (_, input) => filterOptions(choices, input),

    filter: (project) => project.projectId
  }
}

function buildDatabaseQuestion(databases) {
  const choices = databases.map((database) => ({
    key: database,
    name: database,
    value: database
  }));
  
  return {
    type: 'autocomplete',
    name: 'database',
    message: 'Select a database (type to filter)',
    source: (_, input) => filterOptions(choices, input),
    filter: (database) => database
  }
}

function buildPortQuestion() {
  return {
    type: 'input',
    name: 'port',
    message: 'Enter a port to listen on',
    default: 5432,
    filter: (val) => val,
  }
}

function buildContinueQuestion() {
  return {
    type: 'confirm',
    name: 'continue',
    message: 'Proxy another database?',
    default: false,
    filter: (res) => res,
  }
}

module.exports = {
  buildContinueQuestion,
  buildDatabaseQuestion,
  buildPortQuestion,
  buildProjectQuestion
}