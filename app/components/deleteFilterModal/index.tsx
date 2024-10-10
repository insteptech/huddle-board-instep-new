import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import featuredIcon from "../../images/featuredicon.svg"
import { Container } from "@mui/material";
import {
  ButtonCancel,
  DialogActionsMain,
  DialogContentTextInner,
  DialogContentTexts,
  DialogTitleInner,
  ModalHeader,
  ButtonDelete,
} from "@/app/styles/customStyle";

const DeleteTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteFilterModal = (props: any) => {
  const { isModalOpen, modalToggle, deleteFilterDetail, deleteModalClose } = props;

  return (
    <React.Fragment>
      <Dialog
        sx={{ zIndex: "99999" }}
        PaperProps={{ sx: { borderRadius: "12px", width: "400px" } }}
        open={isModalOpen}
        TransitionComponent={DeleteTransition}
        keepMounted
        onClose={()=>deleteModalClose()}
        aria-describedby="alert-dialog-slide-description"
      >
        <ModalHeader>
        <img src={featuredIcon.src}/>       
          <CloseIcon sx={{ cursor: "pointer" }} onClick={()=>deleteModalClose()} />
        </ModalHeader>
        <DialogContent sx={{ paddingBottom: "0" }}>
          <DialogTitleInner>{"Are you sure?"}</DialogTitleInner>

          <DialogContentTexts id="alert-dialog-slide-description">
            <DialogContentTextInner>
              You want to delete this saved filter.
            </DialogContentTextInner>
          </DialogContentTexts>
        </DialogContent>

        <Container>
          <DialogActionsMain>
            <ButtonCancel onClick={()=>deleteModalClose()}>Cancel</ButtonCancel>
            <ButtonDelete onClick={()=>deleteFilterDetail()}>Delete</ButtonDelete>
          </DialogActionsMain>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteFilterModal;
