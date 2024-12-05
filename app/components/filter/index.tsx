'use client'
import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useDispatch, useSelector } from 'react-redux';
import Radio from '@mui/material/Radio';
import List from '@mui/material/List';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TuneIconimage from "../../images/filterIcon.png"
import { auditLog } from '@/app/redux/actions/appointment';
import {
  BoxFilter,
  FilterButtons,
  BoxFilterLeft,
  BoxFilterRightMid,
  BoxFilterRight,
  TableCellHd,
  TableCellTd,
  CheckboxInner,
  LoaderBox,
  TableDataList,
  TableData,
  RadioMain,
} from '../../styles/customStyle';
import SaveFilterModal from '@/app/components/saveFilterModal';
import { AppDispatch, AppState } from '@/app/redux/store';
import { emptyAppointmentList, updateFilter } from '@/app/redux/slices/appointment';
import { createAppointmentFilter, deleteSelectedFilterDetail, getSelectedFilterList, updateAppointmentFilter } from '@/app/redux/actions/appointment';
import { toast } from 'react-toastify';
import DeleteFilterModal from '../deleteFilterModal';
import { formatDates, DateFormatter } from '@/app/utils/helper';

function FilterButton(props: any) {
  const { getAppointmentFiltersData, selectedStatus, setEmptySearch, setSelectedStatus, date, handleAddEventData, isFilterApplied, appointmentFiltersData, setMainLoader, isFilterDataLoading, loadMoreAppointment, filters, selectedFilterList, setSelectedVisitType, setSelectedScreening, setSelectedProviders, setAnchorEl, anchorEl, selectedVisitType, selectedScreening, selectedProviders, resetFilters, getFilterDetail, selectedSavedFilterUuid, setIsFilterApplied } = props;
  const { patient_screening, provider, visit_type } = appointmentFiltersData || {};

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [isSavedFilterSettingClicked, setIsSavedFilterSettingClicked] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState<any>({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const selectedFilterDetail = useSelector((state: AppState) => state.appointment.selectedFilterDetail);
  const [filterName, setFilterName] = React.useState(isEditModalOpen ? selectedFilterDetail?.name : " ");



  const statusKeys = [
    { name: "Cancelled" },
    { name: "Not Cancelled" }
  ];

  const handleStatusSelection = (pro: { name: string }) => {
    setSelectedStatus(pro.name);
  };



  const modalToggle = () => {
    setIsModalOpen(!isModalOpen);
  }
  useEffect(() => {
    if (isEditModalOpen) {
      setFilterName(selectedFilterDetail?.name || '');
    } else {
      setFilterName('');
    }
  }, [selectedFilterDetail, isEditModalOpen]);


  const handleInput = (data: any) => {

    setFilterName(data?.target.value);
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setIsFilterApplied(true);
    getAppointmentFiltersData();
    setIsSavedFilterSettingClicked(false);
    setEmptySearch(true)
  };

  const isEmptyFilter = () => {
    if (selectedVisitType.length === 0 && selectedScreening.length === 0 && selectedProviders.length === 0 && selectedStatus === null) {
      return true;
    } return false;
  }

  const handleVisitTypeFilterClick = (filter: any) => {
    const index = selectedVisitType.indexOf(filter);
    if (index === -1) {
      setSelectedVisitType([...selectedVisitType, filter]);
    } else {
      const updatedFilters = [...selectedVisitType];
      updatedFilters.splice(index, 1);
      setSelectedVisitType(updatedFilters);
    }
  }

  const handleScreeningFilterClick = (filter: any) => {
    const index = selectedScreening.indexOf(filter);
    if (index === -1) {
      setSelectedScreening([...selectedScreening, filter]);
    } else {
      const updatedFilters = [...selectedScreening];
      updatedFilters.splice(index, 1);
      setSelectedScreening(updatedFilters);
    }
  }

  const handleProvidersFilterClick = (filter: any) => {
    const index = selectedProviders.indexOf(filter.uuid);
    if (index === -1) {
      setSelectedProviders([...selectedProviders, filter.uuid]);
    } else {
      const updatedFilters = [...selectedProviders];
      updatedFilters.splice(index, 1);
      setSelectedProviders(updatedFilters);
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilters = () => {

    let status = selectedStatus === "Cancelled" ? true : false;

    const filtersData = {
      ...filters,
      visit_types: selectedVisitType,
      providers_uuids: selectedProviders,
      screening: selectedScreening,
      page: 1,
      page_size: 10,
      show_cancelled_appointments: status
    };
    setMainLoader(true);
    setIsFilterApplied(true);
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filtersData, "FRONTEND_FILTER_CLICK_FILTER_APPLIED_SUCCESS");
    setAnchorEl(null);
    setEmptySearch(true)
  }

  const createFilterModal = (isEdit: boolean = false) => {
    modalToggle();
    if (isEdit) setIsEditModalOpen(true);
  }




  const createFilter = (isEdit: boolean = false) => {

    const formattedDates = DateFormatter(date, date);

    const payload = {
      filter_name: filterName,
      visit_type: selectedVisitType,
      screening: selectedScreening,
      provider: selectedProviders,
      appointment_start_date: formattedDates.start,
      appointment_end_date: formattedDates.end,
    };

    if (isEdit) {
      dispatch(updateAppointmentFilter({ action: payload, uuid: selectedFilterDetail?.uuid })).then((e) => {
        if (e?.payload) {
          toast.success(e?.payload?.message);
          setIsModalOpen(false);
          dispatch(getSelectedFilterList());
          resetFilters(true);
          handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter updated Successfully", "Frontend Filter updated Successfully")
        }

        else {
          handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter updated Successfully", "Frontend Filter updated Successfully")
        }
      });
    } else {
      dispatch(createAppointmentFilter(payload)).then((e) => {
        if (e?.payload) {
          toast.success(e?.payload?.message);
          setIsModalOpen(false);
          handleAddEventData("FRONTEND_FILTER_CLICK_CREATED", "Frontend Filter created Successfully", "Frontend Filter created Successfully"),
            dispatch(getSelectedFilterList());
          resetFilters(true);
        }

        else {
          handleAddEventData("FRONTEND_FILTER_CLICK_CREATED", "Frontend Filter creation failed", "Frontend Filter creation failed")
        }
      });
    }
    setFilterName('');
    setIsEditModalOpen(false);
  }

  const updateFilters = () => {
    let status = selectedStatus === "Cancelled" ? true : false;

    const formattedDates = DateFormatter(date, date);

    const payload = {
      filter_name: filterName,
      visit_type: selectedVisitType,
      screening: selectedScreening,
      provider: selectedProviders,
      appointment_start_date: formattedDates.start,
      appointment_end_date: formattedDates.end,
    };


    dispatch(updateAppointmentFilter({ action: payload, uuid: selectedFilterDetail?.uuid })).then((e) => {
      if (e?.payload) {
        setIsSavedFilterSettingClicked(false);
        toast.success('Filter successfully updated');
        setIsModalOpen(false);
        setEmptySearch(true);
        dispatch(getSelectedFilterList());
        resetFilters(true, true);
      }
    });
  }

  const onRadioButtonClick = (filter: any) => {
    setSelectedFilter(filter)
  }

  const deleteFilterModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  }

  const deleteModalToggle = () => {
    setDeleteModalOpen(!isModalOpen);
  }

  const deleteModalClose = () => {
    setDeleteModalOpen(false);
    setFilterName('');
  }

  const deleteFilterDetail = () => {
    dispatch(deleteSelectedFilterDetail(selectedFilter.uuid)).then((response: any) => {
      toast.success("Filter deleted successfully");
      dispatch(getSelectedFilterList());
      resetFilters(true);
      setDeleteModalOpen(false);
      handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter Deleted Successfully", "Frontend Filter Deleted Successfully")
    })
  }

  const closeModal = () => {
    setIsModalOpen(false);
    if (isEditModalOpen) {
      setFilterName(selectedFilterDetail?.name || "");
    } else {
      setFilterName("");
    }
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (selectedFilterList === undefined) {
      setIsSavedFilterSettingClicked(false);
    }
  }, [selectedFilterList]);

  const selectSavedFilter = (event: any, list: any) => {
    event.stopPropagation();
    onRadioButtonClick(list);
    getFilterDetail(list)
  }

  return (
    <>
      <Box
        component={"div"}
        sx={{ display: "flex", margin: "0", alignItems: "center", gap: "10px" }}
      >
        <Grid container>
          <Grid item xs={1} sx={{}}>
            <FilterButtons
              aria-controls="filter-menu"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <img src={TuneIconimage.src} style={{ fontSize: "16px", marginRight: "5px", color: "#344054" }} />
              <span style={{ fontSize: "16px", color: "#344054" }}>Filter</span>
            </FilterButtons>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <TableContainer sx={{ boxShadow: "unset" }} component={Paper}>
                <BoxFilter
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <BoxFilterLeft>Filter by</BoxFilterLeft>
                  <BoxFilterRight>
                    {(!isSavedFilterSettingClicked) ? <>
                      <BoxFilterRightMid sx={{ cursor: "pointer" }} onClick={() => applyFilters()} disabled={isEmptyFilter()}>Apply</BoxFilterRightMid>
                      {!isEmptyFilter() && <BoxFilterRightMid sx={{ color: "#5C6469", cursor: "pointer" }} onClick={() => createFilterModal()}>
                        Create Filter
                      </BoxFilterRightMid>}
                      <BoxFilterRightMid sx={{ color: "#5C6469", cursor: !isEmptyFilter() ? "pointer" : "not-allowed" }} onClick={() => resetFilters()} disabled={isEmptyFilter()}>
                        Reset
                      </BoxFilterRightMid>
                    </> : <>
                      <BoxFilterRightMid sx={{ cursor: "pointer" }} onClick={() => createFilterModal(true)} disabled={!selectedFilterDetail}>
                        Rename
                      </BoxFilterRightMid>

                      <BoxFilterRightMid sx={{ color: "#5C6469", cursor: "pointer" }} onClick={() => updateFilters()} disabled={!selectedFilterDetail}>
                        Update
                      </BoxFilterRightMid>

                      <BoxFilterRightMid sx={{ color: "#5C6469", cursor: "pointer" }} onClick={() => deleteFilterModal()} disabled={!selectedFilterDetail}>
                        Delete
                      </BoxFilterRightMid>
                    </>
                    }
                  </BoxFilterRight>
                </BoxFilter>
                {isFilterDataLoading && (
                  <LoaderBox sx={{ display: "flex" }}>
                    <CircularProgress />
                    Loading Filters
                  </LoaderBox>
                )}

                {!isFilterDataLoading && (
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableData>
                        {selectedFilterList?.length > 0 && <TableDataList>
                          <TableCellHd sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            Saved Filter{" "}
                            <SettingsOutlinedIcon style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => setIsSavedFilterSettingClicked(!isSavedFilterSettingClicked)} />
                          </TableCellHd>

                          <RadioMain>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="female"
                              name="radio-buttons-group"
                              className='radio_sec'
                            >
                              {selectedFilterList?.map((list: any, index: number) => (
                                <FormControlLabel
                                  sx={{
                                    textAlign: "left",
                                    wordWrap: "break-word", // Allow wrapping of long words
                                    wordBreak: "break-word", // Break long words if necessary
                                    whiteSpace: "normal", // Ensure text wraps and does not overflow
                                  }}
                                  onClick={(event) => {
                                    // Typecast event target to an HTML element to access the 'type' property
                                    const target = event.target as HTMLInputElement;

                                    // Only call `selectSavedFilter` when the clicked target is not the radio button
                                    if (target.type !== 'radio') {
                                      selectSavedFilter(event, list);
                                    }
                                  }}
                                  key={index}
                                  className={
                                    selectedSavedFilterUuid === list.uuid
                                      ? 'radio_sec_inner selectedSavedFilter'
                                      : 'radio_sec_inner'
                                  }
                                  value={list.uuid}
                                  control={
                                    isSavedFilterSettingClicked ? (
                                      <Radio
                                        checked={selectedSavedFilterUuid === list.uuid}
                                        onClick={(event) => {
                                          event.stopPropagation(); // Stop the click from propagating to the parent
                                          selectSavedFilter(event, list); // Trigger the selection of the radio button
                                        }}
                                      />
                                    ) : (
                                      <List />
                                    )
                                  }
                                  label={
                                    <span
                                      onClick={(event) => {
                                        event.preventDefault(); // Prevent the label click from triggering form behavior
                                      }}
                                    >
                                      {list.name}
                                    </span>
                                  }
                                />
                              ))}




                            </RadioGroup>
                          </RadioMain>

                        </TableDataList>}

                        <TableDataList>
                          <TableCellHd>
                            Visit Type ({visit_type?.length})
                          </TableCellHd>

                          {visit_type?.map((visit: any, index: number) => (
                            <TableCellTd key={index}>
                              <label>
                                <CheckboxInner
                                  key={index}
                                  sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                                  {...label}
                                  onClick={() => handleVisitTypeFilterClick(visit)}
                                  checked={selectedVisitType?.includes(visit) || false}
                                />
                                {visit}
                              </label>
                            </TableCellTd>
                          ))}
                        </TableDataList>

                        <TableDataList>
                          <TableCellHd>
                            Screening ({patient_screening?.length})
                          </TableCellHd>
                          {patient_screening?.map((patient: any, index: number) => (
                            <TableCellTd key={index}>
                              <label>
                                <CheckboxInner
                                  key={index}
                                  sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                                  {...label}
                                  onClick={() => handleScreeningFilterClick(patient)}
                                  checked={selectedScreening?.includes(patient) || false}
                                />
                                {patient}
                              </label>
                            </TableCellTd>
                          ))}
                        </TableDataList>

                        <TableDataList>
                          <TableCellHd>
                            Clinician ({provider?.length})
                          </TableCellHd>
                          {provider?.map((pro: any, index: number) => (
                            <TableCellTd key={index}>
                              <label>
                                <CheckboxInner
                                  key={index}
                                  sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                                  {...label}
                                  onClick={() => handleProvidersFilterClick(pro)}
                                  checked={selectedProviders?.includes(pro.uuid) || false}
                                />
                                {pro.name}
                              </label>
                            </TableCellTd>
                          ))}
                        </TableDataList>

                        <TableDataList>
                          <TableCellHd>
                            Appointment Status
                          </TableCellHd>

                          {statusKeys.map((pro: any, index: number) => (
                            <TableCellTd sx={{ padding: "0 !important" }} key={index}>
                              <label>
                                <Radio
                                  key={index}
                                  sx={{ "& .MuiSvgIcon-root": { fontSize: 16, } }}
                                  onClick={() => handleStatusSelection(pro)}
                                  checked={
                                    selectedStatus === pro.name ||
                                    (selectedStatus == null && pro.name === "Not Cancelled")
                                  }
                                />
                                {pro.name}
                              </label>
                            </TableCellTd>
                          ))}
                        </TableDataList>
                      </TableData>
                    </TableHead>
                  </Table>
                )}
              </TableContainer>
            </Menu>
          </Grid>
        </Grid>
      </Box>
      <SaveFilterModal setFilterName2={setFilterName} isModalOpen={isModalOpen} modalToggle={modalToggle} filterName={filterName} setFilterName={handleInput} createFilter={createFilter} isEditModalOpen={isEditModalOpen} selectedFilterDetail={selectedFilterDetail} closeModal={closeModal} />
      <DeleteFilterModal isModalOpen={isDeleteModalOpen} modalToggle={deleteModalToggle} deleteModalClose={deleteModalClose} deleteFilterDetail={deleteFilterDetail} />
    </>
  );
}

export default FilterButton;

