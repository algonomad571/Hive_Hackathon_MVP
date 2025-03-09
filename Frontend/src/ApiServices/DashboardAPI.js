import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_URL;

export const getBalance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/balance`);
    return response.data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAutoInvestSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auto-invest`);
    return response.data;
  } catch (error) {
    console.error("Error fetching auto-invest settings:", error);
    throw error;
  }
};

export const toggleAutoInvest = async (isActive) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auto-invest/toggle`, { isActive });
    return response.data;
  } catch (error) {
    console.error("Error toggling auto-invest:", error);
    throw error;
  }
};

export const stakeForPremium = async (amount) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stake-premium`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error staking for premium:", error);
    throw error;
  }
};

export const checkSubscriptionStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscription-status`);
    return response.data;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
};
