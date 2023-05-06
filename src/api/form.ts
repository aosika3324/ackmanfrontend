import axios from 'axios';

export interface PluginAuthorisationData {
  username: string;
  plugin: string;
}

export function addAuthorisation(data: PluginAuthorisationData) {
  return axios.post('/api/authorisation/add', data);
}

export function delAuthorisation(data: PluginAuthorisationData) {
  return axios.post('/api/authorisation/del', data);
}
