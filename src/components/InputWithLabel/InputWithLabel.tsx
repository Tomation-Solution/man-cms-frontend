import { FormError, FormInput } from "../../globals/styles/forms.styles"





type Prop ={
    label:string;
    placeholder?:string;
    isTextArea?:boolean;
    register?:any;
    errorMessage?:string;
    type?:'password'|'text'|'file';
    containerStyle?: React.CSSProperties;
    // containerStyle:
  }


const InputWithLabel = ({label,isTextArea,register,type='text',placeholder,errorMessage,containerStyle={}}:Prop)=>{


    return(
        <div
        style={containerStyle}//this is where u controll the with from using percent
        >
                    <FormInput
                    
                    >
              <label>
                {label}
                <br />
                {
                    !isTextArea?
                    <input
                    style={{ backgroundColor: "#fff" ,'width':'100%'}}
                      type={type}
                    placeholder={placeholder?placeholder:`"please enter name of ${label}`}
                      {...register}
                    
                    />:
                    <textarea cols={30} rows={10}
                    style={{ backgroundColor: "#fff" ,'width':'100%'}}
                      type={type}
                    placeholder={placeholder?placeholder:`"please enter name of ${label}`}
                      {...register}
                    ></textarea>
                }
              </label>
            </FormInput>
            <FormError><small>
            {errorMessage}</small></FormError>
        </div>
    )
}
export default InputWithLabel