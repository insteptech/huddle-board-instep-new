'use client'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
    Stack,
    IconButton,
    TableRow,
    TableCell,
    Collapse,
    Table,
    TableHead,
    TableBody,
    Tooltip, CircularProgress,
} from '@mui/material';
import { LoaderBox } from '../../styles/customStyle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
    FontBold,
    StyledText,
    StyledTableRow,
    TdTableCell,
    StyledName,
    StyledCopy,
    IconProgress,
    BorderLinearProgress,
    ProviderCell,
    TableMidData,
    SpanText,
    ActionBtn,
    Text,
    StyledMuiButton,
    StyledPatient,
    TestButton,
    TableRowInside,
    TableMidIn
} from '@/app/styles/customStyle';

import { getOutComeBtnState } from '@/app/utils/appointment';
import { getTime } from '@/app/utils/helper';
import ActionConfirmation from '../actionConfirmationModal';
import ActionReverse from '../actionReverseModal';
import { AppDispatch, AppState } from '@/app/redux/store';
import { getAppointmentDetailMulti } from '@/app/redux/actions/appointment';
import { useDispatch, useSelector } from 'react-redux';

function GetScreening({ screening }: { screening: string[] }) {
    return (
        <>
            {screening.slice(0, 3).map((screen, index) => (
                <SpanText key={index}>{index < 3 ? screen : ''}</SpanText>
            ))}
            {screening.length > 3 && <SpanText>+ {screening.length - 3}</SpanText>}
        </>
    );
}



