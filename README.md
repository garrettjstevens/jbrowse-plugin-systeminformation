# jbrowse-plugin-systeminformation

This is a basic JBrowse 2 plugin that demonstrates how you can have a plugin
that has both JBrowse Web and JBrowse Desktop builds, with the JBrowse Desktop
build having extra desktop-specific functionality.

On the web, this plugin displays a bit of basic system information like browser
version, system OS, and CPU architecture (based on `window.userAgent`).

On desktop, there is also additional information displayed about the CPU and
memory of the system. It uses the package `systeminformation`, which is a
package that does not run in the browser, but is able to run on the desktop app.

Here is a basic outline of how to create a plugin with desktop-specific
functionality:

- Enable the CJS build by either passing the environment variable `JB_CJS=true`
  to `yarn build`/`yarn start` or by modifying the default options in
  `rollup.config.js`.
- Add the CJS build to the plugin definition in `jbrowse_config.json`.
- Any code that only should be run on desktop should be guarded by an
  `isElectron` check.
  - This includes any libraries (including Node.js builtin libraries like `fs`)
    that should only be loaded on desktop. This means you will need to the
    asynchronous inline `import()` to load these.
  - See an example in
  [`SystemInformationView.tsx`](./src/SystemInformationView/components/SystemInformationView.tsx) where
  `import('systeminformation')` is used.
