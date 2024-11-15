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
import { useEffect, useState } from 'react';

const PatientNotFound = (props: any) => {

  const Customstyles = {
    objectFit: "contain",
  };

  const { icon, resetFilters, searchTerm } = props;

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {icon ? (
        <>
         <TableRow sx={{height:'10px', backgroundColor:"#f3f7fc" , }} >
          <StyledTableCenter
            sx={{ textAlign: "center", color: "#000", padding:"5px !important" }}
            colSpan={6}
          >
           
          </StyledTableCenter>
        </TableRow>

        <TableRow >
          <StyledTableCenter
            sx={{ textAlign: "center", color: "#000" , height:windowSize.height < 600 ? '225px' : '425px'}}
            colSpan={6}
          >
            <MainBox>

              <Image
              style={{
                objectFit: "contain" as React.CSSProperties["objectFit"], // Explicitly cast the type
                height:windowSize.height < 600 ? '100px' : '',

              }}
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
        </>
      )
        :
        (
          <>
           <TableRow sx={{height:'2px', backgroundColor:"#f3f7fc", padding:"5px !important"}} >
          <StyledTableCenter
            sx={{ textAlign: "center", color: "#000" , padding:"5px !important"  }}
            colSpan={6}
          >
           
          </StyledTableCenter>
        </TableRow>
          <TableRow>
            <StyledTableCenter
              sx={{ textAlign: "center", color: "#000", height:windowSize.height < 600 ? '225px' : '425px' }}
              colSpan={6}
            >
              <MainBox >
                <Image
                style={{
                  objectFit: "contain" as React.CSSProperties["objectFit"], // Explicitly cast the type
                  height:windowSize.height < 600 ? '100px' : '',

                }}
                  src={Image2} // Path to your image
                  alt="Description of image" // Accessible description
                />
                <MainBoxHeading sx={{ textAlign: "center" }} variant="h2">
                  There are no scheduled appointments for today. Please <br /> check back later or adjust your search criteria.
                </MainBoxHeading>
              </MainBox>
            </StyledTableCenter>
          </TableRow>
          </>
        )}
    </>
  );
};


export default PatientNotFound;