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
    CircularProgress,
} from '@mui/material';
import { LoaderBox } from '../../styles/customStyle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
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
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

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

    // useEffect(() => {
    //     if (expand === true) {
    //         setOpen(false)
    //     }
    // }, [])

    useEffect(() => {
        if (expand === true) {
            for (let i = 0; i < appointmentsList.length; i++) {
                dispatch(getAppointmentDetailMulti({ appointment_id: appointmentsList[i]?.uuid }))
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
    const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
            maxWidth: '170px', // Maximum width
            width: 'auto',     // Set width to auto to adapt to content
            whiteSpace: 'normal', // Allow text to wrap within the tooltip
        },
    }));

    return (
        <>
            <StyledTableRow ref={appointment.uuid === id ? firstElementRef : null} onClick={() => setRow(appointment?.uuid, appointment?.selected_gap_count)} sx={{
                border: 'none',
                '& > *': {
                    borderBottom: '0', 'td': {

                    }, backgroundColor: ((open && selectedAppointmentUuid === appointment.uuid) || expand) ? '#D2E6FF' : '#fff'
                }
            }}>
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
                                    {(open && selectedAppointmentUuid === appointment.uuid || expand) ? <><Tooltip title="Collapse" placement="top"><KeyboardArrowUpIcon sx={{
                                        color: 'black',
                                        border: '1px solid black',
                                        height: '16px',
                                        width: '16px',
                                        marginLeft: '20px',
                                        borderRadius:'50%'
                                    }} /></Tooltip></> : <><Tooltip title="Expand" placement="top"><KeyboardArrowDownIcon sx={{
                                        color: 'black',
                                        border: '1px solid black',
                                        height: '16px',
                                        width: '16px',
                                        marginLeft: '20px',
                                        borderRadius:'50%'
                                    }} /></Tooltip></>}
                                </IconButton>
                            </IconProgress>
                            :
                            <IconProgress>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <BorderLinearProgress sx={{ minWidth: "40px", maxWidth: "80px" }} variant="determinate" value={(appointment.selected_gap_count / appointment.gap_count) * 100} />
                                </Stack>
                                <ProviderCell>{`${selectedAppointmentGap || appointment.selected_gap_count}/${appointment.gap_count}`}</ProviderCell>
                                <IconButton aria-label="expand appointment" size="small" onClick={() => setRow(appointment.uuid, appointment.selected_gap_count)}>
                                    {(open && selectedAppointmentUuid === appointment.uuid || expand) ? <><Tooltip title="Collapse" placement="top"><KeyboardArrowUpIcon sx={{
                                        color: 'black',
                                        border: '1px solid black',
                                        height: '16px',
                                        width: '16px',
                                        marginLeft: '20px',
                                        borderRadius:'50%'
                                    }} /></Tooltip></> : <><Tooltip title="Expand" placement="top"><KeyboardArrowDownIcon sx={{
                                        color: 'black',
                                        border: '1px solid black',
                                        height: '16px',
                                        width: '16px',
                                        marginLeft: '20px',
                                        borderRadius:'50%'
                                    }} /></Tooltip></>}
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
                                                <TableMidData sx={{ width: '180px' }}>Outcome</TableMidData>
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
                                                expand ? (
                                                    <TableBody>
                                                        {!isDetailLoading && appointmentDetailMulti.filter((item: any) => item?.sentUuid?.appointment_id === appointment.uuid).map((detail: any) => (
                                                            <TableRowInside key={detail.uuid}>
                                                                <TableMidData><SpanText>{detail.screening}</SpanText></TableMidData>
                                                                <TableMidData sx={{ width: "20%" }}><ActionBtn>{detail.action}</ActionBtn></TableMidData>
                                                                <TableMidData ><Text><Tooltip title={detail.description} placement="top">{detail.description}</Tooltip></Text></TableMidData>
                                                                <TableMidData sx={{ width: '180px' }}>
                                                                    <TableMidIn>
                                                                        <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'accept')} onClick={() => updateButtonState('accept', getOutComeBtnState(detail, 'accept'), detail)}>
                                                                            {getOutComeBtnState(detail, 'accept') === "enable" ? "Accept" : "Accepted"}
                                                                        </StyledMuiButton>
                                                                        <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'reject')} onClick={() => updateButtonState('reject', getOutComeBtnState(detail, 'reject'), detail)}>
                                                                            {getOutComeBtnState(detail, 'reject') === "enable" ? "Reject" : "Rejected"}
                                                                        </StyledMuiButton>
                                                                        {/* {detail.show_test_ordered ? <StyledMuiButton buttonstate={getOutComeBtnState(detail, 'test_ordered')} onClick={() => updateButtonState('test_ordered', getOutComeBtnState(detail, 'test_ordered'), detail)}>
                                                                        Test Ordered
                                                                    </StyledMuiButton> :
                                                                        <TestButton><Tooltip title="This screening does not have test required" placement="top"><InfoOutlinedIcon sx={{ marginRight: '3px', width: '20px' }} /></Tooltip>Test Not Needed</TestButton>
                                                                    } */}

                                                                    </TableMidIn>
                                                                </TableMidData>
                                                            </TableRowInside>
                                                        ))}
                                                    </TableBody>
                                                ) : (
                                                    <TableBody>
                                                        {!isDetailLoading && appointmentDetail.map((detail: any) => (
                                                            <TableRowInside key={detail.uuid}>
                                                                <TableMidData><SpanText>{detail.screening}</SpanText></TableMidData>
                                                                <TableMidData sx={{ width: "20%" }}><ActionBtn>{detail.action}</ActionBtn></TableMidData>
                                                                <TableMidData ><Text><Tooltip title={detail.description} placement="top">{detail.description}</Tooltip></Text></TableMidData>
                                                                <TableMidData sx={{ width: '180px' }}>
                                                                    <TableMidIn>
                                                                        <BootstrapTooltip PopperProps={{
                                                                            modifiers: [
                                                                                {
                                                                                    name: 'flip',
                                                                                    enabled: true,
                                                                                    options: {
                                                                                        altBoundary: true,
                                                                                        rootBoundary: 'viewport',
                                                                                        padding: 8,
                                                                                    },
                                                                                },
                                                                                {
                                                                                    name: 'preventOverflow',
                                                                                    enabled: true,
                                                                                    options: {
                                                                                        altAxis: true,
                                                                                        tether: true,
                                                                                        rootBoundary: 'viewport',
                                                                                        padding: 8,
                                                                                    },
                                                                                },
                                                                            ],
                                                                        }} placement="top-start"
                                                                            title={(getOutComeBtnState(detail, 'accept') === "active") ? "You can reverse you action by clicking on same button again." : ""}
                                                                            arrow

                                                                        >
                                                                            <StyledMuiButton
                                                                                buttonstate={getOutComeBtnState(detail, 'accept')}
                                                                                onClick={() => updateButtonState('accept', getOutComeBtnState(detail, 'accept'), detail)}
                                                                            >

                                                                                {(getOutComeBtnState(detail, 'accept') === "enable" || getOutComeBtnState(detail, 'reject') === "active") ? "Accept" : "Accepted"}
                                                                            </StyledMuiButton>
                                                                        </BootstrapTooltip>

                                                                        <BootstrapTooltip placement='top-start'
                                                                            title={(getOutComeBtnState(detail, 'reject') === "active") ? "You can reverse you action by clicking on same button again." : ""}
                                                                            arrow
                                                                        // Tooltip background color
                                                                        >
                                                                            <StyledMuiButton
                                                                                buttonstate={getOutComeBtnState(detail, 'reject')}
                                                                                onClick={() => updateButtonState('reject', getOutComeBtnState(detail, 'reject'), detail)}
                                                                            >
                                                                                {(getOutComeBtnState(detail, 'reject') === "enable" || getOutComeBtnState(detail, 'accept') === "active") ? "Reject" : "Rejected"}
                                                                            </StyledMuiButton>
                                                                        </BootstrapTooltip>

                                                                    </TableMidIn>
                                                                </TableMidData>
                                                            </TableRowInside>
                                                        ))}
                                                    </TableBody>
                                                )
                                        }

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