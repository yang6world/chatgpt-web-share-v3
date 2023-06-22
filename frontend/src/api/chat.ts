import axios from 'axios';

import { ConversationSchema } from '@/types/schema';

import ApiUrl from './url';

export function getAllConversationsApi(fetch_all = false) {
  return axios.get<Array<ConversationSchema>>(ApiUrl.Conversation, {
    params: { fetch_all },
  });
}

export function getConversationHistoryApi(conversation_id: string) {
  return axios.get<any>(ApiUrl.Conversation + '/' + conversation_id);
}

export function deleteConversationApi(conversation_id: string) {
  return axios.delete(ApiUrl.Conversation + '/' + conversation_id);
}

export function clearAllConversationApi() {
  return axios.delete(ApiUrl.Conversation);
}

export function vanishConversationApi(conversation_id: string) {
  return axios.delete(ApiUrl.Conversation + '/' + conversation_id + '/vanish');
}

export function setConversationTitleApi(conversation_id: string, title: string) {
  return axios.patch<ConversationSchema>(ApiUrl.Conversation + '/' + conversation_id, null, {
    params: { title },
  });
}

export function generateConversationTitleApi(conversation_id: string, message_id: string) {
  return axios.patch<ConversationSchema>(ApiUrl.Conversation + '/' + conversation_id + '/gen_title', null, {
    params: { message_id },
  });
}

export type AskInfo = {
  message: string;
  new_title?: string;
  conversation_id?: string;
  parent_id?: string;
  model_name?: string;
  is_public?: boolean;
  timeout?: number;
};

export function getAskWebsocketApiUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.host}${import.meta.env.VITE_API_BASE_URL}conv`;
  console.log('getAskWebsocketApiUrl', url);
  return url;
}

export function assignConversationToUserApi(conversation_id: string, username: string) {
  return axios.patch(`${ApiUrl.Conversation}/${conversation_id}/assign/${username}`);
}
