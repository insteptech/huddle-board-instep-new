import { createSlice, current } from '@reduxjs/toolkit';
import { getAppointmentsList, getAppointmentDetail, getAppointmentDetailMulti, updateAppointmentDetail, getFiltersData, getSelectedFilterList, getSelectedFilterDetail, getAllAppointments } from '../actions/appointment';
import { sortArraysInObject, sortObjectsByName } from '@/app/utils/appointment';
import { formatDates } from '@/app/utils/helper';


const timezone: string = "US/Pacific";

export type AppointmentsState = {
  appointmentsData: {
    results?: AppointmentState[],
    count?: number,
    next?: string | null,
    previous?: string | null
  };
  appointmentDetail: AppointmentDetail[];
  appointmentDetailMulti: AppointmentDetail[];
  selectedPatientDetail: string | null;
  isDetailLoading: boolean;
  appointmentFiltersData: AppointmentFiltersDataState | null;
  isFilterDataLoading: boolean;
  filtersData: FiltersDataState;
  selectedFilterList: IFilterDataState[];
  selectedFilterDetail: SelectedFilterDetailState | null;
  isAppointmentLoading: boolean;
};

export type SelectedFilterDetailState = {
  uuid: string;
  name: string;
  visit_type: [{ uuid: string }];
  screening: [{ uuid: string }];
  providers: [{ uuid: string }];
}

export type FiltersDataState = {
  page_size?: number,
  page?: number,
  appointment_start_date?: string | number,
  appointment_end_date?: string | number,
  visit_types?: string[],
  providers_uuids?: string[],
  screening?: string[],
  patient_name?: string,
  sort_by?: string,
  timezone?: String,
  hide_complete_appointments?:boolean,
  hide_zero_screenings?:boolean
}

export type AppointmentFiltersDataState = {
  patient_screening: IFilterDataState[],
  providers_uuids: IFilterDataState[],
  visit_type: IFilterDataState[]
}

export type IFilterDataState = {
  uuid: String,
  name: String
}

export type AppointmentState = {
  uuid: String,
  patient_name: String,
  appointment_timestamp: String,
  visit_type: String,
  gap_count: Number,
  selected_gap_count: Number,
  screening: String[],
  providers_uuids: String,
  mrn: String
}

export type AppointmentDetail = {
  uuid: String,
  appointment_id: String,
  clinician_agrees: boolean,
  clinician_disagrees: boolean,
  test_ordered: boolean,
  screening: String,
  action: String,
  description: String,
  screening_uuid: String
}
const formattedDates = formatDates(new Date(), new Date());

const initialState: AppointmentsState = {
  appointmentsData: {},
  appointmentDetail: [],
  appointmentDetailMulti: [],
  selectedPatientDetail: null,
  isDetailLoading: false,
  appointmentFiltersData: null,
  isFilterDataLoading: false,
  filtersData: {
    page_size: 10,
    page: 1,
    sort_by: 'appointment_timestamp',
    appointment_start_date: formattedDates.start,
    appointment_end_date: formattedDates.end,
    timezone: timezone,
    hide_complete_appointments:false,
    hide_zero_screenings: false
  },
  selectedFilterList: [],
  selectedFilterDetail: null,
  isAppointmentLoading: false,
};

