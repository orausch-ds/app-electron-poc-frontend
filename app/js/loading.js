const { remote } = require('electron');

async function waitForBackendToBeReady() {
  const maxAttempts = 60;
  const intervalMs = 500;
  const isEndpointUp = await checkEndpointStatus(`${process.env.BASE_URL}/orders`, maxAttempts, intervalMs)
  if (isEndpointUp) {
    remote.getCurrentWindow().loadURL(`file://${process.env.APP_DIR}/html/order.html`);
  } else {
    throw new Error("Could not start backend.");
  }
}

async function checkEndpointStatus(endpointUrl, maxAttempts, intervalMs) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      const response = await fetch(endpointUrl);
      console.debug(response.status);

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.debug(`Attempt ${attempt} - ${error}`);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempt++;
  }
  return false;
}