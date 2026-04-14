import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

type EditorProps = {
  onChange?: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
};

export default function BlockNoteEditor({ onChange, initialContent, editable = true }: EditorProps) {
  let initialBlocks = undefined;
  if (initialContent) {
    try {
      initialBlocks = JSON.parse(initialContent);
    } catch (e) {
      initialBlocks = [
        {
          type: "paragraph",
          content: initialContent,
        },
      ];
    }
  }

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  return (
    <div className="w-full h-full pb-32">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
        onChange={() => {
          if (onChange) {
            onChange(JSON.stringify(editor.document));
          }
        }}
      />
    </div>
  );
}
