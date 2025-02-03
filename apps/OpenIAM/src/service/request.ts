import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';
import router from '@/service/router';
import { globalConfig, signOut } from './globalQuote';
import { getParameterByName, isValid } from 'agility-core/src/service/toolkit';
import { IBaseFiled } from 'agility-core/src/types/base';

interface IResult<T = any> {
    code: number
    message: string
    state?: boolean
    description?: string
    data?: T
}

interface RequestConfig extends AxiosRequestConfig {
    module?: string
}

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

    public async request<T = any>(config: RequestConfig): Promise<AxiosResponse<IResult<T>>> {
        try {
            return await this.instance.request<IResult<T>>(config);
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    public operate(moduleName: string) {
        return {
            queryAll: <T extends IBaseFiled>() =>
                this.request<T[]>({
                    method: 'GET',
                    url: `/${moduleName}/queryAll`
                }),
            add: <T extends IBaseFiled>(data: T) =>
                this.request({
                    method: 'POST',
                    url: `/${moduleName}/add`,
                    data: data
                }),
            update: <T extends IBaseFiled>(data: T) =>
                this.request({
                    method: 'POST',
                    url: `/${moduleName}/update`,
                    data: data
                }),
            delete: (id: string[]) =>
                this.request({
                    method: 'POST',
                    url: `/${moduleName}/delete`,
                    data: id
                }),
            reorder: (leftTarget: string, rightTarget: string) =>
                this.request({
                    method: 'POST',
                    url: `/${moduleName}/reorder`,
                    params: {
                        leftTarget: leftTarget,
                        rightTarget: rightTarget
                    }
                }),
            orderSwap: (leftTargetBaseId: string, leftTargetOrderNum: string, rightTargetBaseId: string, rightTargetOrderNum: string) =>
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
export const request = apiClient.request.bind(apiClient);
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
export const http = apiClient;