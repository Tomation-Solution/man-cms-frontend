import Button from "../Button/Button";
import { EmptyStateContainer } from "./EmptyState.styles";

type Props = {
  header: string;
  subHeader?: string;
  refreshHandler?: any;
};

function EmptyState({ header, subHeader, refreshHandler }: Props) {
  return (
    <EmptyStateContainer>
      <h1>{header}</h1>
      <p>{subHeader}</p>
      {refreshHandler && <Button onClick={refreshHandler}>Refresh Page</Button>}
    </EmptyStateContainer>
  );
}

export default EmptyState;
