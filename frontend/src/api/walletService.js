import api from './axiosConfig';
import { v4 as uuidv4 } from 'uuid';

export const getWalletBalance = async () => {
  // balance endpoint nahi hai, userId se wallet lenge
  const username = localStorage.getItem('username');
  const response = await api.get('/api/wallets/balance');
  return response.data;
};


export const transferFunds = async (fromUserId, toUserId, amount) => {
  const idempotencyKey = uuidv4();
  const response = await api.post(
    '/api/wallets/transfer',
    { fromUserId, toUserId, amount },
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
  return response.data;
};


export const getTransactionHistory = async () => {
  const response = await api.get('/api/wallets/history');
  return response.data;
};

export const getLedgerStatus = async () => {
  const response = await api.get('/api/wallets/ledger-status');
  return response.data;
};