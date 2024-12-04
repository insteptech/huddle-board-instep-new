'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useInView } from 'react-intersection-observer';
import { getAppointmentDetail, getAppointmentDetailMulti, getAppointmentsList, getFiltersData, getSelectedFilterDetail, getSelectedFilterList, updateAppointmentDetail, getAllAppointments, auditLog } from '@/app/redux/actions/appointment';
import { AppDispatch, AppState } from '@/app/redux/store';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import FilterButton from "@/app/components/filter";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
// import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import arrowLeft from "../../images/leftarrow.svg"
import arrowRight from "../../images/rightarrow.svg"
import { ExpendSection, HideShow, LoaderBox } from '../../styles/customStyle';
import pdfIcon from "../../images/pdficon.svg";
import moment from 'moment-timezone';
import { useSearchParams, useRouter } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';  // close icon

import {
  HeadingTag,
  TableMainContainer,
  Table_Head,
  StyledTableCell,
  TableDiv,
  TableTopMain,
  TableTop,
  FilterMenu,
  TableOtherContainer,
  RightPrint,
  RightBox,
  MainBoxTop,
  TypoSpan,
  SearchClearIcon,
  TableMidData
} from '../../styles/customStyle';

import { AppointmentState, FiltersDataState, emptyAppointmentList, emptySelectedFilter, updateFilter } from '@/app/redux/slices/appointment';
import { Box, Container, Input, InputAdornment, CircularProgress, Typography, FormControlLabel, Checkbox, FormGroup, Button, TableCell, Skeleton } from '@mui/material';
import PatientNotFound from '@/app/components/patientNotFound';
import { API_URL } from '@/app/redux/config/axiosInstance';
import { DateFormatter, formatDates, parseDate, urlParams } from '@/app/utils/helper';
import DatePicker from '@/app/components/datePicker';
import { accessToken, loginAuthentication, notAuthenticated, isTokenExpired } from '@/app/utils/auth';
import IdleModal from '@/app/components/idleModal';
import { addEventData, addOtherData, EventData, getAllEventData, getAllOtherData } from '../../utils/indexeddb';
import { useCallback } from 'react';
import { clearDB } from '@/app/utils/indexeddb';
import { UncheckedIcon, CheckedIcon } from "../../images/check"
import { max } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';  // for success icon
import Shimmer from '@/app/components/shimmerEffect';
import ShimmerTable from '@/app/components/shimmerEffect';

const Row = dynamic(() => import('@/app/components/tableRow/index').then((mod) => mod), {
  ssr: false,
});

type AppointmentListProps = {
  initialAppointments: AppointmentState[];
};

