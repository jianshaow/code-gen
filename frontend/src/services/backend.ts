
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
  const url = `${getBeBaseUrl()}/api_spec`
  return fetch(url).then(response => response.json());
}

async function fetchApiConfig(api_spec: string) {
  const url = `${getBeBaseUrl()}/api_spec/${api_spec}`;
  return fetch(url).then(response => response.json());
}

async function updateApiConfig(api_spec: string, config: string) {
  const url = `${getBeBaseUrl()}/api_spec/${api_spec}`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: config,
  })
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
  const url = `${getBeBaseUrl()}/${template}/generate`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'plain/text' },
    body: requirement,
  }).then(response => response.text());
}

async function gen_stream(template: string, requirement: string, onTextProcess: (generated: string) => void) {
  const url = `${getBeBaseUrl()}/${template}/gen_stream`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'plain/text' },
    body: requirement,
  });

  const reader = resp.body?.getReader();
  if (!reader) {
    return;
  }

  const decoder = new TextDecoder();
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedText += chunk;
    onTextProcess(accumulatedText);
  }
}

export {
  fetchApiConfig, fetchApiSpecs, fetchConfig, fetchModels, fetchTemplate, fetchTemplates, gen_stream, generate, getBeBaseUrl,
  setBeBaseUrl, updateApiConfig, updateConfig, updateTemplate
};
