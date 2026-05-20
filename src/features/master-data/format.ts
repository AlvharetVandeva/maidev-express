import type { MasterOptionMap, MasterRelationKey } from "@/features/master-data/types";

export function getMasterOptionLabel(
  options: MasterOptionMap,
  relation: MasterRelationKey | undefined,
  value: string | number | boolean | null,
) {
  if (!relation || value === null || value === undefined || value === "") return value;

  return options[relation]?.find((option) => option.value === String(value))?.label ?? value;
}
