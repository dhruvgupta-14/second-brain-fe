import React, { type ReactElement } from 'react'
interface ButtonProps{
  variant:"primary"|"secondary",
  text:string,
  startIcon?:ReactElement,
  onClick?:(e:any)=>void,
  disabled?:boolean
}
const variant={
  "primary":"bg-purple-500 text-white font-medium hover:bg-purple-600 ",
  "secondary":"bg-purple-100 text-purple-400 font-medium hover:bg-purple-200 "
}
const defaultStyle="flex gap-1 py-3 px-2 border rounded-md cursor-pointer"
const Button = (props:ButtonProps) => {
  return (
    <div>
      <button className={`${variant[props.variant]}${defaultStyle}`} onClick={props.onClick} disabled={props.disabled}>
      <span>{props.startIcon}</span>
      {props.text}
    </button>
    </div>
  )
}

export default Button