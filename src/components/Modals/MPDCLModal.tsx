import { Form } from "../../globals/styles/forms.styles"
import Button from "../Button/Button"
import InputWithLabel, { SelectWithLabel } from "../InputWithLabel/InputWithLabel"
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { createMpdclApi, updateMpdclApi } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { useEffect } from "react";

const schema = yup.object({
    type:yup.string().required(),
    header:yup.string().required(),
    description:yup.string().required(),
    image:yup.mixed(),
    id:yup.number(),
})

export type MPDCLType = yup.InferType<typeof schema>
const MPDCLModal =()=>{
  const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
      } = useForm<MPDCLType>({
        resolver: yupResolver(schema),});
    const {mutate,isLoading} = useMutation(createMpdclApi,{
        'onSuccess':()=>{
            reset()
            queryClient.invalidateQueries("mpdcl-list");
            toast.success("MPDCL saved", {
                progressClassName: "toastProgress",
                icon: false,
              });
        }
    })

        const onSubmitHandler = (data: MPDCLType) =>{
            mutate({data})
        }
        console.log(errors)
        if(isLoading) return   <Loading loading={isLoading} />
    return (
        <Form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
          
            <h2
            style={{ padding: "1rem 0" }}
            >Create MPDCL</h2>
            <br />
            <br />
            <InputWithLabel 
            label="header"
            register={register('header')}
            errorMessage={errors.header?.message}
            />
            <SelectWithLabel
            setValue={setValue}
            errorMessage={errors.type?.message}
            formName='type'
                label="Type"
                options={[
                    {'label':'RENEWABLE ENERGY','option':'RENEWABLE_ENERGY'},
                    {'label':'POWER FACILITATION ','option':'POWER_FACILITATION'},
                ]}
            />
            <InputWithLabel 
            isTextArea={true}
            label="description"
            errorMessage={errors.description?.message}

            register={register('description')}
            />
            
            <InputWithLabel 
            // errorMessage={errors.image?.message}

                type="file"
                label="image"
                register={register('image')}
            />

            <Button styleType="whiteBg" >
                Create
            </Button>
        </Form>
    )
}

export default MPDCLModal



export const MPDCLModalUpdate =({previous_data}:{previous_data:MPDCLType})=>{
    const queryClient = useQueryClient();
  
      const {
          register,
          control,
          handleSubmit,
          setValue,
          formState: { errors },
        } = useForm<MPDCLType>({
          resolver: yupResolver(schema),});
      const {mutate,isLoading} = useMutation(updateMpdclApi,{
          'onSuccess':()=>{
              queryClient.invalidateQueries("mpdcl-list");
              toast.success("MPDCL updated", {
                  progressClassName: "toastProgress",
                  icon: false,
                });
          }
      })
  
          const onSubmitHandler = (data: MPDCLType) =>{
              mutate({data})
          }

          useEffect(()=>{
            if(previous_data){
                setValue('type',previous_data.type)
                setValue('header',previous_data.header)
                setValue('description',previous_data.description)
                setValue('image',previous_data.image)
                setValue('id',previous_data.id)
            }
          },[previous_data])

        if(isLoading) return   <Loading loading={isLoading} />

      return (
          <Form
          onSubmit={handleSubmit(onSubmitHandler)}
          >
              {/* <Loading loading={isLoading} /> */}
              <h2
              style={{ padding: "1rem 0" }}
              >Update MPDCL</h2>
              <br />
              <br />
              <InputWithLabel 
              label="header"
              register={register('header')}
              errorMessage={errors.header?.message}
              />
              <SelectWithLabel
              setValue={setValue}
              errorMessage={errors.type?.message}
              formName='type'
                  label="Type"
                  options={[
                      {'label':'RENEWABLE ENERGY','option':'RENEWABLE_ENERGY'},
                      {'label':'POWER FACILITATION ','option':'POWER_FACILITATION'},
                  ]}
              />
              <InputWithLabel 
              isTextArea={true}
              label="description"
              errorMessage={errors.description?.message}
  
              register={register('description')}
              />
              
              <InputWithLabel 
              // errorMessage={errors.image?.message}
  
                  type="file"
                  label="image"
                  register={register('image')}
              />
  
              <Button styleType="whiteBg" >
                  update
              </Button>
          </Form>
      )
  }