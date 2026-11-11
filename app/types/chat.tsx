export interface Document {
  id: string;
  name: string;
  content: string;
}

export type RoleType = "user" | "bot"; 

export interface Message {
  id: string;
  role: RoleType;
  content: string;
}
