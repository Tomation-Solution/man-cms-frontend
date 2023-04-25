import React from 'react'
import {ButtonStyle} from './Button.style'


export type ButtonProp =React.PropsWithChildren<{
  'styleType'?:'pry'|'sec'|'whiteBg',
  'style'?:{
    [Key:string]:string,
  },
  onClick?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
  isLoading?:boolean;
}>


// export type PropStyle={
//   'styleType'?:'pry'|'sec',
//   'width'?:string,

// }
const Button = ({children,styleType='pry',isLoading=false,...rest}:ButtonProp):React.ReactElement=>{


  return (
    <ButtonStyle styleType={styleType} disabled={isLoading}   

    whileTap={{ scale: 0.9 }}
    animate={{
    transition: {
        type:'spring',
        stiffness:70
    }
    }}
      {...rest}>
      {isLoading?'Loading...':children}
    </ButtonStyle>
  )
}




export default Button