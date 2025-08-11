import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

export const fetchApi = async (url) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY || process.env.RAPID_API_KEY;
    const isClient = typeof window !== 'undefined';

    // When running in the browser, proxy RapidAPI requests through our API route
    const isRapidApiUrl = typeof url === 'string' && url.startsWith(baseUrl);
    const clientUrl = isClient && isRapidApiUrl ? `/api/bayut${url.substring(baseUrl.length)}` : url;

    // On the server, call RapidAPI directly with headers; on the client, hit our proxy without headers
    if (!isClient && isRapidApiUrl) {
      if (!apiKey) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('fetchApi skipped: API key is not set (RAPID_API_KEY or NEXT_PUBLIC_RAPID_API_KEY)');
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
    }

    const { data } = await axios.get(clientUrl);
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('fetchApi error', error?.response?.status || '', error?.message || '');
    }
    return null;
  }
}