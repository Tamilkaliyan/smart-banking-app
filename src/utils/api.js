/**
 * api.js
 * ---------------------------------------------------------------
 * Central HTTP client for the Smart Banking backend (Express + MongoDB).
 * Replaces the old localStorage/Excel-simulation store. All requests
 * attach the JWT auth token (if present) from localStorage.
 * ---------------------------------------------------------------
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'smart_banking_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

/* ---------------------- AUTH ---------------------- */

export async function apiRegister({ name, email, password }) {
  const data = await request('/auth/register', { method: 'POST', body: { name, email, password }, auth: false });
  setToken(data.token);
  return data.user;
}

export async function apiLogin(email, password) {
  const data = await request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
  setToken(data.token);
  return data.user;
}

export async function apiForgotPassword(email, password) {
  return request('/auth/forgot-password', { method: 'POST', body: { email, password }, auth: false });
}

export function apiLogout() {
  setToken(null);
}

/* ---------------------- ACCOUNTS ---------------------- */

export function apiGetAccounts() {
  return request('/accounts');
}

export function apiGetAccount(accountNo) {
  return request(`/accounts/${accountNo}`);
}

export function apiCreateAccount({ accountType, openingBalance }) {
  return request('/accounts', { method: 'POST', body: { accountType, openingBalance } });
}

/* ---------------------- TRANSACTIONS ---------------------- */

export function apiDeposit(accountNo, amount) {
  return request('/transactions/deposit', { method: 'POST', body: { accountNo, amount } });
}

export function apiWithdraw(accountNo, amount) {
  return request('/transactions/withdraw', { method: 'POST', body: { accountNo, amount } });
}

export function apiTransfer(fromAccountNo, toAccountNo, amount) {
  return request('/transactions/transfer', { method: 'POST', body: { fromAccountNo, toAccountNo, amount } });
}

export function apiGetTransactions(accountNo) {
  return request(`/transactions/${accountNo}`);
}

/* ---------------------- ADMIN ---------------------- */

export function apiAdminOverview() {
  return request('/admin/overview');
}

export function apiAdminReset() {
  return request('/admin/reset', { method: 'DELETE' });
}
