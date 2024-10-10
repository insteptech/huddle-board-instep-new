'use client'
import React from 'react'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { getCurrentDateFormatted } from '@/app/utils/helper';
import { DateRangePicker } from '@iroomit/react-date-range';
import { CalenderSection, DataRangeBox } from '@/app/styles/customStyle';

const Calender = (props: any) => {
  const {range, dateRangeHandleChange} = props;
  const [anchorEl, setAnchorEl] = useState(false);

  const handleClick = () => {
    setAnchorEl(!anchorEl);
  };

  return (
    <CalenderSection>
      <Button
        className=""
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
      >
        <CalendarMonthOutlinedIcon sx={{ marginRight: '10px' }} />{ }{getCurrentDateFormatted(range.startDate)}
      </Button>
      <Box
        className={anchorEl ? 'CustomCalender' : 'CustomCalenderhide'}
      >
        <Box sx={{
          padding: '0'
        }}>

          <DataRangeBox>
            <DateRangePicker className='DateRangePickerComp'
              ranges={[range]}
              onChange={(newRange: { [x: string]: any }) => {
                if (typeof newRange === 'object' && 'selection' in newRange) {
                  const { startDate, endDate } = newRange.selection;
                  dateRangeHandleChange({
                    startDate,
                    endDate,
                    key: 'selection'
                  });
                } else {

                }
              }}
            />
          </DataRangeBox>
        </Box>
      </Box>
    </CalenderSection>
  )
}

export default Calender
