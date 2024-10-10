import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { Container } from "@mui/material";
import renameFilter from "../../images/renameFilter.svg"

import {
  ModalHeader,
  ModalHeaderIcon,
  DialogTitleInner,
  DialogContentTextInner,
  DialogContent,
  InputTitleInner,
  DialogActionsMain,
  ButtonSave,
  ButtonCancel,
  TextFieldInput,
  DialogContentTexts,
  CharacterCountText,
} from "../../styles/customStyle";
import { useEffect } from "react";

const SaveTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SaveFilterModal = (props: any) => {
  const { isModalOpen, modalToggle, filterName, setFilterName, setFilterName2, createFilter, isEditModalOpen, selectedFilterDetail, closeModal } = props;

  return (
    <React.Fragment>
      <Dialog
        sx={{ zIndex: "99999" }}
        PaperProps={{ sx: { borderRadius: "12px", width: "400px" } }}
        open={isModalOpen}
        TransitionComponent={SaveTransition}
        keepMounted
        onClose={() => closeModal()}
        aria-describedby="alert-dialog-slide-description"
      >
        <ModalHeader>
          <ModalHeaderIcon>
            <img src={renameFilter.src} />
          </ModalHeaderIcon>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={() => closeModal()} />
        </ModalHeader>

        <DialogContent>
          <DialogTitleInner>{isEditModalOpen ? "Rename filter" : "Save a filter"}</DialogTitleInner>
          <DialogContentTexts id="alert-dialog-slide-description">
            <DialogContentTextInner>
              Using a set of filters regularly, save it to reuse.
            </DialogContentTextInner>
          </DialogContentTexts>
        </DialogContent>

        <Container>
          <InputTitleInner>Filter name</InputTitleInner>
          <TextFieldInput
            value={filterName}
            id="fullWidth"
            placeholder="AWV+PVD"
            onChange={setFilterName}
            maxLength={200}
            sx={{
              '::placeholder': {
                color: '#ddd',
              }
            }}
          />
          <CharacterCountText>200 Characters Limit</CharacterCountText>
          <DialogActionsMain>
            <ButtonCancel onClick={() => closeModal()}>Cancel</ButtonCancel>
            <ButtonSave
              onClick={() => createFilter(isEditModalOpen)}
              disabled={filterName?.length === 0}
            >
              {isEditModalOpen ? "Update" : "Save"}
            </ButtonSave>
          </DialogActionsMain>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};

export default SaveFilterModal;
