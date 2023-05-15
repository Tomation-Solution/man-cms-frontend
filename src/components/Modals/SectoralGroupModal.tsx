import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import Button from "../../components/Button/Button";
import {createUpdateSectoralGroupApi} from '../../axios/api-calls'

const SectoralGroupTabSchema = yup.object({
    header:yup.string().required(),
    image:yup.mixed(),
    id:yup.number()
  })
  export type SectoralGroupTabSchemaType = yup.InferType<typeof SectoralGroupTabSchema>
  

  // data:SectoralGroupTabSchemaType
const CreateSectoralGroupModal = ()=>{
  const queryClient = useQueryClient();

    const {
      register,
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<SectoralGroupTabSchemaType>({
      resolver: yupResolver(SectoralGroupTabSchema),
  });
    const {isLoading:creating,mutate} = useMutation(createUpdateSectoralGroupApi,{
        'onSuccess':(data)=>{
          console.log({'success download':data})
      queryClient.invalidateQueries("get-sectoral");

        }
      })
    const onSubmitHandler =(data: SectoralGroupTabSchemaType)=>{
        console.log({'SUbmittedData':data})
        mutate(data)
      }
    return (
        <form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Loading loading={creating} />
          <InputWithLabel 
          label="header"
          register={register('header')}
          />
          <br />
          <InputWithLabel 
          label="Image"
          type="file"
          register={register('image')}
          />
          <br />
          <Button styleType="whiteBg"  style={{'width':'100%'}}>
            Create
          </Button>
        </form>
    )

}

export default CreateSectoralGroupModal




export const UpdateGroupModal = ({data}:{data?:SectoralGroupTabSchemaType})=>{
  const queryClient = useQueryClient();

    const {
      register,
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<SectoralGroupTabSchemaType>({
      resolver: yupResolver(SectoralGroupTabSchema),
  });
    const {isLoading:creating,mutate} = useMutation(createUpdateSectoralGroupApi,{
        'onSuccess':(data)=>{
          queryClient.invalidateQueries("get-sectoral");

        }
      })
      
    const onSubmitHandler =(data: SectoralGroupTabSchemaType)=>{
        console.log({'SUbmittedData':data})
        mutate(data)
      }

    useEffect(()=>{
      if(data){
        setValue('header',data.header)
        setValue('id',data.id)
        setValue('image',data.image)
      }
    },[data])
    return (
        <form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Loading loading={creating} />
          <InputWithLabel 
          label="header"
          register={register('header')}
          />
          <br />
          <InputWithLabel 
          label="Image"
          type="file"
          register={register('image')}
          />
          <br />
          <Button styleType="whiteBg"  style={{'width':'100%'}}>
            Update
          </Button>
        </form>
    )

}
