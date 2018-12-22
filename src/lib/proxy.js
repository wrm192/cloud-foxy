const {
  spawn
} = require('child_process');
const path = require('path');

function startProxy(proxies) {
  const instances = proxies.map((proxy) => `${proxy.connectionName}=tcp:${proxy.port}`).join(',');
  const proc = spawn(path.join(__dirname, '../../bin/cloud_sql_proxy'), [`-instances=${instances}`]);
  proc.stdout.on('data', (data) => console.log(`${data}`));
  proc.stderr.on('data', (data) => console.log(`${data}`));
  proc.on('close', (code) => console.log(`proxy process exited with code ${code}`));
}

module.exports = startProxy;
