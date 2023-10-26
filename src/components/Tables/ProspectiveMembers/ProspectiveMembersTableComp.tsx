import ProspectiveMembersTable from "./ProspectiveMembersTable";
import { approvedApplication, pendingApplication } from "../MockData";
//@ts-ignore
import { IndeterminateCheckbox } from "../Checkbox";
import { TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import { Link } from "react-router-dom";
import { acknowledgeApplication, createUserApi, getprospectiveMemberSubmission } from "../../../axios/api-calls";
import { useMutation, useQuery } from "react-query";
import { datefromatter } from "../../../utils/DateFormatter";
import Loading from "../../Loading/Loading";
import Button from "../../Button/Button";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { Form, FormInput } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";
import { generatePassword } from "../../../utils/extraFunction";
export const ProspectiveMembersTableApproved = ({status}:{status:string}) => {
  const { isLoading, isError, data, isFetching } = useQuery(
    ["all-approved-applications",status],
    ()=>getprospectiveMemberSubmission({'application_status':status?status:'approval_in_progress'}),
    {
      // select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );
  const columns = [
    {
      Header: "Company Name",
      accessor: "name_of_company",
    },
    {
      Header: "CAC Number",
      accessor: "cac_registration_number",
    },
   
   
  ];
      
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [isOpenApplicationLetter, setIsOpenApplicationLetter] = useState(false);

  const [currentPropectiveID,setCurrentProspectiveID] = useState(-1)
  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Header: "Application Date",
        accessor: "created_at",
        Cell: ({ row }:any) => (
          <>
            {" "}
            {row.original.created_at?datefromatter(new Date(row.original.created_at as string)):''}
          </>
        ),
      },
      {
        Header: "Status",
        id:'Status',
        accessor: "status",
        Cell: ({ row }:any) => (
          <>
          approved
          </>
        ),
      },
      {
        id: "Click to View",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (
          <TableView>
            {" "}
            <Link
              to={"/prospective-members/details/"+row.original.id}
              style={{
                textDecoration: "none",
                color: "#2b3513",
                fontWeight: 500,
              }}
            >
              Click to View
            </Link>
          </TableView>
        ),
      },
      {
        id: "Generate Letter",
        Header: "Generate Letter",
        Cell: ({ row }:any) => (
          <TableView>
            {" "}
            {status ==='approval_in_progress'?
            <Button
            onClick={e=>{
              setCurrentProspectiveID(row.original.id)
              setIsOpenApplicationLetter(true)
            }}
            styleType='sec'>Generate Letter
            {/* Acknowledgment Letter */}
            </Button>:''
          }
          </TableView>
        ),
      }
      
    ]);
  };


  return (
    <>
    
<OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenApplicationLetter}
        isOpen={isOpenApplicationLetter}
      >
        <div>
          <HandleSendingAcknowledgementLetter  id={currentPropectiveID}/>
        </div>
      </OffCanvas>


    <Loading loading={ isLoading} />
      {/* {isFetching || isLoading ? (
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={data?data:[]}
        customHooks={[tableHooks]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};

export const ProspectiveMembersTablePending = () => {
    const { isLoading, isError, data, isFetching } = useQuery(
      "all-approved-applications",
      ()=>getprospectiveMemberSubmission({'application_status':'approval_in_progress'}),
      {
        // select: (data) => data.data,
        refetchOnWindowFocus: false,
      }
    );


  const columns = [
    {
      Header: "Company Name",
      accessor: "name_of_company",
    },
    {
      Header: "CAC Number",
      accessor: "cac_registration_number",
    },
   
   
  ];
  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Header: "Application Date",
        accessor: "created_at",
        Cell: ({ row }:any) => (
          <>
            {" "}
            {row.original.created_at?datefromatter(new Date(row.original.created_at as string)):''}
          </>
        ),
      },
      {
        Header: "Status",
        id:'Status',
        accessor: "status",
        Cell: ({ row }:any) => (
          <>
          pending
          </>
        ),
      },
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (
          <TableView>
            {" "}
            <Link
              to={"/prospective-members/details/"+row.original.id}
              style={{
                textDecoration: "none",
                color: "#2b3513",
                fontWeight: 500,
              }}
            >
              Click to View
            </Link>
          </TableView>
        ),
      },
    ]);
  };

 

  return (
    <>
    <Loading loading={ isLoading} />

      {/* {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={data?data:[]}
        // tableData={pendingApplication}
        customHooks={[tableHooks,]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};












const HandleSendingAcknowledgementLetter = ({id}:{id?:number})=>{
  const [content,setContent] = useState('')
  const [email,setEmail] = useState('example@gmai.comm')
  const [executivePassword,setExecutivePassword,] = useState<string>()

  const { mutate:acknowle,isLoading:isLoading__acknowle} = useMutation(acknowledgeApplication,{
    'onSuccess':(data)=>{
        toast.success('Application Acknowledge And Letter Sent' , {
          progressClassName: "toastProgress",
          icon: false,
        });
    }
  })


  const {mutate,isLoading} = useMutation(createUserApi,{
    'onSuccess':()=>{
      toast.success('Executive Account Has Been Created')
      toast.warning('Currently Sending Letter To Prospective Member And Alerting Executive Member')
      if(id){
        acknowle({
          id,
          email,
          content,
          'password':executivePassword
        })

      }
    },
    'onError':()=>{
      toast.error('Some Error Occured Could not create Executive Account')
    }
  })
  const onSubmit = ()=>{
    if(!email || !content){
      toast.error("Email or Content are required",);    
      return 
    }
    let password =generatePassword(7).toLowerCase()
    setExecutivePassword(password)
    console.log({password})
    mutate({email,password,'userType':'executive_secretary'})

  }

  return (
    <div>
      <br />
      <h2>Generate Acknowledgment Letter Of Application</h2>
    <br /><br />
      <Loading loading={isLoading||isLoading__acknowle} />
      <FormInput>
        <label>
          Executive Email(Assign to this prospective member)
          <br />
        </label>
          <input
            type={"email"}
            value={email}
            onChange={e=>{
             setEmail(e.target.value) 
            }}
            style={{ backgroundColor: "#fff" }}
          />
      </FormInput>
      <FormInput>
        <label>
          Letter Description*
          <br />
          <textarea
            style={{ backgroundColor: "#fff" }}
            rows={6}
            cols={50}
            value={content}
            onChange={e=>{
              setContent(e.target.value)
            }}
          />
        </label>
      </FormInput>

        <CustomModalButton 
        isDisabled={isLoading}
        clickfn={onSubmit}
        >
        Send & Assign
        </CustomModalButton>
    </div>
  )
}