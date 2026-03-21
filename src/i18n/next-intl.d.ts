import type errors from "../../messages/en/errors.json"
import type months from "../../messages/en/months.json"
import type login from "../../messages/en/login.json"

//import the other modules here
declare global {
  interface IntlMessages {
    login: typeof login
    errors: typeof errors
    months: typeof months
  }
}
