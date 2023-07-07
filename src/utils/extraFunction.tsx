export type StyleTpe =  {
    'style'?:{
      [Key:string]:string,
    }
  }
  
  export const createExternalStyle = (props:StyleTpe)=>{
    let styles =''
    if(props.style){
      const all_keys = Object.keys(props.style)
      all_keys.map((key=>{
        if(props.style){
          styles = styles+` ${key}:${props.style[key]}`
        }
        return key
      }))
    } 
    return styles
  }
  
  




export  const   generatePassword = (length:number):string=>{
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var password = "";
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }