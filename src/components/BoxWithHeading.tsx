import React from "react"


type Prop = React.PropsWithChildren<{
    heading:string;
}>
const  BoxWithHeading =({children,heading}:Prop)=>{
    

    return(
        <div
        style={{'paddingLeft':'20px ','paddingTop':'1rem'}}
        >
       <h2><small>{heading}</small></h2>
        {children}
        </div>
    )
}

export default BoxWithHeading