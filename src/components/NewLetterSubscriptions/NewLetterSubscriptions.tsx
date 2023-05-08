import React from "react";
import { FormError, Header } from "../../globals/styles/forms.styles";
import { ContactMainContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { useQuery } from "react-query";
import { newLetterGetAll } from "../../axios/api-calls";
import NewLetterSubscriptionsItems, {
  NewLetterSubscriptionsType,
} from "./NewLetterSubscriptionsItems";

const NewLetterSubscriptions = () => {
  const { isLoading, isFetching, isError, data } = useQuery(
    "all-newletter-subscriptions",
    newLetterGetAll,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );

  return (
    <>
      <Header>
        <h1>NewsLetter Subscriptions</h1>
      </Header>

      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: NewLetterSubscriptionsType) => (
              <NewLetterSubscriptionsItems data={item} key={item.id} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch NewLetterSubscriptions</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default NewLetterSubscriptions;
