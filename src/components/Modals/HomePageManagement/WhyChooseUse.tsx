import { Form } from "../../../globals/styles/forms.styles"
import Button from "../../Button/Button"
import InputWithLabel, { SelectWithLabel } from "../../InputWithLabel/InputWithLabel"
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { createMpdclApi, createWhyChooseUsApi, updateMpdclApi, updateWhyChooseUsApi } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { useEffect } from "react";



const schema = yup.object({
    heading:yup.string().required(),
    image:yup.mixed(),
    description:yup.string().required(),
    id:yup.number()
})

export type WhyChooseUsType = yup.InferType<typeof schema>


export const WhyChooseUsModal = ()=>{
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WhyChooseUsType>({
    resolver: yupResolver(schema),});

    const {isLoading,mutate} = useMutation(createWhyChooseUsApi,{
        'onSuccess':(data)=>{
            queryClient.invalidateQueries('whychooseus')
            toast.success("Created", {
                progressClassName: "toastProgress",
                icon: false,
              });
        }
    })
    const onSubmitHandler = (data: WhyChooseUsType) =>{
        mutate({data})
    }

    
    if(isLoading) return <Loading loading={isLoading} />
    return (
        <Form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
            <h2
            style={{ padding: "1rem 0" }}
            >Create Content</h2>
            <br />
            <br />
            <InputWithLabel 
            label="header"
            register={register('heading')}
            errorMessage={errors.heading?.message}
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



export const UpdateWhyChooseUsModal = ({data}:{data:WhyChooseUsType})=>{
    const queryClient = useQueryClient();
  
    const {
      register,
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<WhyChooseUsType>({
      resolver: yupResolver(schema),});
  
      const {isLoading,mutate} = useMutation(updateWhyChooseUsApi,{
          'onSuccess':(data)=>{
              queryClient.invalidateQueries('whychooseus')
              toast.success("Updated", {
                  progressClassName: "toastProgress",
                  icon: false,
                });
          }
      })
      const onSubmitHandler = (data: WhyChooseUsType) =>{
          mutate({data})
      }
  
      
      useEffect(()=>{
        if(data){
            setValue('heading',data.heading)
            setValue('description',data.description)
            setValue('image',data.image)
            setValue('id',data.id)
        }
      },[data])
      if(isLoading) return <Loading loading={isLoading} />
      return (
          <Form
          onSubmit={handleSubmit(onSubmitHandler)}
          >
              
              <h2
              style={{ padding: "1rem 0" }}
              >Create Content</h2>
              <br />
              <br />
              <InputWithLabel 
              label="header"
              register={register('heading')}
              errorMessage={errors.heading?.message}
              />
            
              <InputWithLabel 
              isTextArea={true}
              label="description"
              errorMessage={errors.description?.message}
  
              register={register('description')}
              />
            <img src={data.image?data.image:''}
            style={{'width':'300px','margin':'0 auto'}}
            alt="" />
              <InputWithLabel 
              // errorMessage={errors.image?.message}
  
                  type="file"
                  label="image"
                  register={register('image')}
              />
  
              <Button styleType="whiteBg" >
                  Update
              </Button>
          </Form>
      )
  }