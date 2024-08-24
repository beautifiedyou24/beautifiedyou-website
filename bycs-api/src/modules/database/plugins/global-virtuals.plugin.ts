import { Schema } from "mongoose";

export function addGlobalVirtuals(schema: Schema) {
  // Check and merge existing toJSON options
  const toJSONOptions = schema.get("toJSON") || {};

  if (typeof toJSONOptions.virtuals === "undefined") {
    toJSONOptions.virtuals = true;
  }
  schema.set("toJSON", toJSONOptions);

  // Check and merge existing toObject options
  const toObjectOptions = schema.get("toObject") || {};

  if (typeof toObjectOptions.virtuals === "undefined") {
    toObjectOptions.virtuals = true;
  }
  schema.set("toObject", toObjectOptions);
}
