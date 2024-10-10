'use client'
import React, { useState } from 'react';
import FourBackground from "../../images/FourBackground.svg";
import Logo from "../../images/Logo.svg";
import laptopScreen from "../../images/laptopScreen.svg";
import {
  ListLoginItem,
  MidContentSection,
  MidContentRight,
  ContentOnTop,
  MidContentLeft,
  ListLogin,
  ContentBottom,
  ContentBottomBold,
  BoxContentLogin,
  ButtonLogin,
  BoxSection,
  BoxImgLog,
} from '../../styles/customStyle';
import UnauthorizedModal from '@/app/components/unAuthorizedModal';
import { useDispatch } from 'react-redux';
import { contactSupport } from '@/app/redux/actions/auth';
import { AppDispatch } from '@/app/redux/store';
import local from 'next/font/local';
import { toast } from 'react-toastify';

const Unauthorized = () => {

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();


  const handleSubscriptionClick = () => {
    const refEmail: any = localStorage.getItem('refEmail');
    const payload = {
      email: refEmail
    }

    if (refEmail === "") {
      toast.error('Already Contacted Support');
      return
    }

    dispatch(contactSupport(payload))
      .then((result: any) => {
        setOpen(!open)
        toast.success('Successfull');
        localStorage.setItem('refEmail', "")
      })
      .catch((error) => {
        toast.error('Error contacting support');
      });
  }



  return (
    <BoxSection sx={{ backgroundImage: `url(${FourBackground.src})`, }} className='page-not-found'>
      <BoxContentLogin>
        <BoxImgLog> <img src={Logo.src} /> </BoxImgLog>
        <ContentOnTop>Unfortunately, your current subscription doesn’t<br /> include our Huddle Board feature. </ContentOnTop>
        <MidContentSection>
          <MidContentLeft>
            <img src={laptopScreen.src} />
          </MidContentLeft>
          <MidContentRight>
            <ListLogin>
              <ListLoginItem >
                The Huddle Board provides scribes, MAs, chart preppers and other clinical users with a comprehensive view of clinical action items for past, current, and future patient appointments.
              </ListLoginItem >
              <ListLoginItem >
                Users can view appointment times, patient names, visit types, and screening tests or conditions for each patient – as well as any actions to be taken.
              </ListLoginItem >
              <ListLoginItem >
                This feature optimizes clinical workflows and improves healthcare delivery by helping users prepare and document more efficiently .
              </ListLoginItem >
            </ListLogin>
          </MidContentRight>
        </MidContentSection>
        <ContentBottom>The huddle board is a powerful tool to help clinical and non-clinical staff more effectively<br /> manage their time and deliver exceptional patient care.</ContentBottom>
        <ContentBottomBold>Contact DoctusTech support to add it to your subscription today.</ContentBottomBold>
        <ButtonLogin onClick={() => handleSubscriptionClick()}>Contact Support</ButtonLogin>

      </BoxContentLogin>
      <UnauthorizedModal open={open} setOpen={setOpen} />
    </BoxSection>
  );
};

export default Unauthorized;