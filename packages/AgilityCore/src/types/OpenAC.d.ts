import { IBaseFiled, ITree } from './base';

/**
 * 域类型定义
 * @author BelovedYaoo
 * @version 1.0
 */
export interface IDomain extends IBaseFiled, ITree {
    domainName: string;
    domainCode: string;
    domainDesc: string;
}