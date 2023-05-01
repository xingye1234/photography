import { getId } from "./login"
export const isLogin = ()=>{
  return !getId()
}