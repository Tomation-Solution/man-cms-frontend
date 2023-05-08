const acceptedExtensions = [".jpeg", ".jpg", ".png", ".gif"];
const accptedFileExtensions = [
  ".doc",
  ".docx",
  ".ods",
  ".odt",
  ".pdf",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
];

export function validateFileExtension(file: any, isImage: boolean = true) {
  if (typeof file === "string") {
    if (file.startsWith("data:image")) return true;
  }
  try {
    const fileName = file[0].name;
    const extension = "." + fileName.split(".").pop().toLowerCase();
    if (isImage) {
      return acceptedExtensions.includes(extension);
    }
    return accptedFileExtensions.includes(extension);
  } catch (e) {
    return false;
  }
}
