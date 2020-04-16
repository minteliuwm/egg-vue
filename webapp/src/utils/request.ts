import Vue from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import services from '../services';

import { cloneDeep } from 'lodash';

// 接口返回结果格式
interface IHttpResponse {
  code: number;
  msg: string;
  result?: any;
}

// 请求参数格式
interface IServiceParams {
  data?: any;
  throwError?: boolean;
  errMsg?: string;
}

const { protocol, hostname, port } = window.location;
const ORIGIN = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;

// url前缀
const PRE_URL = '/';

const DEFAULT_CONFIG = {
  baseURL: ORIGIN + PRE_URL,
  timeout: 3 * 60 * 1000,
  headers: {
    'Cache-Control': 'no-cache'
  }
};

const DEFAULT_OPTIONS: AxiosRequestConfig = {
  method: 'get',
  url: ''
};

const handleUrlSpecialCharacters = (url: string) => {
  return url.replace(/#/g, '%23'); // 暂时先处理 # 的情况，后续有出现其他特殊字符再说。
};

const ajax = (args: any = {}) => {
  const options: AxiosRequestConfig = Object.assign({}, DEFAULT_OPTIONS, args);
  // TODO: 处理请求参数，如所有接口都带上用户信息等
  if ((!options.method || options.method.toLowerCase() === 'get' || options.method.toLowerCase() === 'delete') && options.data) {
    options.url = handleUrlSpecialCharacters(options.url + '?' + qs.stringify(options.data));
    delete options.data;
  }

  const axiosConfig = cloneDeep(DEFAULT_CONFIG);
  if (options.headers) {
    axiosConfig.headers = options.headers;
  }

  return new Promise((resolve, reject) => {
    const instance = axios.create(axiosConfig);

    // request 拦截器
    instance.interceptors.request.use(config => {
      return config;
    }, e => {
      return Promise.reject(e);
    });

    // response 拦截器
    instance.interceptors.response.use(response => {
      // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
      const data = response.data === undefined ? response.request.responseText : response.data;
      return data;
    }, e => {
      return Promise.reject(e);
    });

    // 请求处理
    instance(options).then(res => resolve(res)).catch(e => reject(e));
  });
};

/**
 * 返回结果通用处理
 * @param res
 */
const handleResponse = (res: IHttpResponse): any => {
  return res.result;
};

/**
 * 异常情况通用处理
 * @param e
 * @param content
 */
const handleException = (e: Error, content?: string): void => {
  Vue.prototype.$message({
    type: 'error',
    message: content || e.message || '请求错误'
  });
};

/**
 * 接口通用请求方法
 * @param key 请求key，定义在services目录下
 * @param options 请求参数
 */
const request = async (key: string, options: IServiceParams = {}): Promise<any> => {
  try {
    const res = await ajax(services[key](options.data)) as IHttpResponse;
    return handleResponse(res);
  } catch (e) {
    if (options.throwError) { // 是否需要抛出异常
      throw new Error(e);
    } else {
      handleException(e, options.errMsg);
      return null;
    }
  }
};

export {
  request,
  handleException
};
