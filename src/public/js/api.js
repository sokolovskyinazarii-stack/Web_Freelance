async function request(path) {
  const response = await fetch(path);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Помилка запиту: ${response.status}`);
  }

  return payload;
}

export function getOverview() {
  return request('/api/overview');
}

export function getCollection(resource) {
  return request(`/api/${resource}`);
}

export function getRecord(resource, id) {
  return request(`/api/${resource}/${id}`);
}
