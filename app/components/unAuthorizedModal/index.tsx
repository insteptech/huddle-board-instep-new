import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import modalSupportIcon from "../../images/modalSupportIcon.png"
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

const UnauthorizedModal = (props: any) => {

    const { open, setOpen } = props;

    const closeModal = () => {
        setOpen(!open)
    }

    return (
        <React.Fragment>
            <Dialog
                sx={{ zIndex: "99999" }}
                PaperProps={{ sx: { borderRadius: "12px", width: "400px" } }}
                open={open}
                TransitionComponent={DeleteTransition}
                keepMounted
                onClose={() => closeModal()}
                aria-describedby="alert-dialog-slide-description"
            >
                {/* <ModalHeader>

                     <CloseIcon sx={{ cursor: "pointer" }} onClick={() => closeModal()} />
                </ModalHeader> */}
                <DialogContent sx={{ paddingBottom: "0", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" , textAlign:"center" }}>
                    <img src={modalSupportIcon.src} style={{padding:"10px 0"}} />
                    <DialogTitleInner sx={{padding:"10px 0" , fontSize:"24px" , fontWeight:"700"}}>{"Thank you"}</DialogTitleInner>

                    <DialogContentTexts id="alert-dialog-slide-description">
                        <DialogContentTextInner sx={{padding:"10px 0" , fontSize:"16px" , fontWeight:"600" , color:'black'}}>
                            <span>We've noted your interest in our Huddle Board feature, and will reach out to discuss adding it to your subscription.</span>
                        </DialogContentTextInner>
                    </DialogContentTexts>
                </DialogContent>

                <Container>
                    <DialogActionsMain>
                    </DialogActionsMain>
                </Container>
            </Dialog>
        </React.Fragment>
    );
};

export default UnauthorizedModal;
