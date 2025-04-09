interface MaybeHotModule {
  hot?: {
    accept: () => void
    dispose: (cb: VoidFunction) => void
  }
}

// eslint-disable-next-line @next/next/no-assign-module-variable
export declare const module: MaybeHotModule
