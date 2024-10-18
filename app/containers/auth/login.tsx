'use client'
import { getHuddleBoardConfig, signInWithOtp, verifyOTP } from '@/app/redux/actions/auth';
import { AppDispatch } from '@/app/redux/store';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Logino from "../../images/Logino.svg"
import Leftbg from "../../images/loginleftbg.svg"
import rightbg from "../../images/rightbg.svg"
import TextField from '@mui/material/TextField';
import LoginImage from '../../images/Login.svg'
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  MainLogin, MainLoginleft, MainLoginright, HeadingLeft, ParaLeft,
  LoginForm, LoginLabel,
  LoginTitle,
  LoginActions,
  LoginPolicy,
  LoginContent, LoginId,
  VcCode,
  VerficationPolicy,
  VerificationMaximum,
  Logincode,
  ResendCode,
  LoginWarning,
  LoginForm2
} from "@/app/styles/customStyle";
import { Box, Button, IconButton } from '@mui/material';
import OTP from '@/app/components/otpInpuBox';
import { toast } from 'react-toastify';
import { auditLog } from '@/app/redux/actions/appointment';
import { clearDB } from '@/app/utils/indexeddb';

const Login = () => {
  const searchParam = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const [otp, setOtp] = React.useState('');
  const [email, setEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [counter, setCounter] = useState(0);
  const [isInvalidEmail, setIsInvlidEmail] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [isInvalidEmailFirst, setIsInvlidEmailFirst] = useState(false)

  useEffect(() => {
    // Clear IndexedDB when the component mounts
    clearDB()
      .then(() => {
      })
      .catch((error) => {
        console.error('Error clearing the database:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.clear();

    if (email === "") {
      setIsInvlidEmail(false)
    }
  }, [email])


  const handleEmail = async (event: any) => {
    localStorage.clear();

    if (!email) {
      setErrorMessage('Enter Email Address');
      setIsInvlidEmailFirst(true);
      return
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('No Account found with that email address. Try other email address or contact us for support!');
      setIsInvlidEmailFirst(true);
      return;
    }

    const payload = {
      email: email
    }
    let [username, domain] = email.split('@');
    let [newdomain, provider] = domain.split('.');

    let maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    let maskedDomain = newdomain.charAt(0) + '*'.repeat(newdomain.length - 2) + newdomain.charAt(newdomain.length - 1);
    let maskedEmail = maskedUsername + '@' + maskedDomain + '.' + provider;
    setMaskedEmail(maskedEmail)

    dispatch(signInWithOtp(payload))
      .then(response => {
        if (response?.payload?.message) {
          setCounter(counter + 1)
          setOtpSent(true);
        }
        if (response?.payload?.error) {
          setErrorMessage('No Account found with that email address, Try other email address or contact us for support');
          setIsInvlidEmail(true)
        }
      })
  }

  const handleReverse = () => {
    setOtpSent(!otpSent)
    setEmail("")
    setOtp('')
  }

  const handleOtpVerification = () => {
    const payload = {
      email: email,
      otp: otp
    }

    dispatch(verifyOTP(payload))
      .then(response => {
        if (response?.meta?.requestStatus === "fulfilled") {
          dispatch(auditLog([{ event_type: "FRONTEND_LOGIN_SUCCESS", output: "FRONTEND_LOGIN_SUCCESS", misc_info: "FRONTEND Login Using OTP Success" }]))
          const refresh = localStorage.setItem("refresh_token", response?.payload?.refresh);
          const access = localStorage.setItem("access_token", response?.payload?.access);
          const emails = localStorage.setItem("email", email);

          if (access !== null && refresh !== null && emails !== null) {
            dispatch(getHuddleBoardConfig()).then((res: any) => {
              localStorage.setItem('huddleBoardConfig', JSON.stringify(res.payload));
              router.push('/appointment');
            });
          }
          toast.success("OTP verification successful", {
            toastId: 'success1',
          })
          localStorage.setItem('huddleBoardConfig', JSON.stringify(response.payload));

        }
      })
      .catch(error => {
        dispatch(auditLog([{ event_type: "FRONTEND_LOGIN_FAILURE", output: "FRONTEND_LOGIN_FAILURE", misc_info: "FRONTEND Login Using OTP Failed" }]))
        console.error("OTP Verification Failed", error);
        toast.error("Failed to sign in with OTP", {
          toastId: 'error3',
        });
      });
  }

  return (
    <div className='main_sec'>

      <MainLogin sx={{ backgroundImage: `url(${LoginImage.src})`, backgroundPosition: 'bottom center', backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}>
        <MainLoginleft
        //  sx={{ backgroundImage: `url(${Leftbg.src})`, backgroundPosition: "", backgroundSize: "70%" }}
        >
          {
            otpSent ?
              <IconButton
                onClick={() => handleReverse()}
                sx={{
                  position: "absolute",
                  top: "1%",
                  borderRadius: "50%",
                  border: "1.5px solid #757575",
                  padding: "2px",
                }} >
                <ArrowBackIcon
                  fontSize='medium'
                />
              </IconButton>
              : null
          }
          <img src={Logino.src} />
          <HeadingLeft> We Make HCC Coding Education Easy.</HeadingLeft>
          <ParaLeft>DoctusTech App is the best way for clinicians to learn HCC<br /> Coding. 8 out of 10 doctors prefer DoctusTech to any other<br /> method of HCC Training.</ParaLeft>
          {/* <img src={doted.src} /> */}
        </MainLoginleft>

        {
          otpSent ?
            <MainLoginright
              sx={{
                // backgroundImage: `url(${rightbg.src})`,
                textAlign: 'center'
              }}>
              <LoginForm2>
                <LoginTitle>Verify Code</LoginTitle>
                <LoginContent >
                  <Logincode>The code has been sent to the email address you provided.</Logincode>
                  <LoginId>{maskedEmail}</LoginId>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <OTP separator={<span></span>} value={otp} onChange={setOtp} length={6} />

                  </Box>
                </LoginContent>
                <LoginActions>

                  <Button onClick={handleOtpVerification} variant="contained">SIGN IN</Button>
                </LoginActions>

                <VcCode>Didn't receive the verification code?</VcCode>


                {
                  counter === 4 ?
                    <VerificationMaximum>You have exceeded the maximum number of OTP resend attempts. Please try again after some time</VerificationMaximum>
                    :
                    <ResendCode onClick={handleEmail}>Resent verification code</ResendCode>
                }

              </LoginForm2>
            </MainLoginright>
            :
            <MainLoginright
            // sx={{ backgroundImage: `url(${rightbg.src})` }}
            >
              <LoginForm>
                <LoginTitle>Welcome to DT Huddleboard</LoginTitle>
                <LoginContent >
                  <LoginLabel>Please sign-in to your account</LoginLabel>
                  <TextField
                    sx={{
                      'fieldset ,MuiInputBase-formControl:hover fieldset ': (isInvalidEmail || isInvalidEmailFirst) ? {
                        borderColor: 'red !important'
                      } : null,
                      'label': (isInvalidEmail || isInvalidEmailFirst) ? {
                        borderColor: 'red',
                        color: 'red'
                      } : null,
                      '.Mui-focused fieldset': (isInvalidEmail || isInvalidEmailFirst) ? {
                        borderColor: 'red !important'
                      } : null,
                      'label.Mui-focused': (isInvalidEmail || isInvalidEmailFirst) ? {
                        color: 'red'
                      } : null
                    }}

                    onChange={(event) => setEmail(event.target.value)} id="outlined-basic" label="Email Address" variant="outlined" />
                     {errorMessage && (
                <LoginWarning>
                  {errorMessage}
                </LoginWarning>
              )}
                </LoginContent>
                <LoginActions>

                  <Button variant="contained" onClick={handleEmail} >NEXT</Button>
                </LoginActions>

                <LoginPolicy>I agree that I have read and accepted the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy.</a></LoginPolicy>

                {isInvalidEmail ? <LoginWarning>
                  You are currently experiencing difficulty logging in via email. Please try logging in through the EHR flow instead.
                </LoginWarning> : null}
              </LoginForm>
            </MainLoginright>
        }

      </MainLogin>
    </div>
  );
};

export default Login;
