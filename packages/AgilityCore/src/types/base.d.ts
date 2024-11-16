/**
 * 基础字段
 * @author BelovedYaoo
 * @version 1.6
 */
interface BaseFiled {
    baseId?: string;
    orderNum?: number;
    createTime?: Date;
    updateTime?: Date;
    disabledAt?: Date;
    deletedAt?: Date;
    disabled?: boolean;
}

/**
 * 菜单项
 * @author BelovedYaoo
 * @version 1.0
 */
interface AppMenuItem {
    to?: string
    items?:AppMenuItem[]
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