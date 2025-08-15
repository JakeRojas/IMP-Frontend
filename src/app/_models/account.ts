import { Role } from './role';
import { Branch } from '@app/_models';

export class Account {
    accountId?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    role?: Role;
    jwtToken?: string;
}