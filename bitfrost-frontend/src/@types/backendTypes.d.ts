export interface Project {
  projectTag: string;
  description: string;
  topics: Topic[];
}

export interface Topic {
  uuid: string;
  label: string;
  description: string;
}
