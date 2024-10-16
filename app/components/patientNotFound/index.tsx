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

const PatientNotFound = (props: any) => {
    const { icon, resetFilters } = props;
  
    return (
      <>
        {icon ? (
          <TableRow sx={{height:"100vh"}}>
            <StyledTableCenter
              sx={{ textAlign: "center", color: "#000" }}
              colSpan={6}
            >
              <MainBox>
                <QuestionMarkIcon />
                <MainBoxHeading variant="h2">
                  We can't seem to find the patient you are looking for.
                </MainBoxHeading>
                <MainBoxSubHeading>
                  Modify your search criteria and search again.
                </MainBoxSubHeading>
                <ClearButton onClick={()=>resetFilters()}>Clear Search</ClearButton>
              </MainBox>
            </StyledTableCenter>
          </TableRow>
        ) : (
          <TableRow>
            <StyledTableCenter
              sx={{ textAlign: "center", color: "#000" }}
              colSpan={6}
            >
              <MainBox>
                <SearchNotFoundIcon />
                <MainBoxHeading variant="h2">
                  No Appointments for today.
                </MainBoxHeading>
                <MainBoxSubHeading>
                  Try refreshing the page after some time.
                </MainBoxSubHeading>
              </MainBox>
            </StyledTableCenter>
          </TableRow>
        )}
      </>
    );
  };
  
  
  export default PatientNotFound;