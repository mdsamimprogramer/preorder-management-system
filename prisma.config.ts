import { defineConfig } from "prisma";

export default defineConfig({
  datasources: {
    db: {
      provider: "sqlite",
      url: "file:./prisma/dev.db",
    },
  },
  generators: {
    client: {
      provider: "prisma-client-js",
    },
  },
});
