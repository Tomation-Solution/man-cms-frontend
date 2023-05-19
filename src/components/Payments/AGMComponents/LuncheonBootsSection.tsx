import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteExhibitionBoot,
  getAllExhibitionBoots,
  getAllLuncheonPrices,
} from "../../../axios/api-calls";
import {
  ContactContainer,
  ContactMainContainer,
  ExhibitionBootContainer,
} from "../../Modals/Modals.styles";
import Loading from "../../Loading/Loading";
import { FormError, Header } from "../../../globals/styles/forms.styles";
import { formatMoney } from "../../../utils/moneyFormatter";
import Button from "../../Button/Button";
import EditLuncheonPriceModal from "./Modals/EditLuncheonPriceModal";
import ExhibitionEditModal from "./Modals/ExhibitionEditModal";
import { toast } from "react-toastify";
import ExhibitionBootCreateModal from "./Modals/ExhibitionBootCreateModal";

export type ExhibitionBootType = {
  id: number;
  price: string;
  name: string;
  is_occupied: boolean;
  rented_by: number | null;
};
const LuncheonBootsSection = () => {
  const [luncheonModal, setLuncheonModal] = useState(false);
  const [luncheonData, setLuncheonData] = useState<{
    id: number;
    type: string;
    price: number;
  }>();

  const [exhibitionRenameModal, setExhibitionRenameModal] = useState(false);
  const [exhibitionData, setExhibitionData] = useState<ExhibitionBootType>();

  const [exhibitionCreateModal, setExhibitionCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, isError, isFetching, data } = useQuery(
    "luncheon-prices",
    getAllLuncheonPrices,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );

  const bootQueryResult = useQuery(
    "all-exhibition-boots",
    getAllExhibitionBoots,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: deleteBootLoading, mutate } = useMutation(
    deleteExhibitionBoot,
    {
      onMutate: () => {
        toast.info("deleting boot", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("boot deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
        queryClient.invalidateQueries("all-exhibition-boots");
      },
      onError: () => {
        toast.error("failed to delete boot", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const deleteExhibitionBootHandler = (id: number) => {
    mutate(id);
  };

  return (
    <>
      {exhibitionRenameModal && (
        <ExhibitionEditModal
          data={exhibitionData}
          closefn={() => setExhibitionRenameModal(!exhibitionRenameModal)}
        />
      )}

      {exhibitionCreateModal && (
        <ExhibitionBootCreateModal
          closefn={() => setExhibitionCreateModal(!exhibitionCreateModal)}
        />
      )}

      {luncheonModal && (
        <EditLuncheonPriceModal
          luncheonData={luncheonData}
          closefn={() => setLuncheonModal(!luncheonModal)}
        />
      )}
      {isLoading || isFetching ? (
        <Loading loading={isLoading || isFetching} />
      ) : !isError ? (
        <ContactContainer>
          <Header>
            <h1>Luncheon Prices</h1>
          </Header>
          {data.map(
            (
              item: { id: number; type: string; price: number },
              index: number
            ) => (
              <div className="flexed" key={index}>
                {item.type === "member" ? (
                  <>
                    <p>
                      <span className="darkend">Members Luncheon Price: </span>
                      {formatMoney(String(item.price))}
                    </p>
                    <Button
                      isSmall
                      onClick={() => {
                        setLuncheonData(item);
                        setLuncheonModal(!luncheonModal);
                      }}
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="darkend">
                        Exhibitors Luncheon Price:{" "}
                      </span>
                      {formatMoney(String(item.price))}
                    </p>
                    <Button
                      isSmall
                      onClick={() => {
                        setLuncheonData(item);
                        setLuncheonModal(!luncheonModal);
                      }}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            )
          )}
        </ContactContainer>
      ) : (
        <FormError>Can't Fetch Luncheon Data</FormError>
      )}

      <ContactMainContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            styleType={"sec"}
            onClick={() => setExhibitionCreateModal(!exhibitionCreateModal)}
          >
            Create Exhibition Boot
          </Button>
        </div>
        <Loading
          loading={
            bootQueryResult.isLoading ||
            bootQueryResult.isFetching ||
            deleteBootLoading
          }
        />
        {!bootQueryResult.isError && bootQueryResult.data ? (
          <>
            {bootQueryResult.data.map(
              (item: ExhibitionBootType, index: number) => (
                <ContactContainer key={index}>
                  <ExhibitionBootContainer>
                    <div>
                      <p>
                        <span className="darkend">Name: </span>
                        {item.name}
                      </p>

                      <p>
                        <span className="darkend">Price: </span>
                        {formatMoney(item.price)}
                      </p>

                      <p>
                        <span className="darkend">Is Rented Out: </span>
                        {item.is_occupied ? "Yes" : "No"}
                      </p>

                      <p>
                        <span className="darkend">
                          Exhibitor Registration Id of Tenant:{" "}
                        </span>
                        {item.rented_by ? item.rented_by : "Free"}
                      </p>
                    </div>

                    <div>
                      <Button
                        isSmall
                        onClick={() => {
                          setExhibitionData(item);
                          setExhibitionRenameModal(!exhibitionRenameModal);
                        }}
                      >
                        Edit
                      </Button>
                      <br />
                      {!item.is_occupied ? (
                        <Button
                          isSmall
                          onClick={() => deleteExhibitionBootHandler(item.id)}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </ExhibitionBootContainer>
                </ContactContainer>
              )
            )}
          </>
        ) : (
          <FormError>Can't Fetch Exhibition Boots</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default LuncheonBootsSection;
