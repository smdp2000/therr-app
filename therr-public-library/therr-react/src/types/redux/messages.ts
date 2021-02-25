import * as Immutable from 'seamless-immutable';

export interface IDirectMsg {
    key: number | string;
    fromUserName: string;
    text: string;
    time: string;
}

export interface IForumMsg {
    key: string;
    fromUserName: string;
    time: string;
    text: string;
}

export type IForumMsgList = Immutable.ImmutableArray<IForumMsg>;
export type IForumMsgs = Immutable.ImmutableObject<{[index: string]: IForumMsgList}>;

export interface IMessagesState extends Immutable.ImmutableObject<any> {
    forums: Immutable.ImmutableArray<any>;
    dms: {
        [key: string]: IDirectMsg;
    } | {};
    forumMsgs: {
        [key: string]: IForumMsg;
    } | {};
}

export enum MessageActionTypes {
    GET_DIRECT_MESSAGES = 'GET_DIRECT_MESSAGES',
    GET_FORUM_MESSAGES = 'GET_FORUM_MESSAGES',
}
