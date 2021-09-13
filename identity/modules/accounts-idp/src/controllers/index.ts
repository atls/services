import { RegistrationController } from './registration.controller'
import { VerificationController } from './verification.controller'
import { RecoveryController }     from './recovery.controller'
import { SettingsController }     from './settings.controller'
import { SessionController }      from './session.controller'
import { LogoutController }       from './logout.controller'
import { LoginController }        from './login.controller'
import { IndexController }        from './index.controller'
import { ErrorController }        from './error.controller'

export const controllers = [
  RegistrationController,
  VerificationController,
  RecoveryController,
  LogoutController,
  LoginController,
  SessionController,
  SettingsController,
  IndexController,
  ErrorController,
]

export * from './registration.controller'
export * from './verification.controller'
export * from './recovery.controller'
export * from './settings.controller'
export * from './session.controller'
export * from './logout.controller'
export * from './login.controller'
export * from './index.controller'
export * from './error.controller'
