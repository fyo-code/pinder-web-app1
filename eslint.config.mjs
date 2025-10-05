// eslint.config.mjs
import next from 'eslint-config-next';

export default [
  // Use Next.js' recommended "core-web-vitals" rules
  ...next().map(cfg => ({
    ...cfg,
    rules: {
      ...(cfg.rules ?? {}),
    },
  })),
];