const CollapsibleTable: React.FC<AppointmentListProps> = ({ initialAppointments }) => {
  const [isPatientNotFound, setIsPatientNotFound] = useState(true);
  const [isClearFilter, setIsClearFilter] = useState(false);
  const [patientNameSearch, setPatientNameSearch] = React.useState('');
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [arrowDisabledRight, setArrowDisabledRight] = useState<boolean>(false);
  const [arrowDisabledLeft, setArrowDisabledLeft] = useState<boolean>(false);
  const searchParam = useSearchParams();
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const dispatch = useDispatch<AppDispatch>();
  const appointmentsList = useSelector((state: AppState) => state.appointment?.appointmentsData?.results) || [];
  const appointmentDetail = useSelector((state: AppState) => state.appointment?.appointmentDetail) || [];
  const appointmentDetailMulti = useSelector((state: AppState) => state.appointment?.appointmentDetailMulti) || [];
  const isNextAppointmentsList = useSelector((state: AppState) => state.appointment?.appointmentsData?.next);
  const isDetailLoading = useSelector((state: AppState) => state.appointment.isDetailLoading);
  const appointmentFiltersData = useSelector((state: AppState) => state.appointment.appointmentFiltersData);
  const isFilterDataLoading = useSelector((state: AppState) => state.appointment.isFilterDataLoading);
  const selectedFilterList = useSelector((state: AppState) => state.appointment.selectedFilterList);
  const filters = useSelector((state: AppState) => state.appointment.filtersData);
  const { page } = filters;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitType, setSelectedVisitType] = useState<any>(filters.visit_types || []);
  const [selectedScreening, setSelectedScreening] = useState<any>(filters.screening || []);
  const [selectedProviders, setSelectedProviders] = useState<any>(filters.providers_uuids || []);
  const [selectedAppointmentUuid, setSelectedAppointmentUuid] = useState<string>('');
  const [selectedAppointmentGap, setSelectedAppointmentGap] = useState<number>();
  const [selectedSavedFilterUuid, setSelectedSavedFilterUuid] = useState<string>('');
  const [isAppointmentTimeSortAscending, setIsAppointmentTimeSortAscending] = useState(false);
  const [isPatientNameSortAscending, setIsPatientNameSortAscending] = useState(false);
  const [loaderAppoint, setLoaderAppoint] = useState<any>(false);
  const [mainLoader, setMainLoader] = useState<any>(true);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [reverseModal, setReverseModal] = useState(false);
  const [idleModalOpen, setIdleModalOpen] = useState(false);
  const [actionValue, setActionValue] = useState({
    value: "",
    data: "",
    detail: {}
  })
  const [selectedStatus, setSelectedStatus] = useState<string | null>("Not Cancelled");
  const [idleTimeEnv, setIdleTimeEnv] = useState(15);
  const [completedActions, setCompletedActions] = useState(false);
  const [zeroScreenings, setZeroScreenings] = useState(false);
  const [expand, setExpand] = useState(false);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [newEventData, setNewEventData] = useState<EventData[]>([]);
  const dispatchMemoized = useCallback(dispatch, []); // memoize dispatch
  // Calculate the difference between UTC and US Pacific Time

  var myDate = new Date()
  var pstDate = myDate.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles"
  })

  var pstDateNew = new Date(pstDate);

  const [date, setDate] = React.useState(pstDateNew);

  useEffect(() => {
    async function fetchEventData() {
      const data: any = await getAllEventData();
      setEventData(data);
    }
    fetchEventData();
  }, []);

  useEffect(() => {
    clearDB()
  }, []);

  const handleAddEventData: any = async (event_type: string, output: string, misc_info: string) => {
    await addEventData({ event_type, output, misc_info });
    const EventData: any = await getAllEventData();
    setEventData(EventData);

  };

  const { ref, inView } = useInView();
  const [windowHeight, setWindowHeight] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [valueNum, setValueNum] = useState(0)

  const removeObjectById = (arr: any, id: any) => {
    const index = arr.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  };


  useEffect(() => {
    const processEventData = async () => {
      for (const item of eventData) {
        const existingItem = newEventData.find((existingItem) => existingItem.id === item.id);
        if (!existingItem) {
          try {
            dispatch(auditLog([{ event_type: item.event_type, output: item.output, misc_info: item.misc_info }]))
            await addOtherData(item);
            const updatedEventData = await getAllOtherData();
            setNewEventData(updatedEventData);
            const { id, ...itemWithoutId } = item;
            removeObjectById(eventData, id)
          } catch (error) {
            console.error('Error processing event data:', error);
          }
        }
      }
    };

    if (eventData.length > 0) {
      processEventData();
    }
    return () => {
    };
  }, [eventData, newEventData]);

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Modal

  useEffect(() => {
    let timer = null;
    const resetIdleTime = () => {
      setIdleTime(0);
    };

    const incrementIdleTime = () => {
      setIdleTime(prevIdleTime => prevIdleTime + 1);
    };

    timer = setInterval(incrementIdleTime, 60000);

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    const resetIdleOnActivity = () => {
      resetIdleTime();
    };
    events.forEach(event => {
      document.addEventListener(event, resetIdleOnActivity);
    });

    return () => {
      clearInterval(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetIdleOnActivity);
      });
    };
  }, []);

  const isSlug = () => {
    if (searchParam.has("slug")) {
      return true;
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    if (idleTime >= idleTimeEnv) {
      setIdleModalOpen(true);
    }
  }, [idleTime]);

  const [getMoreAppointment, setGetMoreAppointment] = useState(0);

  // Load More Appointment

  const [blurLength, setBlurLength] = useState(10)

  const loadMoreAppointment = (filter: FiltersDataState, auditState?: any) => {

    dispatch(getAppointmentsList(filter)).then((response: any) => {
      setGetMoreAppointment(response?.payload?.count);
      setMainLoader(false);

      if (page && page > 2) {
        setBlurLength(1)
      }

      dispatch(updateFilter({ page: filter && filter.page ? filter.page + 1 : page }));
      if (response?.payload?.results.length === 0) {

        setIsClearFilter(true);
      } else {
        setIsClearFilter(false);
      }
    })

    auditState === "FRONTEND_FILTER_CLICK_FILTER_APPLIED_SUCCESS" ? (
      handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filters Applied", "Frontend Filters Applied")
    )
      : auditState === "FRONTEND_FILTER_CLICK_FILTER_RESET" ?
        (
          handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter Reset", "Frontend Filter Reset")
        )
        : auditState === "FRONTEND_FILTER_CLICK_DATE_FILTER_SELECTED" ?
          (
            handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "FRONTEND_FILTER_CLICK_DATE_FILTER_SELECTED", "FRONTEND_FILTER_CLICK_DATE_FILTER_SELECTED")
          )
          : auditState === "FRONTEND_TILE_CLICK_PATIENT_NAME_SORTING" ?
            (
              handleAddEventData("FRONTEND_TILE_CLICK_PATIENT_NAME", "Frontend Filters sorting according to patient name", "Frontend Filters Applied")
            )
            : auditState === "FRONTEND_TILE_CLICK_PATIENT_TIME_SORTING" ?
              (
                handleAddEventData("FRONTEND_TILE_CLICK_APPOINTMENT_TIME", "Frontend Filters sorting according to appt time", "Frontend Filters Applied")
              )
              : null;
  };

  useEffect(() => {
    if (!loginAuthentication() && !notAuthenticated()) {
      window.location.href = '/unauthorized';
    }

    const payload = {
      ...filters,
    };

    dispatch(getAppointmentsList(payload))
      .then((response: any) => {
        setIsPatientNotFound(false);
        dispatch(updateFilter({ page: Number(page) + 1 }));
        setMainLoader(false);
        if (response?.payload?.results.length === 0) {
          setIsClearFilter(true);

        } else {
          setIsClearFilter(false);
        }
      })
      .catch((error) => {
        setMainLoader(false);

        console.error("An error occurred while fetching appointments:", error);
        window.location.href = "/auth/login"
      });
  }, []);

  useEffect(() => {
    if (inView && isNextAppointmentsList) {
      loadMoreAppointment(filters);
    }
  }, [inView]);

  const appointmentDetails = (id: any) => {
    dispatch(getAppointmentDetail({ appointment_id: id })).then(() => {
      setLoaderAppoint(false);
    })
  };

  const getAction = (value: string) => {
    switch (value) {
      case 'accept':
        return { accept: false };
      case 'reject':
        return { reject: false };
      case 'test_ordered':
        return { test_ordered: false };
      default:
        return {};
    }
  };

  const getAction2 = (value: string) => {
    switch (value) {
      case 'accept':
        return { accept: true, reject: false, test_ordered: true };
      case 'reject':
        return { reject: true, accept: false, test_ordered: false };
      case 'test_ordered':
        return { test_ordered: false };
      default:
        return {};
    }
  };

  const [newbuttonState, setNewButtonState] = useState(true)

  const updateButtonState = (value: any, data: any, detail: any) => {

    setNewButtonState(!newbuttonState)
    if (data == "disable") {
      toast.error("cannot select")
      return;
    }

    if (data == "enable") {
      setReverseModal(false)
      setActionValue({
        value: value,
        data: data,
        detail: detail
      })
    }
    if (data == "active") {
      setReverseModal(true)
      setActionValue({
        value: value,
        data: data,
        detail: detail
      })
    }

    updateOutCome(value, data, detail);
  }

  const updateOutCome = (value: any, data: any, detail: any) => {
    const { appointment_id, uuid } = detail;
    const payload = {
      appointment_id: appointment_id,
      screening_id: uuid,
      action: data === "enable" ? getAction2(value) : getAction(value)
    }
    dispatch(updateAppointmentDetail(payload)).then((res) => {
      (res?.payload?.request_data?.accept || res?.payload?.request_data?.reject) ? toast.success(
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <FaCheckCircle style={{ color: '#2ECC71', marginRight: '10px' }} />
            Action updated successfully
          </div>
          <IoMdClose
            style={{ color: '#000000', cursor: 'pointer' }}
            onClick={() => toast.dismiss()}
          />
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,  // Custom close button handles clicks
          pauseOnHover: true,
          draggable: true,
          icon: false,  // Remove default icon
          closeButton: false,  // Disable the default close button
          style: {
            backgroundColor: '#F8FFFC',  // Custom green color
            color: '#2ECC71',  // Text color
          }
        }
      ) : toast.success(
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaCheckCircle style={{ color: '#2ECC71', marginRight: '10px', justifyContent: "space-between" }} />
            Action reverted successfully
          </div>
          <IoMdClose style={{ color: '#000000', cursor: 'pointer' }} onClick={() => toast.dismiss()} />
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,  // Custom close button handles clicks
          pauseOnHover: true,
          draggable: true,
          icon: false,  // Remove default icon
          closeButton: false,  // Disable the default close button
          style: {
            backgroundColor: '#F8FFFC',  // Custom green color
            color: '#2ECC71',  // Text color
          }
        }
      );
      appointmentDetails(appointment_id);
      setLoaderAppoint(true);
      handleAddEventData("FRONTEND_TILE_CLICK_ACTION", `FRONTEND_TILE_CLICK_ACTION${value}`, `FRONTEND_TILE_CLICK_ACTION${value}`)
      dispatch(getAppointmentDetail({ appointment_id: res?.meta?.arg?.appointment_id })).then((res: any) => {
        dispatch(getAppointmentDetailMulti({ appointment_id: res?.meta?.arg?.appointment_id })).then((res) => {
        })
        // dispatch(getAppointmentsList(filters)).then(()=>{
        //   console.log("Consoled")
        // });
      })
      const formattedDates = formatDates(filters.appointment_start_date, filters.appointment_end_date);
      const payload = {
        ...filters,
        page: 1,
        page_size: 10,
      };
      dispatch(getAllAppointments(payload));

    }).catch(() => {
      ;

      handleAddEventData("FRONTEND_TILE_CLICK_ACTION", `FRONTEND_TILE_CLICK_ACTION${value}`, `FRONTEND_TILE_CLICK_ACTION${value}`)
    })
  }

  const handlePdf = () => {
    const timezone = "US/Pacific";

    const appliedFilters = {
      ...filters,
      file_type: 'pdf',
      timezone: timezone,
      page: 1,
    };

    const url = `${API_URL}download-appointments/?${urlParams(appliedFilters)}`;

    fetch(url, {
      method: 'get',
      headers: { "Authorization": `JWT ${accessToken()}` },
    })
      .then(res => {
        if (!res.ok) {
          toast.error("Failed to download the PDF. Please try again.");
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.blob();
      })
      .then(blob => {
        const aElement = document.createElement('a');
        toast.success("Your PDF has been successfully downloaded.");
        aElement.setAttribute('download', "appointments.pdf");
        const href = URL.createObjectURL(blob);
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);

        handleAddEventData(
          "FRONTEND_PRINT_CLICK",
          "Frontend Print Document Successful",
          "Frontend Print Document Successful"
        );
      })
      .catch(err => {
        console.error("Error during PDF download:", err);
      });
  };

  const getAppointmentFiltersData = () => {
    dispatch(getFiltersData());
    dispatch(getSelectedFilterList());
  }

  const setStatus = () => {
    setSelectedStatus("Not Cancelled");
  }

  const resetFilters = (isFilterPopOpen: boolean = false, isUpdateFilter? : boolean) => {

    const timezone: string = "US/Pacific";
    const formattedDatess = DateFormatter(date, date);

    const filtersData = {
      ...filters,
      visit_types: [],
      providers_uuids: [],
      screening: [],
      page: 1,
      page_size: 10,
      patient_name: '',
      timezone: timezone,
      show_cancelled_appointments: false,
      appointment_start_date: formattedDatess.start,
      appointment_end_date: formattedDatess.end,
    };

    setStatus();
    setMainLoader(true);
    setSelectedStatus(null);
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    // loadMoreAppointment(filtersData, "FRONTEND_FILTER_CLICK_FILTER_RESET");
    setPatientNameSearch('');
    setCompletedActions(false);
    setZeroScreenings(false);
    setSelectedSavedFilterUuid('');
    if(isUpdateFilter === true) {
      setSelectedVisitType(selectedVisitType);
    setSelectedScreening(selectedScreening);
    setSelectedProviders(selectedProviders)
    }

    else{
      setSelectedVisitType([]);
      setSelectedScreening([]);
      setSelectedProviders([])
    }

    if (!isFilterPopOpen) {
      setAnchorEl(null);
    }
    setRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    });
    setIsFilterApplied(false);
    dispatch(emptySelectedFilter());
  }

  useEffect(() => {
    if (selectedVisitType.length === 0 && selectedProviders.length === 0 && selectedScreening.length === 0 && selectedStatus === null) {
      const formattedDates = DateFormatter(date, date);
      const timezone: string = "US/Pacific";

      const filtersData = {
        ...filters,
        visit_types: [],
        providers_uuids: [],
        screening: [],
        page: 1,
        page_size: 10,
        appointment_start_date: formattedDates.start,
        appointment_end_date: formattedDates.end,
        timezone: timezone,
        show_cancelled_appointments: false,

      };

      dispatch(updateFilter(filtersData));
      loadMoreAppointment(filtersData);
      dispatch(emptyAppointmentList());
      setSelectedSavedFilterUuid('');
    }
  }, [selectedVisitType, selectedProviders, selectedScreening, selectedStatus])

  const searchAppointmentPatientName = (e: any) => {
    setPatientNameSearch(e.target.value);
    setEmptySearch(false);

    if (!e?.target?.value) {

      const filtersData = {
        ...filters,
        page: 1,
        page_size: 10,

        patient_name: e.target.value
      };

      setTimeout(() => {
        dispatch(emptyAppointmentList());
        setIsFilterApplied(false);
        loadMoreAppointment(filtersData);
        dispatch(updateFilter(filtersData));
      }, 500)
      handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter Search Removed Successfully", "Frontend Filter Search Removed Successfully")
    }

    if (e?.target?.value?.length > 1) {

      const newVal = e.target.value;

      const filtersData = {
        ...filters,
        visit_types: selectedVisitType,
        providers_uuids: selectedProviders,
        screening: selectedScreening,
        page: 1,
        page_size: 10,
        patient_name: newVal,

      };

      dispatch(emptyAppointmentList());
      setIsFilterApplied(true);
      dispatch(updateFilter(filtersData));
      loadMoreAppointment(filtersData);
      handleAddEventData("FRONTEND_FILTER_CLICK_GENERAL", "Frontend Filter Search Applied Successfully", "Frontend Filter Search Applied Successfully")
    }
  }

  const getFilterDetail = (filter: any) => {

    setSelectedSavedFilterUuid(filter.uuid);
    dispatch(getSelectedFilterDetail(filter.uuid)).then((response: any) => {
      const { payload } = response || {};
      if (!payload) return;

      const filtersData = {
        ...filters,
        visit_types: payload.visit_type,
        providers_uuids: payload.providers,
        screening: payload.screening,
        page: 1,
        page_size: 10,
        patient_name: '',

      };

      setSelectedVisitType(payload.visit_type);
      setSelectedScreening(payload.screening);
      setSelectedProviders(payload.providers);
      // dispatch(updateFilter(filtersData));
      // dispatch(emptyAppointmentList());
      // loadMoreAppointment(filtersData);
    })
  }

  const dateRangeHandleChange = (dates: any) => {

    const formattedDates = formatDates(dates, dates);

    const filter = {
      ...filters,
      appointment_start_date: formattedDates.start,
      appointment_end_date: formattedDates.end,
      page: 1,
      page_size: 10,

    };
    dispatch(updateFilter(filter));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filter);
  }


  const dateRangeHandleChange2 = (dates: any) => {
    const formattedDates = DateFormatter(dates, dates);

    const filter = {
      ...filters,
      appointment_start_date: formattedDates.start,
      appointment_end_date: formattedDates.end,
      page: 1,
      page_size: 10,
    };

    dispatch(updateFilter(filter));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filter);
  }

  const handleAppointmentTimeSort = () => {
    setIsAppointmentTimeSortAscending(!isAppointmentTimeSortAscending);
    const filtersData = {
      ...filters,
      sort_by: isAppointmentTimeSortAscending ? 'appointment_timestamp' : '-appointment_timestamp',
      page: 1,
      page_size: 10,
    };
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filtersData, "FRONTEND_TILE_CLICK_PATIENT_TIME_SORTING");
  }

  const handlePatientNameSort = () => {
    setIsPatientNameSortAscending(!isPatientNameSortAscending);
    const filtersData = {
      ...filters,
      sort_by: isPatientNameSortAscending ? 'patient__patient_first_name' : '-patient__patient_first_name',
      page: 1,
      page_size: 10,

    };
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filtersData, "FRONTEND_TILE_CLICK_PATIENT_NAME_SORTING");
  }

  const handleCalenderButtonClick = (direction: string) => {
    const appointmentsListString = localStorage.getItem('huddleBoardConfig');
    if (!appointmentsListString) return;
    const { past_calendar_days_count, future_calender_days_count } = JSON.parse(appointmentsListString);

    const currentDate = pstDateNew;
    const currentDay = currentDate.getDate();
    const selectedDate = new Date(date);

    if (direction?.toLowerCase() === "left") {
      selectedDate.setDate(date.getDate() - 1);
      handleAddEventData(
        "FRONTEND_FILTER_CLICK_GENERAL",
        "Frontend Date filter selected using left arrow",
        "Frontend Date filter selected using left arrow"
      );
    } else {
      selectedDate.setDate(date.getDate() + 1);
      handleAddEventData(
        "FRONTEND_FILTER_CLICK_GENERAL",
        "Frontend Date filter selected using right arrow",
        "Frontend Date filter selected using right arrow"
      );
    }

    setDate(selectedDate);
    const selectedDay = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth();

    const minDateOnly = new Date(currentDate);
    minDateOnly.setDate(currentDay - past_calendar_days_count);

    const maxDateOnly = new Date(currentDate);
    maxDateOnly.setDate(currentDay + future_calender_days_count);
    setArrowDisabledRight(false);
    setArrowDisabledLeft(false);

    if (minDateOnly.getDate() === selectedDay && minDateOnly.getMonth() === selectedMonth) {
      setArrowDisabledLeft(true);
    } else if (maxDateOnly.getDate() === selectedDay && maxDateOnly.getMonth() === selectedMonth) {
      setArrowDisabledRight(true);
    }

    dateRangeHandleChange2(selectedDate);
  }

  // ****************************************** Show and hide appointments

  const handleCompletedActionsChange = (event: any) => {
    setCompletedActions(event.target.checked);

    const filtersData = {
      ...filters,
      page: 1,
      page_size: 10,
      hide_complete_appointments: event.target.checked,
      hide_zero_screenings: zeroScreenings
    };
    setMainLoader(true);
    setIsFilterApplied(true);
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filtersData)
  };

  const handleZeroScreeningsChange = (event: any) => {
    setZeroScreenings(event.target.checked);
    const filtersData = {
      ...filters,
      page: 1,
      page_size: 10,
      hide_complete_appointments: completedActions,
      hide_zero_screenings: event.target.checked,
    };
    setMainLoader(true);
    setIsFilterApplied(true);
    dispatch(updateFilter(filtersData));
    dispatch(emptyAppointmentList());
    loadMoreAppointment(filtersData);
  };

  // expand functionality

  let dispatchedUUIDs: any = [];

  const firstElementRef = useRef<any>(null);
  const expandedValues = (value: boolean) => {
    setLoaderAppoint(true);
    setExpand(value);

    if (value === true) {
      for (let i = 0; i < appointmentsList.length; i++) {
        const appointmentUUID = appointmentsList[i]?.uuid;

        if (appointmentUUID && !dispatchedUUIDs.includes(appointmentUUID)) {
          dispatch(getAppointmentDetailMulti({ appointment_id: appointmentUUID })).then((res) => {
            setLoaderAppoint(false);
          });
          dispatchedUUIDs.push(appointmentUUID);
        } else {
        }
      }

    }
    setValueNum(valueNum + 1);
  }

  useEffect(() => {
    if (inView) {
      expandedValues(expand);
    }
  }, [inView])


  const [emptySearch, setEmptySearch] = useState(false);

  const columns = ["Appt Time", "Patient Name", "Type of Visit", "Clinician", "Screening", "Action"];

  return (
    <>
      <Container maxWidth={false}>
        <MainBoxTop>
          <HeadingTag variant="h1" sx={{ margin: "0" }}>
            My Schedule
          </HeadingTag>
          <RightPrint>
            {
              arrowDisabledLeft ?
                <RightBox sx={{ visibility: "hidden" }} onClick={() => handleCalenderButtonClick("left")}>
                  <img src={arrowLeft.src} style={{ fontSize: "15px" }} />
                </RightBox> :
                <RightBox onClick={() => handleCalenderButtonClick("left")}>
                  <img src={arrowLeft.src} style={{ fontSize: "15px" }} />
                </RightBox>
            }
            <Box>
              <DatePicker
                date={date}
                setDate={setDate}
                setArrowDisabledRight={setArrowDisabledRight}
                setArrowDisabledLeft={setArrowDisabledLeft}
                dateRangeHandleChange={dateRangeHandleChange}
                filters={filters}
                loadMoreAppointment={loadMoreAppointment}
              />
            </Box>
            {
              arrowDisabledRight ?
                <RightBox sx={{ visibility: "hidden" }} onClick={() => handleCalenderButtonClick("right")}>
                  <img src={arrowRight.src} style={{ fontSize: "15px" }} />
                </RightBox> :
                <RightBox onClick={() => handleCalenderButtonClick("right")}>
                  <img src={arrowRight.src} style={{ fontSize: "15px" }} />
                </RightBox>
            }
            <RightBox onClick={() => handlePdf()}
              sx={{
                ':hover': {
                  backgroundColor: "#F5F7F6",

                }
              }}
            >
              <img src={pdfIcon.src} style={{ fontSize: "20px", marginRight: "5px" }} />
              <TypoSpan variant="caption"

              >PDF</TypoSpan>
            </RightBox>

            {/* <RightBox onClick={() => handlePrint()}>
              <PrintOutlinedIcon style={{ fontSize: "20px", marginRight: "5px" }} />
              <TypoSpan variant="caption">Print</TypoSpan>
            </RightBox> */}

          </RightPrint>
        </MainBoxTop>

        <TableDiv sx={{
          height: {
            xs: "auto", // For extra-small devices, make the height auto
            sm: !isPatientNotFound ? 'auto' : "80vh" // For small and above, cover the full viewport height
          }
        }}>
          <TableTopMain>
            <Box sx={{ display: 'flex' }}>
              <FilterMenu>
                <FilterButton
                  date={date}
                  setEmptySearch={setEmptySearch}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  handleAddEventData={handleAddEventData}
                  getAppointmentFiltersData={getAppointmentFiltersData}
                  appointmentFiltersData={appointmentFiltersData}
                  isFilterDataLoading={isFilterDataLoading}
                  loadMoreAppointment={loadMoreAppointment}
                  filters={filters}
                  selectedFilterList={selectedFilterList}
                  setSelectedVisitType={setSelectedVisitType}
                  setSelectedScreening={setSelectedScreening}
                  setSelectedProviders={setSelectedProviders}
                  setAnchorEl={setAnchorEl}
                  anchorEl={anchorEl}
                  selectedVisitType={selectedVisitType}
                  selectedScreening={selectedScreening}
                  selectedProviders={selectedProviders}
                  resetFilters={resetFilters}
                  getFilterDetail={getFilterDetail}
                  selectedSavedFilterUuid={selectedSavedFilterUuid}
                  setIsFilterApplied={setIsFilterApplied}
                  setMainLoader={setMainLoader}
                  isFilterApplied={isFilterApplied}
                />
              </FilterMenu>
              <TableTop>
                <Input
                  sx={{
                    "&::before, &::after": { display: "none" },
                    border: "none",
                    padding: "10px",
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "14px",
                    color: "#5C6469",
                  }}
                  id="input-with-icon-adornment"
                  placeholder="Search by patient name or MRN"
                  value={patientNameSearch}
                  onChange={(e) => searchAppointmentPatientName(e)}
                  startAdornment={
                    <>
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#0D426A" }} />
                      </InputAdornment>

                      {patientNameSearch.length > 0 && <InputAdornment position="end">
                        <SearchClearIcon onClick={() => resetFilters()}><CloseIcon sx={{ color: "#0D426A" }} /></SearchClearIcon>
                      </InputAdornment>}
                    </>
                  }
                />
              </TableTop>
            </Box>

            <HideShow>
              <Typography component='p'>Hide:</Typography>
              <Box sx={{ display: 'flex', paddingInline: '6px', gap: 0 }}>

                <FormControlLabel
                  sx={{ gap: "0 !important" }}
                  control={
                    <Checkbox
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckedIcon />}
                      checked={completedActions}
                      onChange={handleCompletedActionsChange}
                      disabled={appointmentsList.length <= 0}
                    />
                  }
                  label="Completed Actions"
                />

                <FormControlLabel
                  sx={{ gap: "0 !important" }}
                  control={
                    <Checkbox
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckedIcon />}
                      checked={zeroScreenings}
                      onChange={handleZeroScreeningsChange}
                      disabled={appointmentsList.length <= 0}
                    />
                  }
                  label="Zero Screenings"
                />

              </Box>
            </HideShow>

            <ExpendSection>
              <Typography component={'p'}>Expand:</Typography>
              <Button onClick={() => expandedValues(true)}>All</Button>
              <Typography component={'span'} sx={{ color: '#172B4D' }}>|</Typography>
              <Button onClick={() => expandedValues(false)}>None</Button>
            </ExpendSection>
          </TableTopMain>


          {(isPatientNotFound || isClearFilter) && (
            <TableOtherContainer sx={{ m: "10px 0 0 0", height: !isPatientNotFound ? 'auto' : windowHeight - 300 }}>
              <Table sx={{ height: "100%" }} aria-label="collapsible table">
                <Table_Head sx={{ backgroundColor: "#17236D", color: "#fff" }}>
                  <TableRow>
                    <StyledTableCell>
                      Appt Time{" "}
                      <ArrowDownwardIcon
                        style={{ verticalAlign: "middle", fontSize: "18px" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      Patient Name{" "}
                      <ArrowDownwardIcon
                        style={{ verticalAlign: "middle", fontSize: "18px" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>Type of Visit</StyledTableCell>
                    <StyledTableCell>Clinician</StyledTableCell>
                    <StyledTableCell>Screening</StyledTableCell>

                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </Table_Head>
                <TableBody>
                  {
                    mainLoader
                      ?
                      <TableRow>
                        <TableMidData style={{ border: "none", backgroundColor: "white" }} colSpan={12} >
                          <LoaderBox sx={{ width: "100%", margin: "0px", height: windowHeight - 400, justifyContent: "center" }}>
                            <CircularProgress />
                            Loading Appointments
                          </LoaderBox>
                        </TableMidData>
                      </TableRow>
                      : <PatientNotFound completedActions={completedActions} zeroScreenings={zeroScreenings} emptySearch={emptySearch} isFilterApplied={isFilterApplied} searchTerm={patientNameSearch} icon={isFilterApplied} resetFilters={resetFilters} />
                  }
                </TableBody>
              </Table>
            </TableOtherContainer>
          )}

          {!isPatientNotFound && !isClearFilter && (
            <TableMainContainer sx={{ height: windowHeight - 250 }}>
              <Table sx={{
                '.mui-799qhl-MuiTableCell-root': {
                  border: "none !important"
                }
              }} aria-label="collapsible table">
                <Table_Head sx={{ backgroundColor: "#17236D", color: "#fff" }}>
                  <TableRow>
                    <StyledTableCell onClick={() => handleAppointmentTimeSort()}>
                      Appt Time{" "}
                      {isAppointmentTimeSortAscending ? <ArrowDownwardIcon style={{ verticalAlign: "middle", fontSize: "18px" }} /> : <ArrowUpwardOutlinedIcon style={{ verticalAlign: "middle", fontSize: "18px" }} />}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handlePatientNameSort()}>
                      Patient Name{" "}
                      {isPatientNameSortAscending ? <ArrowDownwardIcon style={{ verticalAlign: "middle", fontSize: "18px" }} /> : <ArrowUpwardOutlinedIcon style={{ verticalAlign: "middle", fontSize: "18px" }} />}
                    </StyledTableCell>
                    <StyledTableCell>Type of Visit</StyledTableCell>
                    <StyledTableCell>Clinician</StyledTableCell>
                    <StyledTableCell>Screening</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </Table_Head>
                {
                  mainLoader ?
                    <>
                      <ShimmerTable />
                    </>

                    : <TableBody>
                      {appointmentsList.map(
                        (appointment: AppointmentState, index: number) => (
                          <>

                            <TableRow >
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                            </TableRow>
                            <Row

                              newbuttonState={newbuttonState}
                              appointmentsList={appointmentsList}
                              firstElementRef={firstElementRef}
                              id={appointmentsList[0]?.uuid}
                              expand={index < (valueNum * 10) ? expand : false}
                              setExpand={setExpand}
                              key={index}
                              appointment={appointment}
                              selectedAppointmentUuid={selectedAppointmentUuid}
                              setSelectedAppointmentUuid={setSelectedAppointmentUuid}
                              appointmentDetail={appointmentDetail}
                              appointmentDetailMulti={appointmentDetailMulti}
                              appointmentDetails={appointmentDetails}
                              updateOutCome={updateOutCome}
                              isDetailLoading={isDetailLoading}
                              setLoaderAppoint={setLoaderAppoint}
                              loaderAppoint={loaderAppoint}
                              updateButtonState={updateButtonState}
                              confirmationModal={confirmationModal}
                              reverseModal={reverseModal}
                              setConfirmationModal={setConfirmationModal}
                              setReverseModal={setReverseModal}
                              actionValue={actionValue}
                              setSelectedAppointmentGap={setSelectedAppointmentGap}
                              selectedAppointmentGap={selectedAppointmentGap}
                            />

                          </>
                        )
                      )}
                      {
                        (appointmentsList.length < getMoreAppointment) ?

                          <>
                            <TableRow >
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                              <TableCell style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}></TableCell>
                            </TableRow>

                            {Array.from({ length: blurLength }).map((_, rowIndex) => (
                              <TableRow key={rowIndex} sx={{ backgroundColor: "white", mb: 2 }}>
                                {columns.map((_, cellIndex) => (
                                  <TableCell
                                    key={cellIndex}
                                    sx={{
                                      backgroundColor: 'white',
                                      border: 'none',
                                      textAlign: 'center',
                                      width: '150px', // Consistent width for all cells
                                      padding: 2, // Consistent padding for all cells
                                    }}
                                  >
                                    <Skeleton
                                      variant="rectangular"
                                      animation="wave"
                                      height={28}
                                      width="90%"
                                      style={{
                                        borderRadius: 1, margin: 2,
                                        background: 'linear-gradient(90deg, #F0EBEB 0%, #E2E2E2 29.61%, #EBEBEB 62.23%, #F7F7F7 100%)',
                                        animation: 'shimmer 1.5s infinite ease-in-out'
                                      }} // Center within the cell
                                    />
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}

                          </> : null
                      }
                    </TableBody>

                }
              </Table>
              <div><h6 ref={ref} style={{ textAlign: "center", visibility: "hidden", height: "1px" }} ></h6></div>
            </TableMainContainer>
          )
          }

          {/* {isAppointmentLoading && (
            <AppointmentLoaderBox sx={{ display: "flex" }}>
              <CircularProgress />
              Loading Appointments
            </AppointmentLoaderBox>
          )} */}

        </TableDiv>
      </Container>

      <IdleModal isSlug={isSlug} idleTime={idleTime} idleTimeEnv={idleTimeEnv} setIdleTime={setIdleTime} idleModalOpen={idleModalOpen} setIdleModalOpen={setIdleModalOpen} />
    </>
  );

};

export default CollapsibleTable;
function expiredTokenCheck() {
  throw new Error('Function not implemented.');
}

