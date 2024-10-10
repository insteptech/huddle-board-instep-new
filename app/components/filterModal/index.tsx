import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Container} from "@mui/material";
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import TextField from '@mui/material/TextField';

//   delete filter 
const DelteTransition= React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

// save filter
const SaveTransition= React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
const FilterModal =(props:any)=> {
    const [open, setOpen] = React.useState(false);
    const [input , setInput] = React.useState()

    const {filterTitle} = props
  
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleInput=()=>{
        setInput(input)
    }
return (
    <React.Fragment>
        {/* delete a filter */}
        <Button variant="outlined" onClick={handleClickOpen}> 
        Delete
      </Button>
      <Dialog
        open={open}
        TransitionComponent={DelteTransition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Container sx={{ display:"flex" , justifyContent:"space-between" , marginTop:"10px"}}>
        <DeleteOutlineOutlinedIcon  color="warning"/>
        <CloseIcon onClick = {handleClose}/>
        </Container>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-slide-description">
            You want to delete this saved filter.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{marginBottom:"10px"}}>
          <Button onClick={handleClose} variant="contained" sx={{backgroundColor:"#FFFFFF" , border: "1px solid #D0D5DD" , color:"#344054" , width:"50%" , textTransform:"capitalize"}}>Cancle</Button>
          <Button onClick={handleClose} variant="contained" sx={{backgroundColor:"#D92D20" , border: "1px solid #D92D20" , color:"#FFFFFF" , width:"50%" , textTransform:"capitalize"}}>Delete</Button>
        </DialogActions>
      </Dialog>
     
      {/* save a filter */}
      {/* <Button variant="outlined" onClick={handleClickOpen}>
          Save Filter
        </Button>
        <Dialog
          open={open}
          TransitionComponent={SaveTransition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <Container sx={{ display:"flex" , justifyContent:"space-between" , marginTop:"10px"}}>
          <OutlinedFlagOutlinedIcon fontSize="large" sx={{border:"1px solid #EAECF0" , padding:"7px", borderRadius:"5px" }}/>
          <CloseIcon onClick={handleClose}/>
          </Container>
         
          <DialogTitle>{"Save a filter"}</DialogTitle>
          <DialogContent >
            <DialogContentText id="alert-dialog-slide-description">
              Using a set of filters regularly, save it to reuse.
            </DialogContentText>
          </DialogContent>
          <Container>
            Filter
            <TextField fullWidth id="fullWidth" size="small" placeholder="AWV+PVD" onChange={handleInput}/>
          <DialogActions sx={{marginBottom:"10px"}}>
            <Button onClick={handleClose} variant="contained" sx={{backgroundColor:"#FFFFFF" , border: "1px solid #D0D5DD" , color:"#344054" , width:"50%" , textTransform:"capitalize"}}>Cancle</Button>
            <Button onClick={handleClose} variant="contained" sx={{backgroundColor:"#17236D" ,border: "1px solid #17236D" , color:"#FFFFFF" , width:"50%" , textTransform:"capitalize"}}>Save</Button>
          </DialogActions>
          </Container>    
        </Dialog>
       */}
    </React.Fragment>
  );
}


export default FilterModal;
