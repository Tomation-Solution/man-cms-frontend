import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import styles from "./TextRichEditor.module.css";

type Props = {
  editorState: any;
  setEditorState: React.Dispatch<React.SetStateAction<any>>;
  header?: string;
};

function TextRichEditor({ editorState, setEditorState, header }: Props) {
  const toolbarOptions = [
    // ["link", "image"], //option for inserting images here
    // [{ color: [] }, { background: [] }],

    ["bold", "italic", "underline", "strike"], // toggled buttons
    // ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }], // list types
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }], //Option for header types available

    // [{ font: [] }], //Option for the changing the font
    [{ align: [] }], // Option for editing alignment

    ["clean"],
  ];

  const module = {
    toolbar: toolbarOptions,
  };

  return (
    <div className={styles.textRichEditorContainer}>
      <h1 className={styles.header}>{header}</h1>
      <ReactQuill
        modules={module}
        theme="snow"
        value={editorState}
        onChange={setEditorState}
      />
    </div>
  );
}

export default TextRichEditor;
