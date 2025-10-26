import { defineConfig } from "@hey-api/openapi-ts";

const services = {
  ai: {
    input: "http://localhost:8080/openapi.json",
    output: "./src/api/career-ai-service",
  },
  career: {
    input: "http://localhost:8080/api/v1/career-service/v3/api-docs",
    output: "./src/api/career-service",
  },
};

const serviceName = process.env.SERVICE_NAME || "ai";
const service = services[serviceName as keyof typeof services];

if (!service) {
  throw new Error(
    `Unknown service: ${serviceName}. Available: ${Object.keys(services).join(
      ", "
    )}`
  );
}

export default defineConfig({
  input: service.input,
  output: service.output,
  plugins: [
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
    "@hey-api/typescript",
    {
      name: "@hey-api/client-fetch",
      baseUrl: "http://localhost:8080",
    },
  ],
});
