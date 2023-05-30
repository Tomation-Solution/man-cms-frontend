export const convertImageToBase64String = (file: any) => {
  if (!(typeof file === "object")) return file;
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file[0]);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};


export function base64ToImage(base64String:string):string {
  // Remove data type prefix if present
  if (base64String.includes('data:image')) {
    base64String = base64String.split(',')[1];
  }

  // Create an image element
  var img = document.createElement('img');

  // Set the image source to the base64 string
  // img.src =

  return 'data:image/png;base64,' + base64String;
}