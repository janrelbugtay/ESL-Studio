import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { ViewState } from "../types";

export function BubbleSentencePro({
  onViewChange,
}: {
  onViewChange: (view: ViewState) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="w-full h-full flex flex-col -mx-4 md:-mx-8 -my-4 md:-my-8 relative">
      <div className="p-4 bg-white border-b flex items-center shadow-sm z-10">
        <button
          onClick={() => onViewChange("home")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <h1 className="ml-4 font-black text-xl text-slate-800">
          Bubble Sentence Formation Pro
        </h1>
      </div>

      <iframe
        ref={iframeRef}
        src="/bubble-sentence.html"
        className="w-full flex-1 border-none bg-slate-50"
        title="Bubble Sentence Formation Pro"
      />
    </div>
  );
}