export const appointment = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    locationData(state, action) {
      console.log('state:--', state, 'action:---', action);
    },
    updateFilter(state, { payload }) {
      state.filtersData = { ...state.filtersData, ...payload };
    },
    emptyAppointmentList(state) {
      state.appointmentsData = {};
    },
    emptySelectedFilter(state) {
      state.selectedFilterDetail = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAppointmentsList.pending, (state, action) => {
      state.isAppointmentLoading = true;
    });
    builder.addCase(getAppointmentsList.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
      state.isAppointmentLoading = false;
    });
    builder.addCase(getAppointmentsList.fulfilled, (state, { payload }) => {
      state.isAppointmentLoading = false;
      state.appointmentsData = appointmentsList(current(state)?.appointmentsData?.results, payload);
    });

    builder.addCase(getAppointmentDetail.pending, (state, action) => {
      state.isDetailLoading = true;
    });
    builder.addCase(getAppointmentDetail.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
      state.isDetailLoading = false;
    });
    builder.addCase(getAppointmentDetail.fulfilled, (state, { payload }) => {
      state.appointmentDetail = payload;
      state.isDetailLoading = false;
    });


    builder.addCase(getAppointmentDetailMulti.pending, (state, action) => {
      state.isDetailLoading = true;
    });
    builder.addCase(getAppointmentDetailMulti.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
      state.isDetailLoading = false;
    });

    builder.addCase(getAppointmentDetailMulti.fulfilled, (state, { payload, meta }) => {
      if (!Array.isArray(state.appointmentDetailMulti)) {
        state.appointmentDetailMulti = [];
      }
      payload.forEach((item:any) => {
        const { uuid } = item;
        if (!uuid) {
          return;
        }
        const exists = state.appointmentDetailMulti.some(appointment => appointment.uuid === uuid);
    
        if (!exists) {
          state.appointmentDetailMulti.push({
            ...item,
            sentUuid: meta.arg
          });
        } else {
        }
      });
      state.isDetailLoading = false;
    });
    
    builder.addCase(updateAppointmentDetail.pending, (state, action) => {
    });
    builder.addCase(updateAppointmentDetail.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
    });
    builder.addCase(updateAppointmentDetail.fulfilled, (state, { payload }) => {
      console.log(state, payload, 'fulfilled');
    
    });

    builder.addCase(getFiltersData.pending, (state, action) => {
      state.isFilterDataLoading = true;
    });
    builder.addCase(getFiltersData.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
      state.isFilterDataLoading = false;
    });
    builder.addCase(getFiltersData.fulfilled, (state, { payload }) => {
      state.appointmentFiltersData = sortArraysInObject(payload);
      state.isFilterDataLoading = false;
    });

    builder.addCase(getSelectedFilterList.pending, (state, action) => {
      state.isFilterDataLoading = true;
    });
    builder.addCase(getSelectedFilterList.rejected, (state, action) => {
      // console.log(state, action, 'rejected');
      state.isFilterDataLoading = false;
    });
    builder.addCase(getSelectedFilterList.fulfilled, (state, { payload }) => {
      state.selectedFilterList = sortObjectsByName(payload);;
      state.isFilterDataLoading = false;
    });

    builder.addCase(getSelectedFilterDetail.fulfilled, (state, { payload }) => {
      state.selectedFilterDetail = payload;
    });
    builder.addCase(getAllAppointments.fulfilled, (state, { payload }) => {
      state.appointmentsData.results = updateAppointment(current(state)?.appointmentsData?.results, current(state)?.appointmentDetail[0], payload);
    });
  },
});

const appointmentsList = (previousAppointments: any, payload: any) => {
  var clonesPreviousAppointments = new Array(previousAppointments)[0] || [];
  if (clonesPreviousAppointments && payload?.results) {
    var dummyArray = payload.results;
    clonesPreviousAppointments = clonesPreviousAppointments.concat(dummyArray);

    const uniqueAppointments = clonesPreviousAppointments.filter((obj: { uuid: any; }, index: any, self: any[]) =>
      index === self.findIndex((t: { uuid: any; }) => (
        t.uuid === obj.uuid
      ))
    );

    const initialData = {
      results: uniqueAppointments,
      count: payload.count,
      next: payload.next,
      previous: payload.previous
    };
    return initialData;
  }
  return {
    results: [],
    count: 0,
    next: '',
    previous: ''
  }
};

const updateAppointment = (allAppointment: any, selectedAppointment: any, payload: any) => {
  const updatedAppointment = payload?.results?.find((e: any) => e.uuid === selectedAppointment?.appointment_id);
  let appointments: any[] = [];
  allAppointment.forEach((obj: any) => {
    if (obj.uuid === selectedAppointment?.appointment_id) {
      obj = updatedAppointment;
    }
    appointments.push(obj);
  });
  return appointments;
}

export const { locationData, updateFilter, emptyAppointmentList, emptySelectedFilter } = appointment.actions;
export default appointment.reducer;
