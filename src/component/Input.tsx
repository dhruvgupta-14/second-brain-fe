
import { type ReactElement, useState } from 'react'

interface InputProps {
  type: string,
  placeholder: string,
  require?: boolean,
  w?: boolean,
  onChange?: (e: any) => void,
  startIcon?: ReactElement,
  endIcon?: ReactElement,
  label?: string,
  value?: string,
  disabled?: boolean,
  error?: string
}

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!props.value)

  const handleChange = (e: any) => {
    setHasValue(e.target.value.length > 0)
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
      <div className="relative flex items-center">
        {props.startIcon && (
          <div className={`absolute left-3 z-10 ${isFocused ? 'text-slate-600' : 'text-slate-400'}`}>
            {props.startIcon}
          </div>
        )}
        <input
          type={props.type}
          placeholder={props.placeholder}
          className={`
             w-full px-4 py-3 bg-white border-2 transition-all duration-200 ease-in-out
             rounded-lg text-gray-800 text-base placeholder:text-gray-400
             ${props.startIcon ? 'pl-10' : 'pl-4'}
             ${props.error
              ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : isFocused
                ? 'border-blue-300 ring-2 ring-blue-100 shadow-sm'
                : hasValue
                  ? 'border-slate-200 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
            }
             focus:outline-none focus:shadow-md
           `}
          required={props.require}
          value={props.value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {props.endIcon && (
          <div className={`absolute right-3 z-10 ${isFocused ? 'text-slate-600' : 'text-slate-400'}`}>
            {props.endIcon}
          </div>)
        }
      </div>
      {props.error && (
        <span className="text-sm text-red-600 font-medium">{props.error}</span>
      )}
    </div>
  )
}

export default Input