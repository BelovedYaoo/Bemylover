/**
 * 基础字段
 * @author BelovedYaoo
 * @version 1.6
 */
export interface IBaseFiled {
    baseId?: string;
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