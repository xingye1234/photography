//自定义获取焦点指令
export const vFocus = {
  mounted:(el:HTMLElement)=>{
    el.querySelector("input")?.focus();
  }
}