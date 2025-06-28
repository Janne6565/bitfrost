export interface Project {
  projectTag: string;
  description: string;
  topics: string[];
}

export interface Topic {
  uuid: string;
  label: string;
  description: string;
  project: string;
  subscriptions: string[];
  messages: string[];
}

export interface Job {
  uuid: string;
  messageId: string;
  topicId: string;
  subscriptionId: string;
  status: JobState;
  earliestExecution: number;
  retryCount: number;
  httpExchangeLog: HttpExchangeLog;
}

export interface HttpExchangeLog {
  uri: string;
  method: string;
  requestHeadersJson: string;
  requestBody: string;
  statusCode: number;
  responseHeadersJson: string;
  responseBody: string;
  timestamp: string; // ISO 8601 string, e.g., "2025-06-26T09:54:08.812848Z"
}

export interface Message {
  uuid: string;
  projectTag: string;
  topicId: string;
  date: string;
  message: string;
}

export interface PublicUser {
  uuid: string;
  name: string;
}

export interface Subscription {
  uuid: string;
  state: SubscriptionState;
  callbackUrl: string;
  topic: string;
  requestingProjectTag: string;
  requestedProjectTag: string;
}

export interface User {
  uuid: string;
  email: string;
  name: string;
}

export enum JobState {
  FAILED = "FAILED",
  WAITING = "WAITING",
  DONE = "DONE",
}

export enum SubscriptionState {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
}
