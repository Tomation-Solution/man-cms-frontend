import SeeDetails from "../Modals/ContactModals/SeeDetails";
import { useQuery } from "react-query";
import { contactGetAll } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import { ContactMainContainer } from "../Modals/Modals.styles";

export interface DataType {
  id: number;
  name: string;
  phone_no: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const Contacts = () => {
  const { isLoading, isFetching, data, isError } = useQuery(
    "all-contacts",
    contactGetAll,
    { select: (data) => data.data, refetchOnWindowFocus: false }
  );

  return (
    <div>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: DataType) => (
              <SeeDetails data={item} key={item.id} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Contacts</FormError>
        )}
      </ContactMainContainer>
    </div>
  );
};

export default Contacts;