const Row = (props: any) => {
    const { appointment, appointmentsList, newbuttonState, selectedAppointmentUuid, firstElementRef, id, expand, selectedAppointmentGap, setExpand, setSelectedAppointmentGap, loaderAppoint, setSelectedAppointmentUuid, reverseModal, updateButtonState, setReverseModal, setLoaderAppoint, appointmentDetails, appointmentDetail, updateOutCome, isDetailLoading, confirmationModal, setConfirmationModal, actionValue } = props;
    const [open, setOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const appointmentDetailMulti = useSelector((state: AppState) => state.appointment?.appointmentDetailMulti) || [];


    console.log(appointmentDetailMulti ,"appointmentDetailMulti");

    // useEffect(() => {
    //     if (expand === true) {
    //         setOpen(false)
    //     }
    // }, [])

    useEffect(()=>{
       if(expand === true){
        for(let i=1; i<10; i++){
            dispatch(getAppointmentDetailMulti({ appointment_id: appointmentsList[i].uuid }))
        }
       }
    }, [expand, appointmentDetailMulti])

    const setRow = (id: any, gap?: number) => {
        setLoaderAppoint(true);
        setSelectedAppointmentUuid(id);
        appointmentDetails(id);
        setSelectedAppointmentGap(gap);
        setOpen(!open);
        setExpand(false)

    };

    const copyMrn = (mrn: any) => {
        navigator.clipboard.writeText(mrn);
        setIsCopied(true);
    }

    const renderCellContent = (content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, isBold: boolean) => (
        isBold ? <FontBold>{content}</FontBold> : <StyledText>{content}</StyledText>
    );

    return (
        <>
            <StyledTableRow ref={appointment.uuid === id ? firstElementRef : null} onClick={() => setRow(appointment?.uuid, appointment?.selected_gap_count)} sx={{ '& > *': { borderBottom: 'unset', backgroundColor: ((open && selectedAppointmentUuid === appointment.uuid) || expand) ? '#D2E6FF' : '#fff' } }}>
                <TdTableCell>
                    {renderCellContent(getTime(appointment.appointment_timestamp), appointment.selected_gap_count === 0)}
                </TdTableCell>
                <TdTableCell>
                    <StyledName>
                        <StyledPatient>{renderCellContent(appointment.patient_name, appointment.selected_gap_count === 0)}</StyledPatient>
                        <StyledCopy>
                            MRN: {appointment.mrn}
                            <Tooltip title={isCopied ? "Copied" : "Copy"} placement="top">
                                <ContentCopyIcon
                                    onClick={() => copyMrn(appointment.mrn)}
                                    sx={{ verticalAlign: 'middle', color: '#17236D', fontSize: '15px', marginLeft: '5px' }}
                                />
                            </Tooltip>
                        </StyledCopy>
                    </StyledName>
                </TdTableCell>
                <TdTableCell>{renderCellContent(appointment.visit_type, appointment.selected_gap_count === 0)}</TdTableCell>
                <TdTableCell>{renderCellContent(appointment.provider, appointment.selected_gap_count === 0)}</TdTableCell>
                <TdTableCell><GetScreening screening={appointment.screening} /></TdTableCell>

                <TdTableCell>
                    {
                        appointment.selected_gap_count === 0 ?
                            <IconProgress>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <BorderLinearProgress sx={{ minWidth: "40px", maxWidth: "80px" }} variant="determinate" value={0} />
                                </Stack>
                                <ProviderCell>{`${appointment.selected_gap_count}/${appointment.gap_count}`}</ProviderCell>
                                <IconButton aria-label="expand appointment" size="small" onClick={() => setRow(appointment.uuid)}>
                                    {(open && selectedAppointmentUuid === appointment.uuid || expand) ? <><Tooltip title="Collapse" placement="top"><KeyboardArrowUpIcon /></Tooltip></> : <><Tooltip title="Expand" placement="top"><KeyboardArrowDownIcon /></Tooltip></>}
                                </IconButton>
                            </IconProgress>
                            :
                            <IconProgress>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <BorderLinearProgress sx={{ minWidth: "40px", maxWidth: "80px" }} variant="determinate" value={(appointment.selected_gap_count / appointment.gap_count) * 100} />
                                </Stack>
                                <ProviderCell>{`${selectedAppointmentGap || appointment.selected_gap_count}/${appointment.gap_count}`}</ProviderCell>
                                <IconButton aria-label="expand appointment" size="small" onClick={() => setRow(appointment.uuid, appointment.selected_gap_count)}>
                                    {(open && selectedAppointmentUuid === appointment.uuid || expand) ? <><Tooltip title="Collapse" placement="top"><KeyboardArrowUpIcon /></Tooltip></> : <><Tooltip title="Expand" placement="top"><KeyboardArrowDownIcon /></Tooltip></>}
                                </IconButton>
                            </IconProgress>
                    }
                </TdTableCell>
            </StyledTableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: '0' }} colSpan={6}>
                    <Collapse in={(open && selectedAppointmentUuid === appointment.uuid || expand)} timeout="auto" unmountOnExit>
                        <Box>
                            {
                                appointment.gap_count === 0 ? <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableMidData sx={{ textAlign: "center", fontWeight: "600", padding: "25px 0", backgroundColor: "#EBF4FF", border: "1px solid #B1C6E2 !important" }}>No Screening Data Available</TableMidData>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                                    :
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRowInside>
                                                <TableMidData>Screening</TableMidData>
                                                <TableMidData>Action</TableMidData>
                                                <TableMidData>Reason</TableMidData>
                                                <TableMidData sx={{ width: '430px' }}>Outcome</TableMidData>
                                            </TableRowInside>
                                        </TableHead>

                                        {
                                            loaderAppoint ?
                                                <TableBody>
                                                    <TableRow>
                                                        <TableMidData colSpan={12} >
                                                            <LoaderBox sx={{ width: "100%", margin: "25px 0", height: "0" }}>
                                                                <CircularProgress />
                                                                Loading Actions
                                                            </LoaderBox>
                                                        </TableMidData>
                                                    </TableRow>
                                                </TableBody>
                                                :
                                               expand?  (
                                                <TableBody>
                                                    {!isDetailLoading && appointmentDetailMulti.filter((item:any)=>item?.sentUuid?.appointment_id === appointment.uuid).map((detail: any) => (
                                                        <TableRowInside key={detail.uuid}>
                                                            <TableMidData><SpanText>{detail.screening}</SpanText></TableMidData>
                                                            <TableMidData><ActionBtn>{detail.action}</ActionBtn></TableMidData>
                                                            <TableMidData sx={{ width: '380px', }}><Text><Tooltip title={detail.description} placement="top">{detail.description}</Tooltip></Text></TableMidData>
                                                            <TableMidData sx={{ width: '430px' }}>
                                                                <TableMidIn>
                                                                    <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'clinician_agrees')} onClick={() => updateButtonState('clinician_agrees', getOutComeBtnState(detail, 'clinician_agrees'), detail)}>
                                                                        Clinician Agrees
                                                                    </StyledMuiButton>
                                                                    <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'clinician_disagrees')} onClick={() => updateButtonState('clinician_disagrees', getOutComeBtnState(detail, 'clinician_disagrees'), detail)}>
                                                                        Clinician Disagrees
                                                                    </StyledMuiButton>
                                                                    {detail.show_test_ordered ? <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'test_ordered')} onClick={() => updateButtonState('test_ordered', getOutComeBtnState(detail, 'test_ordered'), detail)}>
                                                                        Test Ordered
                                                                    </StyledMuiButton> :
                                                                        <TestButton><Tooltip title="This screening does not have test required" placement="top"><InfoOutlinedIcon sx={{ marginRight: '3px', width: '20px' }} /></Tooltip>Test Not Needed</TestButton>
                                                                    }

                                                                </TableMidIn>
                                                            </TableMidData>
                                                        </TableRowInside>
                                                    ))}
                                                </TableBody>
                                            ) :  (
                                                <TableBody>
                                                    {!isDetailLoading && appointmentDetail.map((detail: any) => (
                                                        <TableRowInside key={detail.uuid}>
                                                            <TableMidData><SpanText>{detail.screening}</SpanText></TableMidData>
                                                            <TableMidData><ActionBtn>{detail.action}</ActionBtn></TableMidData>
                                                            <TableMidData sx={{ width: '380px', }}><Text><Tooltip title={detail.description} placement="top">{detail.description}</Tooltip></Text></TableMidData>
                                                            <TableMidData sx={{ width: '430px' }}>
                                                                <TableMidIn>
                                                                    <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'clinician_agrees')} onClick={() => updateButtonState('clinician_agrees', getOutComeBtnState(detail, 'clinician_agrees'), detail)}>
                                                                        Clinician Agrees
                                                                    </StyledMuiButton>
                                                                    <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'clinician_disagrees')} onClick={() => updateButtonState('clinician_disagrees', getOutComeBtnState(detail, 'clinician_disagrees'), detail)}>
                                                                        Clinician Disagrees
                                                                    </StyledMuiButton>
                                                                    {detail.show_test_ordered ? <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'test_ordered')} onClick={() => updateButtonState('test_ordered', getOutComeBtnState(detail, 'test_ordered'), detail)}>
                                                                        Test Ordered
                                                                    </StyledMuiButton> :
                                                                        <TestButton><Tooltip title="This screening does not have test required" placement="top"><InfoOutlinedIcon sx={{ marginRight: '3px', width: '20px' }} /></Tooltip>Test Not Needed</TestButton>
                                                                    }

                                                                </TableMidIn>
                                                            </TableMidData>
                                                        </TableRowInside>
                                                    ))}
                                                </TableBody>
                                            )
                                        }
                                        <ActionConfirmation actionValue={actionValue} confirmationModal={confirmationModal} setConfirmationModal={setConfirmationModal} updateOutCome={updateOutCome} />
                                        <ActionReverse actionValue={actionValue} reverseModal={reverseModal} setReverseModal={setReverseModal} updateOutCome={updateOutCome} />
                                    </Table>
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default Row;