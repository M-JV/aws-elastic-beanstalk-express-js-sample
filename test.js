const http = require('http');
const { spawn } = require('child_process');

const app = spawn('node', ['app.js'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let finished = false;

function finish(code) {
  if (finished) return;
  finished = true;
  app.kill();
  process.exit(code);
}

app.stderr.on('data', data => {
  process.stderr.write(data);
});

setTimeout(() => {
  http.get('http://localhost:8080/', res => {
    let body = '';

    res.on('data', chunk => {
      body += chunk;
    });

    res.on('end', () => {
      console.log(`HTTP status: ${res.statusCode}`);
      console.log(`Response body: ${body}`);

      if (res.statusCode === 200 && body === 'Hello World!') {
        console.log('TEST PASSED: Application returned expected response.');
        finish(0);
      } else {
        console.error('TEST FAILED: Unexpected application response.');
        finish(1);
      }
    });
  }).on('error', error => {
    console.error(`TEST FAILED: ${error.message}`);
    finish(1);
  });
}, 1000);

setTimeout(() => {
  console.error('TEST FAILED: Test timed out.');
  finish(1);
}, 10000);
