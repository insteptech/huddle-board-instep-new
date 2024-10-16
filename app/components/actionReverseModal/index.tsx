import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import featuredIcon from "../../images/featuredicon.svg"
import reverseIcon from "../../images/reverseIcon.svg"
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

const ActionReverse = (props: any) => {

    const { reverseModal, setReverseModal , updateOutCome , actionValue } = props;
    const [displayvalue, setDisplayValue] = useState("");

    const actionConfirmationDelete = () => {
        setReverseModal(!reverseModal)
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
                open={reverseModal}
                TransitionComponent={DeleteTransition}
                keepMounted
                onClose={() => actionConfirmationDelete()}
                aria-describedby="alert-dialog-slide-description"
            >
                <ModalHeader>
                    <img src={reverseIcon.src} />
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={() => actionConfirmationDelete()} />
                </ModalHeader>
                <DialogContent sx={{ paddingBottom: "0" }}>
                    <DialogTitleInner>{" Reverse Action Confirmed?"}</DialogTitleInner>

                    <DialogContentTexts id="alert-dialog-slide-description">
                        <DialogContentTextInner>
                            Are you sure you want to revert the recent action? <br />Click 'Undo' to Return to previous state
                        </DialogContentTextInner>
                    </DialogContentTexts>
                </DialogContent>

                <Container>
                    <DialogActionsMain>
                       
                        <ButtonCancel onClick={() => actionConfirmationDelete()}>Cancel</ButtonCancel>
                        <ButtonConfirm onClick={() => updateOutCome(actionValue.value, actionValue.data , actionValue.detail)}>Undo</ButtonConfirm>
                    </DialogActionsMain>
                </Container>
            </Dialog>
        </React.Fragment>
    );
};

export default ActionReverse;
