import axios from "axios";

const GENIUS_API_URL = process.env.GENIUS_API_URL;
const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN;

export const genius = axios.create({
  baseURL: GENIUS_API_URL,
  headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
});
