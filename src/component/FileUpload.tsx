import { useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  accept?: string
  require?: boolean
  onChange?: (e: any) => void
  label?: string
  error?: string
  disabled?: boolean
  maxSize: number // in MB
}

const FileUpload = (props: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
      alert(`File must be smaller than ${props.maxSize}MB`)
      return
    }

    setSelectedFile(file)
    props.onChange?.(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (props.disabled) return

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
      alert(`File must be smaller than ${props.maxSize}MB`)
      return
    }

    setSelectedFile(file)

    const mockEvent = {
      target: {
        files: e.dataTransfer.files
      }
    }

    props.onChange?.(mockEvent)
  }

  const handleClick = () => {
    if (!props.disabled) {
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement
      fileInput?.click()
    }
  }

  const removeFile = () => {
    setSelectedFile(null)

    const dataTransfer = new DataTransfer()
    const mockEvent = { target: { files: dataTransfer.files } }
    props.onChange?.(mockEvent)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {props.label && (
        <label className={`text-sm font-medium ${props.error ? 'text-red-600' : 'text-slate-700'} ${props.require ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}`}>
          {props.label}
        </label>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ease-in-out cursor-pointer
          ${props.disabled
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
            : props.error
              ? 'border-red-200 bg-red-50 hover:border-red-300'
              : isDragOver || isFocused
                ? 'border-blue-300 bg-blue-50 shadow-sm'
                : selectedFile
                  ? 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  : 'border-slate-200 bg-white hover:border-slate-300'
          }
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!props.disabled) setIsDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
      >
        <Upload className={`mx-auto h-12 w-12 mb-4 ${props.disabled ? 'text-slate-300' : isDragOver || isFocused ? 'text-blue-500' : 'text-slate-400'}`} />

        <div className="space-y-2">
          <p className={`text-sm ${props.disabled ? 'text-slate-400' : 'text-slate-600'}`}>
            {selectedFile ? selectedFile.name : 'Drop file here or '}
            {!props.disabled && !selectedFile && <span className="text-blue-600 font-medium">browse</span>}
          </p>

          {props.maxSize && (
            <p className="text-xs text-slate-500">
              Max file size: {props.maxSize}MB
            </p>
          )}

          <input
            type="file"
            id="file-upload-input"
            className="hidden"
            accept={props.accept}
            onChange={handleFileChange}
            disabled={props.disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      {selectedFile && (
        <div className="mt-3">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!props.disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {props.error && (
        <span className="text-sm text-red-600 font-medium">{props.error}</span>
      )}
    </div>
  )
}

export default FileUpload
