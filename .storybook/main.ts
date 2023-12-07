import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/preset-ant-design",
    "@storybook/addon-styling-webpack",
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpack(config: any, options: any) {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "sass-loader" },
      ],
    });
    return config;
  },
  staticDirs: ['../src/locales'],
};
export default config;
