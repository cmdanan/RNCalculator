import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL_APP_DEV, BASE_URL_APP_PROD } from '@env';

const API_URL = BASE_URL_APP_DEV;
// process.env.NODE_ENV === 'development' ? BASE_URL_APP_DEV : BASE_URL_APP_PROD;

export const api = {
  init: async () => {
    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'GET',
      });
      const body = await response.json();
      await SecureStore.setItemAsync('token', body.access_token);
    } catch (error) {
      console.log('[API-init] error', error);
    }
  },
  createUser: async () => {
    const osName = Device.osName;
    const uuid = await getDeviceId();
    const payload = { os: osName?.toLowerCase(), uuid };
    const headers = await createHttpHeaders();
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (response.status >= 400 && response.status <= 500) {
        throw body.error;
      }
      await SecureStore.setItemAsync('uuid', body.user.uuid);
    } catch (error) {
      console.log('[API-createUser] error', error);
      if (error === 'uuid already exists') {
        if (uuid) {
          await SecureStore.setItemAsync('uuid', uuid);
        }
      }
    }
  },
  createTransaction: async (calculation: string) => {
    const payload = { calculation };
    const deviceId = await SecureStore.getItemAsync('uuid');
    const headers = await createHttpHeaders();

    try {
      return await fetch(`${API_URL}/user/${deviceId}/transaction`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log('[API-createCalculation] error', error);
    }
  },
  deleteAllTransactions: async () => {
    const deviceId = await SecureStore.getItemAsync('uuid');
    const headers = await createHttpHeaders();

    try {
      return await fetch(`${API_URL}/user/${deviceId}/transaction`, {
        method: 'DELETE',
        headers: headers,
      });
    } catch (error) {
      console.log('[API-deleteAllTransactions] error', error);
    }
  },
};

const getDeviceId = async () => {
  return Device.osName?.toLowerCase() === 'android'
    ? Application.androidId
    : Application.getIosIdForVendorAsync();
};

const createHttpHeaders = async () => {
  const token = await SecureStore.getItemAsync('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};
