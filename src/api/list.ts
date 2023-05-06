import axios from 'axios';
import qs from 'query-string';

export interface PolicyRecord {
  id: string;
  plugin: string;
  username: string;
  token: string;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/api/developer/tokens', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
