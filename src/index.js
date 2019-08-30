const gcloud = require('./lib/gcloud');
const questions = require('./lib/questions');
const prompt = require('./lib/prompt');
const startProxy = require('./lib/proxy');
const process = require('process');
const path = require('path');

async function run() {

  console.log(`☁️  Cloud Foxy ${Math.random() < 0.05 ? '🧓🏻' : '🦊'}\n`);
  const installed = await gcloud.isInstalled();

  if (!installed) {
    return console.log('Error: gcloud must be installed');
  }

  let proxies;

  const userFileInput = process.argv[2];

  if (userFileInput === undefined) {
    // if no file
    proxies = await promptInstanceQuestions();
  } else {
    // if passed a file
    proxies = await readInputsFromFile(userFileInput);
  }

  console.log('\nStarting cloud proxy...\n');

  startProxy(proxies);
}

async function readInputsFromFile(fileName) {
  const projects = await gcloud.listProjects();
  let content;
  try {
    content = await require(fileName);
    console.log('reading file now', fileName);

  } catch (exception) {
    console.log(`Failed to read file. ${exception}. If passing relative path, please path absolute.`);
    process.exit(1);
  }
  if (content.connections.length === 0) {
    throw(`File ${fileName} has no connection instances`);
  }

  // validate the content
  /** @namespace content.connections is a list of all the connection instances in the file */
  content.connections.forEach(connection => {
    projects.forEach(project => {
      if (!project.name === connection.connectionName) {
        throw(`Project ${connection.connectionName} does not exist`);
      }

      // should check for DB too, but my DB is failing due to not having any instances i believe -- will revisit
    });
  });

  return content.connections;
}

async function promptInstanceQuestions() {
  const proxies = [];
  let readMore = true;
  console.log('Listing projects...\n');

  const projects = await gcloud.listProjects();

  while (readMore) {
    const proxy = await readProxy(projects);
    proxies.push(proxy);
    readMore = await prompt(questions.buildContinueQuestion());
  }
  return proxies;
}

const readProxy = async (projects) => {


  const projectId = await prompt(questions.buildProjectQuestion(projects));

  const databases = await gcloud.listDatabases(projectId);

  const database = await prompt(questions.buildDatabaseQuestion(databases));

  const connectionName = await gcloud.getConnectionName(projectId, database);

  const port = await prompt(questions.buildPortQuestion());

  return {
    database,
    connectionName,
    port
  };
}

module.exports = run;
