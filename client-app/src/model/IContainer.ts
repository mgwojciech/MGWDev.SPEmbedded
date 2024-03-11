export interface IContainer {
    id: string;
    displayName: string;
}

export interface IContainerPermission{
    id: string;
    roles: string[];
    grantedToV2:{
        user: IPermissionUser;
    }
}
export interface IPermissionUser{
    displayName: string;
    email: string;
    id: string;
    userPrincipalName: string;
}