/**
 * Глобальный экземпляр axios для взаимодействия с API
 * Настроен с базовым URL и стандартными заголовками
 */
import axios from 'axios';
import {BASE_URL} from "../config"

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

export default api;

