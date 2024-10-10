'use client'
import React from 'react';
import FourBackground from "../../images/FourBackground.svg"
import Logo from "../../images/Logo.svg"

import {
    ExpiredBoxContent,
    ExpiredBoldContent,
    ExpiredBoxTopContent,
    BoxContimg,
    ExpiredBoxSection,
} from '../../styles/customStyle';

const ExpiredToken = () => {
    return (
        <ExpiredBoxSection sx={{ backgroundImage: `url(${FourBackground.src})`, }} className='page-not-found'>
            <ExpiredBoxContent>
                <BoxContimg> <img src={Logo.src} /> </BoxContimg>
                <ExpiredBoldContent>Session Expired</ExpiredBoldContent>
                <ExpiredBoxTopContent> Unfortunately, your session has expired and to access huddle board again please login the same way you previously did.</ExpiredBoxTopContent>
            </ExpiredBoxContent>
        </ExpiredBoxSection>
    );
};

export default ExpiredToken;