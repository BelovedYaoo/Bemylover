import { AxiosResponse } from 'axios';
import { ToastMessageOptions } from 'primevue/toast';
import { ITree } from '../types/base';
import { ITreeNode } from '../types/core';

/**
 * 将Axios请求响应体转换为PrimeVue的Toast配置
 * @param response Axios响应体
 * @param duringSecond Toast显示时长(默认3秒)
 */
export const responseToastConfig = (response: AxiosResponse<any>, duringSecond: number = 3): ToastMessageOptions => {
    return {
        severity: response.data.code === 200 ? 'success' : 'error',
        summary: response.data.message,
        detail: response.data.description,
        life: duringSecond * 1000
    };
};

/**
 * 将类名添加到指定id的元素上，并设置延时移除
 * @param id 需要添加的元素id名
 * @param className 被添加的类名
 * @param duringSecond 延时时长(默认5秒延时)
 */
export const addClassById = (id: string, className: string, duringSecond: number = 5): void => {
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
        element.classList.add(className);
        setTimeout((): void => {
            element.classList.remove(className);
        }, duringSecond * 1000);
    }
};

/**
 * 获取URL参数
 * @param name 参数名
 * @param url 链接地址(默认为当前地址)
 */
export const getParameterByName = (name: string, url: string = window.location.href): null | string => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex: RegExp = new RegExp(`[?&]${  name  }(=([^&#]*)|&|#|$)`),
        results: RegExpExecArray = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * 将扁平化的 ITree 数据转换为层级化的 PrimeVue Tree 节点
 * @param trees 扁平节点列表
 * @param labelField 节点显示文本字段
 * @returns 层级化的 ITreeNode 数组
 */
export function Tree2TreeNode<T extends ITree>(
    trees: T[],
    labelField: keyof T
): ITreeNode<T>[] {
    // 预处理所有节点：创建映射表
    const nodeMap: Record<string, ITreeNode<T>> = {};
    const roots: ITreeNode<T>[] = [];
    trees.forEach((node: T): void => {
        // 创建 PrimeVue 节点并加入映射表
        nodeMap[node.baseId] = {
            key: node.baseId,
            label: node[labelField] as string,
            // 保留原始数据并标准化 parentId
            data: {...node},
            // 初始化子节点容器为空
            children: []
        };
    });
    // 构建父子关系
    trees.forEach((node: T): void => {
        const current: ITreeNode<T> = nodeMap[node.baseId];
        // 不为根节点，且父节点存在，则将当前节点加入其父节点的 children
        // 否则，将当前节点加入根节点列表
        if (!node.isRoot && node.parentId && nodeMap[node.parentId]) {
            nodeMap[node.parentId].children!.push(current);
        } else {
            roots.push(current);
        }
    });
    return roots;
}

/**
 * 判断参数是否不为空
 * @param params 参数
 */
export const isValid = (params: string): boolean => {
    return !isNotValid(params);
};

/**
 * 判断参数是否为空
 * @param params 参数
 */
export const isNotValid = (params: string): boolean => {
    return (params === '' || params === null || params === undefined || params.length === 0);
};