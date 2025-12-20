
export function storeBeBaseUrl(beBaseUrl: string) {
  localStorage.setItem('beBaseUrl', beBaseUrl);
}

export function getBeBaseUrl() {
  let beBaseUrl = localStorage.getItem('beBaseUrl');
  if (beBaseUrl === null) {
    beBaseUrl = "http://localhost:8000";
    storeBeBaseUrl(beBaseUrl);
  }
  return beBaseUrl;
}

export async function fetchAppConfig() {
  const url = `${getBeBaseUrl()}/config`;
  return fetch(url).then(response => response.json());
}

export async function updateAppConfig(config: string) {
  const url = `${getBeBaseUrl()}/config`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: config,
  })
}

export async function fetchModelProviders() {
  const url = `${getBeBaseUrl()}/api_spec`
  return fetch(url).then(response => response.json());
}

export async function fetchModelConfig(api_spec: string) {
  const url = `${getBeBaseUrl()}/api_spec/${api_spec}`;
  return fetch(url).then(response => response.json());
}

export async function updateModelConfig(api_spec: string, config: string) {
  const url = `${getBeBaseUrl()}/api_spec/${api_spec}`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: config,
  })
}

export async function fetchModels(reload: boolean) {
  const url = `${getBeBaseUrl()}/models?reload=${reload}`
  return fetch(url).then(response => response.json());
}

export async function fetchTemplates(reload: boolean) {
  const url = `${getBeBaseUrl()}/template?reload=${reload}`
  return fetch(url).then(response => response.json());
}

export async function fetchTemplate(template: string) {
  const url = `${getBeBaseUrl()}/template/${template}`;
  return fetch(url).then(response => response.text());
}

export async function updateTemplate(template: string, content: string) {
  const url = `${getBeBaseUrl()}/template/${template}`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'plain/text' },
    body: content,
  })
}

export async function generate(template: string, requirement: string) {
  const url = `${getBeBaseUrl()}/${template}/generate`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'plain/text' },
    body: requirement,
  }).then(response => response.text());
}

export async function gen_stream(template: string, requirement: string, onTextProcess: (generated: string) => void) {
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
