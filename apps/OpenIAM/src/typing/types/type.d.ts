import { BaseFiled } from 'agility-core/src/types/base';

/**
 * (Account) 表持久化对象
 * @author BelovedYaoo
 * @version 1.1
 */
interface Account extends BaseFiled {
    openId?: string;
    password?: string;
    phone?: string;
    email?: string;
    nickname?: string;
    avatarAddress?: string;
}