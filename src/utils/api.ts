import { projectId, publicAnonKey } from "./supabase/info";
import { getAccessToken } from "./auth";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-20229b90`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Use access token if available, otherwise fall back to public key
  const accessToken = getAccessToken();
  const authToken = accessToken || publicAnonKey;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!data.success) {
    console.error(`API Error (${endpoint}):`, data.error);
    throw new Error(data.error || "API request failed");
  }

  return data.data;
}

// ============== PROPERTIES API ==============

export async function getProperties() {
  return fetchAPI("/properties");
}

export async function getProperty(id: string | number) {
  return fetchAPI(`/properties/${id}`);
}

export async function createProperty(property: any) {
  return fetchAPI("/properties", {
    method: "POST",
    body: JSON.stringify(property),
  });
}

export async function updateProperty(id: string | number, property: any) {
  return fetchAPI(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(property),
  });
}

export async function deleteProperty(id: string | number) {
  return fetchAPI(`/properties/${id}`, {
    method: "DELETE",
  });
}

// ============== AGENTS API ==============

export async function getAgents() {
  return fetchAPI("/agents");
}

export async function createAgent(agent: any) {
  return fetchAPI("/agents", {
    method: "POST",
    body: JSON.stringify(agent),
  });
}

export async function updateAgent(id: string | number, agent: any) {
  return fetchAPI(`/agents/${id}`, {
    method: "PUT",
    body: JSON.stringify(agent),
  });
}

export async function deleteAgent(id: string | number) {
  return fetchAPI(`/agents/${id}`, {
    method: "DELETE",
  });
}

// ============== CLIENTS API ==============

export async function getClients() {
  return fetchAPI("/clients");
}

export async function createClient(client: any) {
  return fetchAPI("/clients", {
    method: "POST",
    body: JSON.stringify(client),
  });
}

export async function updateClient(id: string | number, client: any) {
  return fetchAPI(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(client),
  });
}

export async function deleteClient(id: string | number) {
  return fetchAPI(`/clients/${id}`, {
    method: "DELETE",
  });
}

// ============== TRANSACTIONS API ==============

export async function getTransactions() {
  return fetchAPI("/transactions");
}

export async function createTransaction(transaction: any) {
  return fetchAPI("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
}

// ============== INITIALIZATION ==============

export async function initializeSampleData() {
  return fetchAPI("/init-data", {
    method: "POST",
  });
}
