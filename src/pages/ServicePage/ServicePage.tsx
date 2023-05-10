import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import CreateNewsModal from "../../components/Modals/NewsModal/CreateNewsModal";
import Button from "../../components/Button/Button";




const ServicePage =():React.ReactElement=>{
    const [isOpen, setIsOpen] = useState(false);
    const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  
    return (
        <div>
        <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateNewsModal closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>
      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
          Create Service
        </Button>
        </div>
    )
}

export default ServicePage