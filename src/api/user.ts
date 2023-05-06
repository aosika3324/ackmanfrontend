import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export function login(data: LoginData) {
  return axios.post('/api/login', data);
}

export function logout() {
  return axios.post('/api/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/developer/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
