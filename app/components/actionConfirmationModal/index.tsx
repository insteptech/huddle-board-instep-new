import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import confirmIcon from "../../images/confirmIcon.svg"
import { Container } from "@mui/material";
import {
    ButtonCancel,
    DialogActionsMain,
    DialogContentTextInner,
    DialogContentTexts,
    DialogTitleInner,
    ModalHeader,
    ButtonDelete,
    ButtonConfirm,
} from "@/app/styles/customStyle";

const DeleteTransition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ActionConfirmation = (props: any) => {

    const { confirmationModal, setConfirmationModal, actionValue, updateOutCome } = props;
    const [displayvalue, setDisplayValue] = useState("");

    const actionConfirmationDelete = () => {
        setConfirmationModal(!confirmationModal)
    }

    useEffect(() => {
        if (actionValue.value == "accept") {
            setDisplayValue("Accept")
        }

        else if (actionValue.value == "reject") {
            setDisplayValue("Reject")
        }

        else if (actionValue.value == "test_ordered") {
            setDisplayValue("Test Ordered")
        }

        else {
            setDisplayValue("")
        }
    })

    return (
        <React.Fragment>
            <Dialog
                sx={{ zIndex: "99999" }}
                PaperProps={{ sx: { borderRadius: "12px", width: "400px" } }}
                open={confirmationModal}
                TransitionComponent={DeleteTransition}
                keepMounted
                onClose={() => actionConfirmationDelete()}
                aria-describedby="alert-dialog-slide-description"
            >
                <ModalHeader>
                    <img src={confirmIcon.src} />
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={() => actionConfirmationDelete()} />
                </ModalHeader>
                <DialogContent sx={{ paddingBottom: "0" }}>
                    <DialogTitleInner>{"Are you sure?"}</DialogTitleInner>

                    <DialogContentTexts id="alert-dialog-slide-description">
                        <DialogContentTextInner>
                            You want to select Outcome as "<span style={{ fontWeight: 700 }}>{displayvalue}".</span>
                        </DialogContentTextInner>
                    </DialogContentTexts>
                </DialogContent>

                <Container>
                    <DialogActionsMain>

                        <ButtonCancel onClick={() => actionConfirmationDelete()}>Cancel</ButtonCancel>
                        <ButtonConfirm onClick={() => updateOutCome(actionValue.value, actionValue.data, actionValue.detail)}>Confirm</ButtonConfirm>
                    </DialogActionsMain>
                </Container>
            </Dialog>
        </React.Fragment>
    );
};

export default ActionConfirmation;
