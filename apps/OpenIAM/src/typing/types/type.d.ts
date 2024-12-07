import { BaseFiled } from 'agility-core/src/types/base';

/**
 * (Account) 表持久化对象
 * @author BelovedYaoo
 * @version 1.1
 */
export interface Account extends BaseFiled {
    openId?: string;
    password?: string;
    phone?: string;
    email?: string;
    nickname?: string;
    avatarAddress?: string;
    roles?: Array<Role>;
}

export interface Role extends BaseFiled {
    roleName?: string;
    roleCode?: string;
    roleDesc?: string;
    permissions?: Array<Permission>;
}

export interface Permission extends BaseFiled {
    permissionName?: string;
    permissionCode?: string;
    permissionDesc?: string;
    routers?: Array<Router>;
    interfaces?: Array<Interface>;
}

export interface Router extends BaseFiled {
    routerName?: string;
    routerPath?: string;
    parentId?: string;
    routerType?: string;
    routerIcon?: string;
    componentPath?: string;
    isHidden?: boolean;
}

export interface Interface extends BaseFiled {
    interfaceName?: string;
    interfacePath?: string;
    requestType?: string;
    interfaceDesc?: string;
}