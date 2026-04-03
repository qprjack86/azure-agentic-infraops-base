#!/usr/bin/env node
/**
 * Validates instruction-file frontmatter.
 */

import path from "node:path";
import { getInstructions } from "./_lib/workspace-index.mjs";

const ALLOWED_FIELDS = ["description", "applyto"];
const DISPLAY_FIELDS = ["description", "applyTo"];

let errors = 0;

function validateInstruction(instruction) {
  const relativePath = path.relative(process.cwd(), instruction.path);
  const frontmatter = instruction.frontmatter;

  if (!frontmatter) {
    console.error(`❌ ${relativePath}: missing YAML frontmatter`);
    errors++;
    return;
  }

  for (const field of ALLOWED_FIELDS) {
    if (!frontmatter[field]) {
      console.error(
        `❌ ${relativePath}: missing required field '${DISPLAY_FIELDS[ALLOWED_FIELDS.indexOf(field)]}'`,
      );
      errors++;
    }
  }

  const unknownFields = Object.keys(frontmatter).filter((field) => !ALLOWED_FIELDS.includes(field));
  if (unknownFields.length > 0) {
    console.error(`❌ ${relativePath}: unknown frontmatter fields: ${unknownFields.join(", ")}`);
    errors++;
  }
}

console.log("🔍 Auditor Instruction Frontmatter Validator\n");

for (const [, instruction] of getInstructions()) {
  validateInstruction(instruction);
}

if (errors > 0) {
  console.error(`\n❌ ${errors} instruction validation error(s)`);
  process.exit(1);
}

console.log("✅ All instruction files valid");