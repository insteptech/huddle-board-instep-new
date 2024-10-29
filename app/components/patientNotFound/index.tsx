'use client'
import TableRow from '@mui/material/TableRow';
import { QuestionMarkIcon, SearchNotFoundIcon } from '../../images/index';
import {
  MainBox,
  MainBoxHeading,
  MainBoxSubHeading,
  StyledTableCenter,
  ClearButton,
} from '../../styles/customStyle';
import Image from 'next/image';
import { ImageListItem } from '@mui/material';
import Image1 from "../../images/Illustration.png";
import Image2 from "../../images/no_appointment.png";

const PatientNotFound = (props: any) => {
  const { icon, resetFilters, searchTerm } = props;

  return (
    <>
      {icon ? (
        <TableRow sx={{ height: "530px" }}>
          <StyledTableCenter
            sx={{ textAlign: "center", color: "#000" }}
            colSpan={6}
          >
            <MainBox>

              <Image
                src={Image1} // Path to your image
                alt="Description of image" // Accessible description
              />
              <MainBoxHeading sx={{ textAlign: "center" }} variant="h2">
                Sorry, no results found for '{searchTerm}'. Please check the <br /> spelling or try different search criteria.
              </MainBoxHeading>

              <ClearButton onClick={() => resetFilters()}>Clear Search</ClearButton>
            </MainBox>
          </StyledTableCenter>
        </TableRow>
      )
        :
        (
          <TableRow>
            <StyledTableCenter
              sx={{ textAlign: "center", color: "#000" }}
              colSpan={6}
            >
              <MainBox >
                <Image
                  src={Image2} // Path to your image
                  alt="Description of image" // Accessible description
                />
                <MainBoxHeading sx={{ textAlign: "center" }} variant="h2">
                  There are no scheduled appointments for today. Please <br /> check back later or adjust your search criteria.
                </MainBoxHeading>
              </MainBox>
            </StyledTableCenter>
          </TableRow>
        )}
    </>
  );
};


export default PatientNotFound;