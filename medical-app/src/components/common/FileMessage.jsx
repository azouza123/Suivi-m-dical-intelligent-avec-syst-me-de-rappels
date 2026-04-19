import { FileText, Image, Download, File } from 'lucide-react'

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FileMessage = ({ msg, isMe }) => {
  const fileUrl = `http://localhost:8081${msg.fileUrl}`
  const isImage = msg.fileType?.startsWith('image/')
  const isPdf = msg.fileType === 'application/pdf'

  const bgClass = isMe
    ? 'bg-purple-600 text-white'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'

  if (isImage) {
    return (
      <div className={`rounded-2xl overflow-hidden max-w-xs ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
        <img
          src={fileUrl}
          alt={msg.fileName}
          className="max-w-full max-h-64 object-cover cursor-pointer"
          onClick={() => window.open(fileUrl, '_blank')}
        />
        <div className={`px-3 py-1.5 flex items-center justify-between gap-2 ${bgClass}`}>
          <span className="text-xs truncate opacity-80">{msg.fileName}</span>
          <a
            href={fileUrl}
            download={msg.fileName}
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 opacity-80 hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={13} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`px-4 py-3 rounded-2xl ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'} ${bgClass} max-w-xs`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isMe ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {isPdf
            ? <FileText size={20} className={isMe ? 'text-white' : 'text-red-500'} />
            : <File size={20} className={isMe ? 'text-white' : 'text-blue-500'} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
            {msg.fileName}
          </p>
          <p className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
            {formatFileSize(msg.fileSize)}
          </p>
        </div>
        <a
          href={fileUrl}
          download={msg.fileName}
          target="_blank"
          rel="noreferrer"
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            isMe
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}
        >
          <Download size={14} />
        </a>
      </div>
    </div>
  )
}

export default FileMessage