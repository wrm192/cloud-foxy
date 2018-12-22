const exec = require('./exec');

/**
 * Parses a gcloud list response into response lines, trimming header details and whitespace
 */
function parseListResponse(response) {
  const lines = response.split('\n');
  return lines.slice(1, lines.length - 1);
}

/**
 * Checks if the google cloud sdk is installed (gcloud)
 */
async function isInstalled() {
  try {
    await exec('gcloud version');
  } catch (err) {
    return false;
  }
  return true;
}

async function listProjects() {
  const lines = parseListResponse(await exec('gcloud projects list'));

  const projects = lines.map((line) => line.match(/([^ ]*) +([^ ]*) +([^ ]*)/)).map((matches) => ({
    projectId: matches[1],
    name: matches[2]
  }));
  return projects;
}

async function listDatabases(projectId) {
  const lines = parseListResponse(await exec(`gcloud --project ${projectId} sql instances list`));
  return lines.map((line) => line.match(/([^ ]*)/)[0]);
}

async function getConnectionName(projectId, database) {
  const response = await exec(`gcloud --project ${projectId} sql instances describe ${database}`);
  return response.match(/connectionName: ([^\n]*)/)[1];
}

module.exports = {
  isInstalled,
  getConnectionName,
  listProjects,
  listDatabases,
};
