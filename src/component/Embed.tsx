import { useEffect } from "react";
interface EmbedProps {
  type: 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note' | 'upload',
  link?: string,
  content?: string
}

export default function Embed(props: EmbedProps) {
  useEffect(() => {
    //@ts-ignore
    if (props.type === 'tweet' && window.twttr) {
      //@ts-ignore
      window.twttr.widgets.load();
    }
    //@ts-ignore
    if (props.type === 'instagram' && window.instgrm) {
      //@ts-ignore
      window.instgrm.Embeds.process();
    }
  }, [props.type]);

  // Consistent container class with fixed dimensions
  const containerClass = "w-full h-[400px] flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden";

  if (props.type === "image") {
    return (
      <div className={containerClass}>
        <img
          src={props.link}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  if (props.type === "tweet") {
    return (
      <div className={containerClass}>
        <div className="overflow-y-auto w-full h-full">
          <blockquote className="twitter-tweet" data-theme="light" data-width="100%">
            <a href={props.link} target="_blank" rel="noopener noreferrer"></a>
          </blockquote>
        </div>
      </div>
    );
  }

  if (props.type === "instagram") {
    return (
      <div className={containerClass}>
        <div className="overflow-y-auto w-full h-full">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={props.link}
            data-instgrm-version="14"
          ></blockquote>
        </div>
      </div>
    );
  }

  if (props.type === "youtube") {
    const embedLink = `https://www.youtube.com/embed/${props.link?.split('/').pop()?.split('?')[0]}`
    // console.log(props.link)
    return (
      <div className={`${containerClass} aspect-video relative`}>
        <iframe
          className="w-full h-full border-0"
          title="YouTube video player"
          aria-label="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          src={embedLink}
        />

        {/* Transparent overlay to redirect */}
        <div
          onClick={() => window.open(props.link, '_blank')}
          className="absolute inset-0 z-10 cursor-pointer"
          title="Open in YouTube"
        />
      </div>

    );
  }

  if (props.type === "doc") {
    return (
      <div className={`${containerClass} p-6`}>
        <div className="text-center">
          <div className="text-blue-600 text-6xl mb-4">📄</div>
          <div className="text-lg font-semibold text-gray-800 mb-2">Document</div>
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline break-all text-sm px-4 py-2 bg-blue-50 rounded-lg inline-block"
          >
            Open Document
          </a>
          <div className="mt-4 text-sm text-gray-500">
            Click to view the document
          </div>
        </div>
      </div>
    );
  }

  if (props.type === "note") {
    return (
      <div className={`${containerClass} p-6`}>
        <div className="w-full h-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-y-auto">
          <div className="flex items-center mb-3">
            <div className="text-yellow-600 text-2xl mr-2">📝</div>
            <div className="text-lg font-semibold text-gray-800">Note</div>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {props.content || "No content available"}
          </div>
        </div>
      </div>
    );
  }

  if (props.type === "upload") {
    const isImage = props.link?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isPDF = props.link?.match(/\.pdf$/i);

    return (
      <div className={`${containerClass} p-6`}>
        <div className="text-center">
          {isImage ? (
            <img
              src={props.link}
              alt="Uploaded Image"
              className="w-full max-w-xs mx-auto rounded shadow-md mb-4"
            />
          ) : isPDF ? (
            <iframe
              src={props.link}
              className="w-full max-w-md h-64 mx-auto border rounded mb-4"
              title="PDF Preview"
            />
          ) : (
            <div className="text-green-600 text-6xl mb-4">📁</div>
          )}

          <div className="text-lg font-semibold text-gray-800 mb-2">Uploaded File</div>

          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline break-all text-sm px-4 py-2 bg-blue-50 rounded-lg inline-block"
          >
            Open File
          </a>

          <div className="mt-4 text-sm text-gray-500">
            Click to view the uploaded file
          </div>
        </div>
      </div>
    );
  }


  // Fallback for unknown types
  return (
    <div className={`${containerClass} p-6`}>
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">❓</div>
        <div className="text-lg font-semibold text-gray-800 mb-2">Unknown Content Type</div>
        <div className="text-sm text-gray-500">
          Content type "{props.type}" is not supported
        </div>
      </div>
    </div>
  );
}