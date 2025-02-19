import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';
import router from '@/service/router';
import { globalConfig, signOut } from './globalQuote';
import { getParameterByName, isValid } from 'agility-core/src/service/toolkit';
import { IBaseFiled } from 'agility-core/src/types/base';

/**
 * 请求结果封装
 * @author BelovedYaoo
 * @version 1.0.0
 */
interface IResult<T = any> {
    code: number
    message: string
    state?: boolean
    description?: string
    data?: T
}

/**
 * 请求配置封装
 * @author BelovedYaoo
 * @version 1.0.0
 */
interface RequestConfig extends AxiosRequestConfig {
    module?: string
}

/**
 * 请求封装
 * @author BelovedYaoo
 * @version 1.0.0
 */
class RequestWrapper<T = any> {
    private promise: Promise<AxiosResponse<IResult<T>>>;

    constructor(promise: Promise<AxiosResponse<IResult<T>>>) {
        this.promise = promise;
    }

    success(callback: (response: AxiosResponse<IResult<T>>) => void): RequestWrapper<T> {
        const newPromise: Promise<AxiosResponse<IResult<T>>> = this.promise.then((response: AxiosResponse<IResult<T>, any>) => {
            if (response.data.code === 200) {
                callback(response);
            }
            return response;
        });
        return new RequestWrapper<T>(newPromise);
    }

    failed(callback: (response: AxiosResponse<IResult<T>>) => void): RequestWrapper<T> {
        const newPromise: Promise<AxiosResponse<IResult<T>>> = this.promise.then((response: AxiosResponse<IResult<T>, any>) => {
            if (response.data.code === 400) {
                callback(response);
            }
            return response;
        });
        return new RequestWrapper<T>(newPromise);
    }

    then<TResult1 = AxiosResponse<IResult<T>>, TResult2 = never>(
        onFulfilled?: (value: AxiosResponse<IResult<T>>) => TResult1 | PromiseLike<TResult1>,
        onRejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
    ): RequestWrapper<TResult1 | TResult2> {
        const newPromise: Promise<TResult1 | TResult2> = this.promise.then(onFulfilled, onRejected);
        return new RequestWrapper<TResult1 | TResult2>(newPromise);
    }

    catch<TResult = never>(
        onRejected?: (reason: any) => TResult | PromiseLike<TResult>
    ): RequestWrapper<T | TResult> {
        const newPromise: Promise<TResult | AxiosResponse<IResult<T>, any>> = this.promise.catch(onRejected);
        return new RequestWrapper<T | TResult>(newPromise);
    }

    finally(onFinally?: () => void): RequestWrapper<T> {
        const newPromise: Promise<AxiosResponse<IResult<T>, any>> = this.promise.finally(onFinally);
        return new RequestWrapper<T>(newPromise);
    }
}

/**
 * Axios封装
 * @author BelovedYaoo
 * @version 1.0.0
 */
class ApiClient {
    private instance: AxiosInstance;
    private baseURL: string = import.meta.env.VITE_API_BASE_URL;

    constructor() {
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            withCredentials: false
        });

        this.setupInterceptors();
    }

    public request<T = any>(config: RequestConfig): RequestWrapper<T> {
        try {
            return new RequestWrapper<T>(
                this.instance.request<IResult<T>>(config)
            );
        } catch (error) {
            console.error('API Request Error:', error);
            return new RequestWrapper<T>(Promise.reject(error));
        }
    }

    public operate(moduleName: string) {
        return {
            queryAll: <T extends IBaseFiled>() =>
                new RequestWrapper<T[]>(
                    this.request<T[]>({
                        method: 'GET',
                        url: `/${moduleName}/queryAll`
                    })
                ),
            add: <T extends IBaseFiled>(data: T) =>
                new RequestWrapper<T>(
                    this.request<T>({
                        method: 'POST',
                        url: `/${moduleName}/add`,
                        data: data
                    })
                ),
            update: <T extends IBaseFiled>(data: T) =>
                new RequestWrapper<T>(
                    this.request<T>({
                        method: 'POST',
                        url: `/${moduleName}/update`,
                        data: data
                    })
                ),
            delete: (id: string[]) =>
                new RequestWrapper<T>(
                    this.request<T>({
                        method: 'POST',
                        url: `/${moduleName}/delete`,
                        data: id
                    })
                ),
            reorder: (leftTarget: string, rightTarget: string) =>
                new RequestWrapper(
                    this.request({
                        method: 'POST',
                        url: `/${moduleName}/reorder`,
                        params: {
                            leftTarget: leftTarget,
                            rightTarget: rightTarget
                        }
                    })
                ),
            orderSwap: (leftTargetBaseId: string, leftTargetOrderNum: string, rightTargetBaseId: string, rightTargetOrderNum: string) =>
                new RequestWrapper(
                    this.request({
                        method: 'POST',
                        url: `/${moduleName}/orderSwap`,
                        params: {
                            leftTargetBaseId: leftTargetBaseId,
                            leftTargetOrderNum: leftTargetOrderNum,
                            rightTargetBaseId: rightTargetBaseId,
                            rightTargetOrderNum: rightTargetOrderNum
                        }
                    })
                )
        };
    }

    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(config => {
            const token = cookie.get(globalConfig.appTokenName);
            if (isValid(token)) {
                config.headers[globalConfig.appTokenName] = token;
            }
            config.headers['Content-Type'] = 'application/json';
            return config;
        });

        // 响应拦截器
        this.instance.interceptors.response.use(
            response => this.handleResponse(response),
            error => this.handleError(error)
        );
    }

    private handleResponse(response: AxiosResponse<IResult>): AxiosResponse {
        const {code} = response.data;
        switch (code) {
            case 700:
            case 900:
                signOut();
                break;
            case 500:
                cookie.remove(globalConfig.appTokenName);
                break;
            case 901:
                router.push({
                    path: '/auth/confirm',
                    query: {
                        // eslint-disable-next-line camelcase
                        client_id: response.data.data?.client_id,
                        scope: response.data.data?.scope,
                        // eslint-disable-next-line camelcase
                        redirect_uri: getParameterByName('redirect_uri')
                    }
                });
                break;
            case 902:
                router.push({
                    path: '/access'
                });
                break;
        }
        return response;
    }

    private handleError(error: any) {
        return Promise.reject(error);
    }
}

// 创建单例实例
const apiClient = new ApiClient();
// 核心请求方法
export const request: <T = any>(config: RequestConfig) => RequestWrapper<T> =
    apiClient.request.bind(apiClient);
// 快捷方法
export const queryAll = <T extends IBaseFiled>(moduleName: string) =>
    apiClient.operate(moduleName).queryAll<T>();
export const add = <T extends IBaseFiled>(moduleName: string, data: T) =>
    apiClient.operate(moduleName).add<T>(data);
export const update = <T extends IBaseFiled>(moduleName: string, data: T) =>
    apiClient.operate(moduleName).update<T>(data);
export const del = (moduleName: string, id: string[]) =>
    apiClient.operate(moduleName).delete(id);
export const reorder = (moduleName: string, leftTarget: string, rightTarget: string) =>
    apiClient.operate(moduleName).reorder(leftTarget, rightTarget);
export const orderSwap = (moduleName: string, leftTargetBaseId: string, leftTargetOrderNum: string, rightTargetBaseId: string, rightTargetOrderNum: string) =>
    apiClient.operate(moduleName).orderSwap(leftTargetBaseId, leftTargetOrderNum, rightTargetBaseId, rightTargetOrderNum);
// 保留原始实例导出
export const http: ApiClient = apiClient;