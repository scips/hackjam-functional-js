const request = require('request');
const {runCLI} = require('jest');
const {id, email} = require('./.hackjamrc.json');

const options = {
  projects: [__dirname],
  silent: true,
  json:true,
};

runCLI(options, options.projects, (results) => {
  const {numPassedTests, numTotalTests} = results;
  request.post({
    uri: `https://us-central1-hackjam-timer.cloudfunctions.net/hackTests/${id}`,
    method: 'POST',
    json: {
      results: {
        numPassedTests,
        numTotalTests,
      },
      email
    }
  })
});
