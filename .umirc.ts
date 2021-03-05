import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Blog',
  mode: 'site',
  base: '/blog',
  publicPath: '/blog/',
  locales: [['zh-CN', '中文']],
  // more config: https://d.umijs.org/config
});
