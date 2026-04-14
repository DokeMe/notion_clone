import dynamic from "next/dynamic";

const EditorWrapper = dynamic(() => import("./BlockNoteEditor"), {
  ssr: false,
  loading: () => <p className="p-4 text-gray-500">Načítání editoru...</p>,
});

export default EditorWrapper;
