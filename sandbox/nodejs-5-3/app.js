
const { SpacesServiceClient } = require('@google-cloud/meet').v2beta;

// Instantiates a client
const meetClient = new SpacesServiceClient();

async function callCreateSpace() {
  // Construct request
  const request = {};

  // Run request
  const response = await meetClient.createSpace(request);
  console.log(response);
}

callCreateSpace();