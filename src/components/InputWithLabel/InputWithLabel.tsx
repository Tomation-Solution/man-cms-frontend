import { FormError, FormInput, FormSelect } from "../../globals/styles/forms.styles"


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


type SelectProp ={
    label:string;
    errorMessage?:string;
    setValue:any,
    options:{option:string;label:string}[];
    containerStyle?: React.CSSProperties;
    formName:string;//should be samme with the  actual yupSchema
}
export const SelectWithLabel = ({label,errorMessage,setValue,options,formName}:SelectProp)=>{

    return (
        <div>
                    <FormSelect>
        <label>
         {label}
          <select
          style={{'width':'100%','backgroundColor':'white'}}
          onChange={e=>{
            if(setValue){
                setValue(formName,e.target.value)
            }
          }}
          >
            <option disabled>select an option</option>
            {
                options.map((data,index)=>(
            <option key={index} value={data.option}>{data.label}</option>
                ))
            }
          </select>
        </label>
      </FormSelect>
                  <FormError><small>
                  {errorMessage}</small></FormError>
        </div>
    )
}