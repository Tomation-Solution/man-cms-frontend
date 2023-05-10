import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";




const schema = yup.object({
    name:yup.string().required(),
    type:yup.string().required(),
    description:yup.string().required(),
    image:yup.mixed(),
})


type FormType = yup.InferType<typeof schema>

const ServicePageModals =():React.ReactElement=>{
    const { register, handleSubmit, formState: { errors } } = useForm<FormType>({
        resolver: yupResolver(schema)
      });

      return(
        <div>

        </div>
      )
}


export default ServicePageModals