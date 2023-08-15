import { AxiosError } from "axios";

export type StyleTpe = {
  style?: {
    [Key: string]: string;
  };
};

export const createExternalStyle = (props: StyleTpe) => {
  let styles = "";
  if (props.style) {
    const all_keys = Object.keys(props.style);
    all_keys.map((key) => {
      if (props.style) {
        styles = styles + ` ${key}:${props.style[key]}`;
      }
      return key;
    });
  }
  return styles;
};

export const generatePassword = (length: number): string => {
  var charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const isFileListValidator = (value: any) => {
  if (!value) {
    return false;
  }

  if (
    typeof value !== "string" &&
    value instanceof FileList &&
    value.length !== 0
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * A error handling wrapper for async operations, don't modify my function, just make your's tot prevent code breaks
 *
 * @param asyncfn The async API calling function
 * @returns Promise<any>
 */
export const tryCatch = (asyncfn: any) => async (payload: any) => {
  try {
    return await asyncfn(payload);
  } catch (error: any) {
    throw new AxiosError(error);
  }
};
