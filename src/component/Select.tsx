import React, { type ReactElement, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  array: string[],
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  placeholder?: string,
  label?: string,
  require?: boolean,
  w?: boolean,
  value?: string,
  disabled?: boolean,
  error?: string,
  startIcon?: ReactElement
}

const Select = (props: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!props.value)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(e.target.value !== "")
    if (props.onChange) {
      props.onChange(e)
    }
  }
  return (
     <div className="flex flex-col gap-1.5 w-full">
       {props.label && (
         <label className={`text-sm font-medium ${props.error ? 'text-red-600' : 'text-slate-700'} ${props.require ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}`}>
           {props.label}
         </label>
       )}
       <div className="relative">
         {props.startIcon && (
           <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${isFocused ? 'text-slate-600' : 'text-slate-400'}`}>
              {props.startIcon}
           </div>
         )}
         <select
           className={`
             w-full px-4 py-3 bg-white border-2 transition-all duration-200 ease-in-out
             rounded-lg text-gray-800 text-base appearance-none cursor-pointer
             ${props.startIcon ? 'pl-10' : 'pl-4'} pr-10
             ${props.error 
               ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
               : isFocused 
                 ? 'border-blue-300 ring-2 ring-blue-100 shadow-sm' 
                 : 'border-slate-200 hover:border-slate-300'
             }
             focus:outline-none focus:shadow-md
           `}
           onChange={props.onChange}
           onFocus={() => setIsFocused(true)}
           onBlur={() => setIsFocused(false)}
           value={props.value}
           required={props.require}
         >
           <option value="" disabled hidden>{props.placeholder}</option>
           {props.array.map((item, index) => (
             <option value={item.toLowerCase()} key={index}>{item}</option>
           ))}
         </select>
         <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${isFocused ? 'rotate-180 text-slate-600' : 'text-slate-400'}`}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <polyline points="6,9 12,15 18,9"></polyline>
           </svg>
         </div>
       </div>
     </div>
   );
 };
 

export default Select