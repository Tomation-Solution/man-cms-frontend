import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { datefromatter } from "../../utils/DateFormatter";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    AddMoreButton,
    SelectImage,
  } from "../../globals/styles/CustomFormComponents";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel, { SelectWithLabel } from "../InputWithLabel/InputWithLabel";
import { useForm, useFieldArray } from "react-hook-form";
import { CustomModalButton } from "../../globals/styles/CustomFormComponents";
import {
    Form,
  } from '../../globals/styles/forms.styles';
import Button from "../Button/Button";
import { createMrcApi, updateMrcApi } from "../../axios/api-calls";
import { toast } from "react-toastify";


const schema= yup.object({
    name:yup.string().required(),
    description:yup.string().required(),
    small_text:yup.string().required(),
    items:yup.array().of(yup.object({
        'value':yup.string()
    })),
    id:yup.number()
})
type FormType = yup.InferType<typeof schema>
export const MrcModal =()=>{
  const queryClient = useQueryClient();

    const { register,control, handleSubmit, setValue,formState: { errors } } = useForm<FormType>({
        resolver: yupResolver(schema),
       defaultValues:{
        items:[{'value':'Joint Venture Business Propositions'}]
       }
      });
      const {append,remove,fields} = useFieldArray({control,'name':'items'})
      const {mutate,isLoading} = useMutation(createMrcApi,{
        'onSuccess':(data)=>{
            queryClient.invalidateQueries("mrc-list");
            console.log({data})
            toast.success(`${data.name} created!`, {
                progressClassName: "toastProgress",
                icon: false,
              });

        },
        'onError':(err:any)=>{
            console.log({err})
        },
    })
      const onSubmitHandler = (data: FormType) => {
        console.log('Data =>',data)
        mutate({...data,'items':data.items?data.items.map((d,index)=>{
            if(d?.value){return d.value}
            return ''
        }):[]})

      }

      
    return (
        <Form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
             <h2 style={{'padding':'1rem 0'}}>Create Sectoral Group</h2>
                <Loading loading={isLoading} />
            <InputWithLabel 
            label="Name"
            register={register('name')}
            errorMessage={errors.name?.message}
            />
            <br />
            <InputWithLabel 
            label="Small Text"
            register={register('small_text')}
            errorMessage={errors.small_text?.message}
            />
            <br />
            <InputWithLabel 
            label="Description"
            register={register('description')}
            errorMessage={errors.description?.message}
            isTextArea={true}
            />
            <br />
            <label htmlFor="">Items</label>
            {
                fields.map((field,index)=>(
                    <div style={{'display':'flex','alignItems':'center',}}>
                        <InputWithLabel 
                        label=""
                        register={register(`items.${index}.value`)}
                        containerStyle={{'width':'80%'}}
                        // errorMessage={errors.items/?.message}
                        />
                        <Button
                            onClick={e=>{
                                remove(index)
                            }}
                        styleType="whiteBg"  style={{'margin':'0 10px'}}> 
                            delete
                        </Button>
                    </div>
                ))
            }
            <AddMoreButton
              justify="center"
              click={() =>{
                append({'value':'hello'})
              }}
            >
              Add More Items
            </AddMoreButton>
            <div>
              <CustomModalButton
            //   isDisabled={isLoading}
              >
                CREATE
              </CustomModalButton>
            </div>
        </Form>
    )
}




export const MrcUpdateModal    =({mrc}:{mrc:FormType})=>{
  const queryClient = useQueryClient();

    const { register,control, handleSubmit, setValue,formState: { errors } } = useForm<FormType>({
        resolver: yupResolver(schema),
       
      });
      const {append,remove,fields} = useFieldArray({control,'name':'items'})
      const {mutate,isLoading} = useMutation(updateMrcApi,{
        'onSuccess':(data)=>{
            queryClient.invalidateQueries("mrc-list");
            console.log({data})
            toast.success(`${data.name} created!`, {
                progressClassName: "toastProgress",
                icon: false,
              });

        },
        'onError':(err:any)=>{
            console.log({err})
        },
    })
      const onSubmitHandler = (data: FormType) => {
        console.log('Data =>',data)
        mutate({...data,'items':data.items?data.items.map((d,index)=>{
            if(d?.value){return d.value}
            return ''
        }):[]})

      }

      useEffect(()=>{
        if(mrc){
          setValue('name',mrc.name)
          setValue('description',mrc.description)
          setValue('small_text',mrc.small_text)
          if(mrc.items){
            //@ts-ignore
            setValue('items',mrc.items.map((d)=>{
              if(d){return{'value': d}}
              return {'value':'d'}
            }))
            console.log(mrc.items,'items')
          }
         if(mrc.id){
           setValue('id',mrc.id)
         }
        }
        // setValue('name',mrc.items)
      },[mrc])
    return (
        <Form
        onSubmit={handleSubmit(onSubmitHandler)}
        >
             <h2 style={{'padding':'1rem 0'}}>Create Sectoral Group</h2>
                <Loading loading={isLoading} />
            <InputWithLabel 
            label="Name"
            register={register('name')}
            errorMessage={errors.name?.message}
            />
            <br />
            <InputWithLabel 
            label="Small Text"
            register={register('small_text')}
            errorMessage={errors.small_text?.message}
            />
            <br />
            <InputWithLabel 
            label="Description"
            register={register('description')}
            errorMessage={errors.description?.message}
            isTextArea={true}
            />
            <br />
            <label htmlFor="">Items</label>
            {
                fields.map((field,index)=>(
                    <div style={{'display':'flex','alignItems':'center',}}>
                        <InputWithLabel 
                        label=""
                        register={register(`items.${index}.value`)}
                        containerStyle={{'width':'80%'}}
                        // errorMessage={errors.items/?.message}
                        />
                        <Button
                            onClick={e=>{
                                remove(index)
                            }}
                        styleType="whiteBg"  style={{'margin':'0 10px'}}> 
                            delete
                        </Button>
                    </div>
                ))
            }
            <AddMoreButton
              justify="center"
              click={() =>{
                append({'value':'hello'})
              }}
            >
              Add More Items
            </AddMoreButton>
            <div>
              <CustomModalButton
            //   isDisabled={isLoading}
              >
                Update
              </CustomModalButton>
            </div>
        </Form>
    )
}