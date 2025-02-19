/**
 * 基础ID字段
 * @author BelovedYaoo
 * @version 1.0
 */
export interface IBaseIdFiled {
    baseId: string;
}
/**
 * 基础字段
 * @author BelovedYaoo
 * @version 1.6
 */
export interface IBaseFiled extends IBaseIdFiled {
    orderNum?: number;
    createTime?: Date;
    updateTime?: Date;
    creator_id?: string;
    updater_id?: string;
    disabledAt?: Date;
    deletedAt?: Date;
}

/**
 * 多租户基础字段
 * @author BelovedYaoo
 * @version 1.0
 */
export interface ITenantFiled extends IBaseFiled {
    tenantId?: string;
}

/**
 * 树结构基础字段
 * @author BelovedYaoo
 * @version 1.0
 */
export interface ITree extends IBaseFiled {
    parentId?: string;
    treePath: string;
    isRoot: boolean;
    isLeaf: boolean;
}
