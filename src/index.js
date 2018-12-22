const gcloud = require('./lib/gcloud');
const questions = require('./lib/questions');
const prompt = require('./lib/prompt');
const startProxy = require('./lib/proxy');

async function run() {
  console.log(`☁️  Cloud Foxy ${Math.random() < 0.05 ? '🧓🏻' : '🦊'}\n`);
  const installed = await gcloud.isInstalled();

  if (!installed) {
    return console.log('Error: gcloud must be installed');
  }

  const proxies = [];

  let readMore = true;

  console.log('Listing projects...\n');

  const projects = await gcloud.listProjects();
  
  while (readMore) {
    const proxy = await readProxy(projects);
    proxies.push(proxy);
    readMore = await prompt(questions.buildContinueQuestion());
  }

  console.log('\nStarting cloud proxy...\n');

  startProxy(proxies);


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