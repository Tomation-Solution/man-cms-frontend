import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BASE_URL } from "../../axios/axios-utils";
import { useRef } from "react";

const listModules = {
  toolbar: {
    container: [
      [{ list: "bullet" }], // Only allow bullet lists
    ],
  },
  keyboard: {
    bindings: {
      enter: {
        key: 13,
        handler: function () {
          // Prevent entering content outside the list
          const quill = (window as any)?.quill;
          const format = quill.getFormat();
          if (!format.list) {
            quill.format("list", "bullet");
          }
        },
      },
    },
  },
};

const listFormats = ["list", "bold", "italic", "underline", "strike"]; // Only allow bullet lists

const modules = {
  toolbar: {
    container: [
      [{ font: [] }], // Custom fonts
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headings
      ["bold", "italic", "underline", "strike"], // Text styling
      [{ color: [] }, { background: [] }], // Text & background colors
      [{ script: "sub" }, { script: "super" }], // Subscript & superscript
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      [{ align: [] }], // Text alignment
      ["blockquote", "code-block"], // Blockquote & Code block
      ["link", "video"], // Insert links & videos
      [{ direction: "rtl" }], // Right-to-left text
      ["image"], // Custom image upload button
      ["clean"], // Remove formatting
    ],
    // handlers: {
    //   image: handleImageUpload, // Custom image upload function
    // },
  },
  clipboard: {
    matchVisual: false, // Prevents auto-formatting when pasting
  },
  keyboard: {
    bindings: {
      // Example: Ctrl + B for bold
      bold: {
        key: "B",
        ctrlKey: true,
        handler: () => {
          const quill = (window as any)?.quill;
          quill.format("bold", true);
        },
      },
    },
  },
};

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
  "direction",
];

export default function AdvancedEditor({ value, onChange, onlyList }: any) {
  const quillRef = useRef<ReactQuill | null>(null); // Store Quill instance

  return (
    <>
      {onlyList && (
        <small>
          ⚠️ Important:
          <br />
          Please enable the list mode by clicking the <b>list icon ( • )</b> in
          the editor toolbar before typing. This ensures your content displays
          correctly.
        </small>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={onlyList ? listModules : modules}
        formats={onlyList ? listFormats : formats}
        style={{ background: "white", color: "black" }}
      />
    </>
  );
}
