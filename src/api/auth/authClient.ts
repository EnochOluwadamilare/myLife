import axios from "axios";
import { CONFIG } from "@/constants/config";

export const authClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.REQUEST_TIMEOUT,
});