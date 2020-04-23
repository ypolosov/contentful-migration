import * as path from "path";
import * as os from "os";

// TODO: I'm ugly, maybe change me
const homedir = process.env.NODE_ENV === "test" ? "/tmp" : os.homedir();
const configPath = path.resolve(homedir, ".contentfulrc.json");

interface CasinoClientConfig {
  brandName?: string;
  templateName?: string;
  companyName?: string;
}

interface ClientConfig extends CasinoClientConfig {
  accessToken?: string;
  spaceId?: string;
  environmentId?: string;
}

function getFileConfig(): ClientConfig {
  try {
    const config = require(configPath);
    return config.cmaToken ? { accessToken: config.cmaToken } : {};
  } catch (e) {
    return {};
  }
}

function getEnvConfig(): ClientConfig {
  const envKey = "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN";
  return process.env[envKey] ? { accessToken: process.env[envKey] } : {};
}

function getArgvConfig({
  spaceId,
  environmentId = "master",
  accessToken,
  brandName,
  templateName,
  companyName,
}): ClientConfig {
  const config = {
    spaceId,
    environmentId,
    accessToken,
    brandName,
    templateName,
    companyName,
  };

  if (!config.accessToken) {
    delete config.accessToken;
  }

  return config;
}

function getConfig(argv) {
  const fileConfig = getFileConfig();
  const envConfig = getEnvConfig();
  const argvConfig = getArgvConfig(argv || {});

  return Object.assign(fileConfig, envConfig, argvConfig);
}

export default getConfig;

export { getConfig, ClientConfig, CasinoClientConfig };
