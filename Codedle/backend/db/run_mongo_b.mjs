import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const env = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const equalsIndex = line.indexOf("=");
      if (equalsIndex === -1) {
        continue;
      }

      const key = line.slice(0, equalsIndex).trim();
      let value = line.slice(equalsIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }

    return env;
  } catch {
    return {};
  }
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendDir = dirname(scriptDir);
const repoRoot = dirname(backendDir);
const envCandidates = [
  resolve(repoRoot, ".env"),
  resolve(backendDir, ".env"),
  resolve(backendDir, "db", ".env"),
];

for (const candidate of envCandidates) {
  const env = loadEnvFile(candidate);
  if (env.MONGO_URI && !process.env.MONGO_URI) {
    process.env.MONGO_URI = env.MONGO_URI;
  }
}

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI. Add it to a .env file as MONGO_URI=your_mongo_connection_string");
  process.exit(1);
}

const scriptPath = resolve(backendDir, "db", "mongo_b").replace(/\\/g, "/");
const result = spawnSync(
  "mongosh",
  ["--quiet", process.env.MONGO_URI, "--eval", `load(${JSON.stringify(scriptPath)})`],
  {
  stdio: "inherit",
  env: process.env,
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);