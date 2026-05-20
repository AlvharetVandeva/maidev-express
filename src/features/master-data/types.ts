export type MasterFieldType =
  | "text"
  | "email"
  | "number"
  | "money"
  | "textarea"
  | "boolean"
  | "select";

export type MasterRelationKey =
  | "pengguna_customer"
  | "pengguna_courier"
  | "kota"
  | "jenis_pengiriman";

export type MasterField = {
  name: string;
  label: string;
  type: MasterFieldType;
  required?: boolean;
  relation?: MasterRelationKey;
  table?: boolean;
};

export type MasterConfig = {
  slug: string;
  title: string;
  description: string;
  tableName: string;
  codeField: string;
  fields: MasterField[];
};

export type MasterRecord = {
  id: number;
  [key: string]: string | number | boolean | null;
};

export type MasterOption = {
  value: string;
  label: string;
};

export type MasterOptionMap = Partial<Record<MasterRelationKey, MasterOption[]>>;
