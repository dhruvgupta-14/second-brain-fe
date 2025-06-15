import { useEffect } from "react";

interface embedProps {
  type: 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc',
  link: string,
}

export default function Embed(props: embedProps) {
  //  useEffect(() => {
  //   const loadScript = (src: string) => {
  //     if (!document.querySelector(`script[src="${src}"]`)) {
  //       const script = document.createElement("script");
  //       script.src = src;
  //       script.async = true;
  //       document.body.appendChild(script);
  //     }
  //   };

  //   if (props.type === 'tweet') {
  //     loadScript("https://platform.twitter.com/widgets.js");
  //   }
  //   if (props.type === 'instagram') {
  //     loadScript("https://www.instagram.com/embed.js");
  //   }
  // }, [props.type]);
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

  const containerClass = "w-full flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden";

  if (props.type === "image") {
    return (
      <div className={`${containerClass} min-h-[300px] max-h-[500px]`}>
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
      <div className={`${containerClass} min-h-[400px]`}>
        <blockquote className="twitter-tweet" data-theme="light" data-width="100%">
          <a href={props.link} target="_blank" rel="noopener noreferrer"></a>
        </blockquote>
      </div>
    );
  }

  if (props.type === "instagram") {
    return (
      <div className={`${containerClass} min-h-[500px]`}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={props.link}
          data-instgrm-version="14"
          style={{ maxWidth: '100%', width: '100%' }}
        ></blockquote>
      </div>
    );
  }
if (props.type === "youtube") {
    return (
      <div className={`${containerClass} aspect-video`}>
        <iframe 
          src={props.link}
          title="YouTube video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
   if (props.type === "doc") {
    return (
      <div className={`${containerClass} min-h-[200px] p-6`}>
        <div className="text-center">
          <div className="text-blue-600 text-lg mb-4">📄 Document</div>
          <a 
            href={props.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline break-all"
          >
            {props.link}
          </a>
          <div className="mt-4 text-sm text-gray-500">
            Click to open document
          </div>
        </div>
      </div>
    );
  } 
}