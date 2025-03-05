import { IBaseFiled, ITree } from 'agility-core/src/types/base';

/**
 * (User) 表持久化对象
 * @author BelovedYaoo
 * @version 1.2
 */
export interface IUser extends IBaseFiled {
    openId?: string;
    password?: string;
    phone?: string;
    email?: string;
    nickname?: string;
    avatarAddress?: string;
    roles?: Array<IRole>;
}

export interface IRole extends IBaseFiled, ITree {
    domainId?: string;
    roleName?: string;
    roleCode?: string;
    roleDesc?: string;
    permissions?: Array<IPermission>;
}

export interface IPermission extends IBaseFiled {
    permissionName?: string;
    permissionCode?: string;
    permissionDesc?: string;
    routers?: Array<IRouter>;
    interfaces?: Array<Interface>;
}

export interface IRouter extends IBaseFiled {
    routerName?: string;
    routerPath?: string;
    parentId?: string;
    routerType?: string;
    routerIcon?: string;
    componentPath?: string;
    isHidden?: boolean;
}