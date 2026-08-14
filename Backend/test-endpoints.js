const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function makeRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING ENDPOINT VERIFICATION TESTS ---');

  try {
    // 1. Test GET /api/loanapplications
    console.log('\n1. Testing GET /api/loanapplications...');
    const appsResult = await makeRequest(`${API_BASE}/loanapplications`, 'GET');
    console.log(`Status Code: ${appsResult.statusCode}`);
    if (appsResult.statusCode === 200 && Array.isArray(appsResult.body)) {
      console.log(`Success: Found ${appsResult.body.length} loan applications.`);
      console.log(`First application reference: ${appsResult.body[0].reference}`);
    } else {
      console.error('Failed to get loan applications:', appsResult.body);
    }

    // 2. Test POST /api/auth/login
    console.log('\n2. Testing POST /api/auth/login (Underwriter)...');
    const loginResult = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: 'underwriter@talanton.demo',
      password: 'Demo123!',
      portalRole: 'underwriter'
    });
    console.log(`Status Code: ${loginResult.statusCode}`);
    if (loginResult.statusCode === 200 && loginResult.body.role === 'underwriter') {
      console.log('Success: Login successful. User Name:', loginResult.body.fullName);
    } else {
      console.error('Failed to login:', loginResult.body);
    }

    // 3. Test GET /api/creditpassport
    console.log('\n3. Testing GET /api/creditpassport...');
    const passportResult = await makeRequest(`${API_BASE}/creditpassport`, 'GET');
    console.log(`Status Code: ${passportResult.statusCode}`);
    if (passportResult.statusCode === 200 && Array.isArray(passportResult.body)) {
      console.log(`Success: Found ${passportResult.body.length} credit passport members.`);
    } else {
      console.error('Failed to get credit passport members:', passportResult.body);
    }

    console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Test run failed with error:', error);
  }
}

// Wait a bit to ensure server is listening
setTimeout(runTests, 1000);
