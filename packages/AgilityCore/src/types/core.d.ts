import { TreeNode } from 'primevue/tree';
import { ITree } from './base';

/**
 * 菜单项
 * @author BelovedYaoo
 * @version 1.0
 */
export interface AppMenuItem {
    to?: string
    items?: AppMenuItem[]
    visible?: boolean
    disabled?: boolean
    class?: string
    icon?: string
    mdi?: string
    label?: string
    url?: string
    target?: string
    style?: string
}

/**
 * 对 PrimeVue Tree 组件数据的扩展类型封装
 */
export interface ITreeNode<T extends ITree> extends TreeNode {
    data?: T
}