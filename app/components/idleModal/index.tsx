import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import IdleModalIcon from "../../images/IdleModalIcon.png"
import { Container } from "@mui/material";
import {
    ButtonCancel,
    DialogActionsMain,
    DialogContentTextInner,
    DialogContentTexts,
    DialogTitleInner,
    ModalHeader,
    ButtonLogout,
    ButtonLogggedIn,
} from "@/app/styles/customStyle";
import { getAndSetAccessToken, refreshTokens } from "@/app/utils/auth";


const DeleteTransition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const IdleModal = (props: any) => {

    
    const isSlug = localStorage.getItem("isSlug");

    const { idleModalOpen, setIdleModalOpen, setIdleTime, idleTimeEnv , idleTime } = props;

    const logoutUser = () => {

        if(isSlug === "true"){
            return;
        }
        
        setIdleModalOpen(false);
        localStorage.clear();
        window.location.href = '/auth/login';
    }

    const stayLoggedIn = () => {
        const slug = localStorage.getItem('slug');
        setIdleModalOpen(false);
        setIdleTime(0)
        refreshTokens();
    }

    return (
        <React.Fragment>
            <Dialog
                sx={{ zIndex: "99999", textAlign: "center" , backdropFilter: 'blur(5px)' }}
                PaperProps={{ sx: { borderRadius: "12px", width: "400px" } }}
                open={idleModalOpen}
                TransitionComponent={DeleteTransition}
                keepMounted
                onClose={() => logoutUser()}
                aria-describedby="alert-dialog-slide-description"
            >
                <ModalHeader sx={{ margin: "10px auto 0 auto" }}>
                    <img src={IdleModalIcon.src} />

                </ModalHeader>
                <DialogContent sx={{ paddingBottom: "0" }}>
                    <DialogTitleInner sx={{ marginBottom: "20px" }}>{" Timeout Warning"}</DialogTitleInner>

                    <DialogContentTexts id="alert-dialog-slide-description">
                        { isSlug === "true" ? <DialogContentTextInner>
                            You have been inactive for {idleTimeEnv} Minutes. For security reasons, you have been automatically logged out.
                        </DialogContentTextInner>
                        :
                        <DialogContentTextInner>
                            You have been inactive for {idleTimeEnv} Minutes. For security reasons, you will be automatically logged out.
                        </DialogContentTextInner>}
                    </DialogContentTexts>
                </DialogContent>

                {isSlug === "true" ? <Container>
                    <DialogActionsMain>
                        

                    </DialogActionsMain>
                </Container> :<Container>
                    <DialogActionsMain>
                        <ButtonLogggedIn onClick={() => stayLoggedIn()}>Stay Logged In</ButtonLogggedIn>
                        <ButtonLogout onClick={() => logoutUser()}>Logout</ButtonLogout>

                    </DialogActionsMain>
                </Container>}
            </Dialog>
        </React.Fragment>
    );
};

export default IdleModal;
