import { sql } from "@/lib/db";
import { getMasterConfig, masterDataConfigs } from "@/features/master-data/config";
import type {
  MasterField,
  MasterOption,
  MasterOptionMap,
  MasterRecord,
} from "@/features/master-data/types";

type RecordValue = string | number | boolean | null;

function tableIdentifier(tableName: string) {
  return sql.unsafe(`"${tableName}"`);
}

function columnIdentifier(columnName: string) {
  return sql.unsafe(`"${columnName}"`);
}

function getWritableFields(slug: string) {
  const config = getMasterConfig(slug);
  if (!config) throw new Error("Jenis data master tidak ditemukan");
  return config.fields;
}

function normalizeValue(field: MasterField, value: FormDataEntryValue | null): RecordValue {
  const textValue = typeof value === "string" ? value.trim() : "";

  if (field.type === "boolean") {
    return textValue === "true";
  }

  if (field.type === "number" || field.type === "money" || field.type === "select") {
    if (!textValue) return null;
    return Number(textValue);
  }

  return textValue || null;
}

export function formDataToMasterValues(slug: string, formData: FormData) {
  const values: Record<string, RecordValue> = {};

  for (const field of getWritableFields(slug)) {
    values[field.name] = normalizeValue(field, formData.get(field.name));
  }

  return values;
}

export function validateMasterValues(slug: string, values: Record<string, RecordValue>) {
  const config = getMasterConfig(slug);
  if (!config) return "Jenis data master tidak ditemukan.";

  for (const field of config.fields) {
    const value = values[field.name];

    if (field.required && (value === null || value === "" || Number.isNaN(value))) {
      return `${field.label} wajib diisi.`;
    }
  }

  return null;
}

export async function listMasterRecords(slug: string): Promise<MasterRecord[]> {
  const config = getMasterConfig(slug);
  if (!config) throw new Error("Jenis data master tidak ditemukan");

  const rows = await sql<MasterRecord[]>`
    SELECT *
    FROM ${tableIdentifier(config.tableName)}
    ORDER BY id DESC
  `;

  return rows;
}

export async function countMasterRecords() {
  const counts = await Promise.all(
    masterDataConfigs.map(async (config) => {
      const rows = await sql<{ total: number }[]>`
        SELECT COUNT(*)::int AS total
        FROM ${tableIdentifier(config.tableName)}
      `;

      return [config.slug, rows[0]?.total ?? 0] as const;
    }),
  );

  return Object.fromEntries(counts) as Record<string, number>;
}

export async function createMasterRecord(
  slug: string,
  values: Record<string, RecordValue>,
) {
  const config = getMasterConfig(slug);
  if (!config) throw new Error("Jenis data master tidak ditemukan");

  const columns = Object.keys(values);
  const data = Object.fromEntries(columns.map((column) => [column, values[column]]));

  const rows = await sql<MasterRecord[]>`
    INSERT INTO ${tableIdentifier(config.tableName)} ${sql(data, columns)}
    RETURNING *
  `;

  return rows[0];
}

export async function updateMasterRecord(
  slug: string,
  id: number,
  values: Record<string, RecordValue>,
) {
  const config = getMasterConfig(slug);
  if (!config) throw new Error("Jenis data master tidak ditemukan");

  const columns = Object.keys(values);
  const assignments = columns
    .map((column) => sql`${columnIdentifier(column)} = ${values[column]}`)
    .reduce((previous, current) => sql`${previous}, ${current}`);

  const rows = await sql<MasterRecord[]>`
    UPDATE ${tableIdentifier(config.tableName)}
    SET ${assignments}, diperbarui_pada = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function deleteMasterRecord(slug: string, id: number) {
  const config = getMasterConfig(slug);
  if (!config) throw new Error("Jenis data master tidak ditemukan");

  await sql`
    DELETE FROM ${tableIdentifier(config.tableName)}
    WHERE id = ${id}
  `;
}

async function listOptionsByQuery(query: string): Promise<MasterOption[]> {
  return sql.unsafe(query);
}

export async function getMasterOptions(): Promise<MasterOptionMap> {
  const [penggunaCustomer, penggunaCourier, kota, jenisPengiriman] = await Promise.all([
    listOptionsByQuery(`
      SELECT id::text AS value, name || ' - ' || email AS label
      FROM users
      WHERE role = 'customer'
      ORDER BY name ASC
    `),
    listOptionsByQuery(`
      SELECT id::text AS value, name || ' - ' || email AS label
      FROM users
      WHERE role = 'courier'
      ORDER BY name ASC
    `),
    listOptionsByQuery(`
      SELECT id::text AS value, nama_kota || ', ' || provinsi AS label
      FROM kota
      ORDER BY nama_kota ASC
    `),
    listOptionsByQuery(`
      SELECT id::text AS value, nama_jenis AS label
      FROM jenis_pengiriman
      ORDER BY nama_jenis ASC
    `),
  ]);

  return {
    pengguna_customer: penggunaCustomer,
    pengguna_courier: penggunaCourier,
    kota,
    jenis_pengiriman: jenisPengiriman,
  };
}
