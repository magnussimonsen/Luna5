/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // Use `object` for props and raw bindings to avoid the `{}` empty-object lint warning
  // Keep `any` for the third generic (emits/slots) but disable the rule above for this file only
  const component: DefineComponent<object, object, any>
  export default component
}
