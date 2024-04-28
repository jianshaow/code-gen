
const backendBaseUrl = "http://localhost:5000"

async function fetchConfig() {
  const url = `${backendBaseUrl}/config`;
  return fetch(url).then(response => response.json());
}

async function updateConfig(config: string) {
  const url = `${backendBaseUrl}/config`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: config,
  })
}

async function fetchModels(reload: boolean) {
  const url = `${backendBaseUrl}/models?reload=${reload}`
  return fetch(url).then(response => response.json());
}

async function fetchTemplates(reload: boolean) {
  const url = `${backendBaseUrl}/template?reload=${reload}`
  return fetch(url).then(response => response.json());
}

async function fetchTemplate(template: string) {
  const url = `${backendBaseUrl}/template/${template}`;
  return fetch(url).then(response => response.text());
}

async function updateTemplate(template: string, content: string) {
  const url = `${backendBaseUrl}/template/${template}`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'plain/text' },
    body: content,
  })
}

async function generate(template: string, requirement: string) {
  const url = `${backendBaseUrl}/${template}/generate`
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'plain/text' },
    body: requirement,
  }).then(response => response.text());
}

export {
  fetchConfig, updateConfig, fetchModels, fetchTemplates, fetchTemplate, updateTemplate, generate
}