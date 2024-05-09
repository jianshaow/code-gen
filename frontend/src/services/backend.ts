
function setBeBaseUrl(beBaseUrl: string) {
  localStorage.setItem('beBaseUrl', beBaseUrl);
}

function getBeBaseUrl() {
  var beBaseUrl = localStorage.getItem('beBaseUrl');
  if (beBaseUrl === null) {
    beBaseUrl = "http://localhost:5000";
    setBeBaseUrl(beBaseUrl);
  }
  return beBaseUrl;
}

async function fetchConfig() {
  const url = `${getBeBaseUrl()}/config`;
  return fetch(url).then(response => response.json());
}

async function updateConfig(config: string) {
  const url = `${getBeBaseUrl()}/config`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: config,
  })
}

async function fetchApiSpecs() {
  const url = `${getBeBaseUrl()}/api_specs`
  return fetch(url).then(response => response.json());
}

async function fetchModels(reload: boolean) {
  const url = `${getBeBaseUrl()}/models?reload=${reload}`
  return fetch(url).then(response => response.json());
}

async function fetchTemplates(reload: boolean) {
  const url = `${getBeBaseUrl()}/template?reload=${reload}`
  return fetch(url).then(response => response.json());
}

async function fetchTemplate(template: string) {
  const url = `${getBeBaseUrl()}/template/${template}`;
  return fetch(url).then(response => response.text());
}

async function updateTemplate(template: string, content: string) {
  const url = `${getBeBaseUrl()}/template/${template}`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'plain/text' },
    body: content,
  })
}

async function generate(template: string, requirement: string) {
  const url = `${getBeBaseUrl()}/${template}/generate`
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'plain/text' },
    body: requirement,
  }).then(response => response.text());
}

export {
  getBeBaseUrl,
  setBeBaseUrl,
  fetchConfig,
  updateConfig,
  fetchApiSpecs,
  fetchModels,
  fetchTemplates,
  fetchTemplate,
  updateTemplate,
  generate
}