export type LanguageMode = 'bm' | 'jawi';

export interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
  nullable?: boolean;
  unique?: boolean;
  defaultValue?: string;
  description: string;
}

export interface TableDef {
  id: string;
  name: string;
  description: string;
  columns: ColumnDef[];
  indexes: string[];
}

export interface ApiEndpoint {
  id: string;
  module: 'auth' | 'orders' | 'merchants' | 'riders' | 'admin';
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  title: string;
  description: string;
  authRequired: boolean;
  authType?: 'Customer' | 'Rider' | 'Merchant' | 'Admin' | 'Public';
  requestBody?: string;
  responseExample?: string;
}

export interface WireframeScreen {
  id: string;
  titleBM: string;
  titleJawi: string;
  purpose: string;
  uiHighlights: {
    orangeBg: string[];
    whiteBg: string[];
    orangeTextOrAccents: string[];
  };
  keyComponents: string[];
}
