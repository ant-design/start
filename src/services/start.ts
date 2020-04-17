import { request } from 'umi';

export async function generate(data: any): Promise<any> {
  return request('/start/generate', { data, method: 'post' });
}
