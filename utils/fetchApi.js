import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

export const fetchApi = async (url) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('fetchApi skipped: NEXT_PUBLIC_RAPID_API_KEY is not set');
      }
      return null;
    }
    const { data } = await axios.get(url, {
      headers: {
        'x-rapidapi-host': 'bayut.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
    });
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('fetchApi error', error?.response?.status || '', error?.message || '');
    }
    return null;
  }
}