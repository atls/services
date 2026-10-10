/// <reference types="@atls/raijin/types" />

import type { Temporal as TemporalPolyfill } from '@js-temporal/polyfill'

declare global {
  namespace Temporal {
    type Duration = TemporalPolyfill.Duration
  }
}
