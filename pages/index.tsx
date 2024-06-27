import React, { FC, useCallback, useContext, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AuthContext from '../context/authContext';
import useDarkMode from '../hooks/useDarkMode';
import USERS, { getUserDataWithUsername } from '../common/data/userDummyData';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Page from '../layout/Page/Page';
import Card, { CardBody } from '../components/bootstrap/Card';
import Logo from '../components/Logo';
import Button from '../components/bootstrap/Button';
import Alert from '../components/bootstrap/Alert';
import FormGroup from '../components/bootstrap/forms/FormGroup';
import Input from '../components/bootstrap/forms/Input';
import Spinner from '../components/bootstrap/Spinner';
import Select from '../components/bootstrap/forms/Select';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter();
	const { setUser } = useContext(AuthContext);
	const { darkModeStatus } = useDarkMode();
	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const handleOnClick = useCallback(() => router.push('/'), [router]);

	//login
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: '',
			password: '',
		},
		validate: (values) => {
			const errors: { email?: string; password?: string } = {};

			if (!values.email) {
				errors.email = 'Required';
			}

			if (!values.password) {
				errors.password = 'Required';
			}

			return errors;
		},
		validateOnChange: false,

		onSubmit: (values) => {

			try {
				axios
					.post("http://localhost:8090/user/login", values)
					.then((res: any) => {
						console.log(res.data)
						localStorage.setItem('token', res.data.token.token);
						localStorage.setItem('role', res.data.user);
						switch (res.data.user) {
							case 'Project Manager':
								router.push('/projectmanager/dashboard');
								break;
							case 'HR Manager':
								router.push('/hrm/dashboard');
								break;
							case 'Developer':
								router.push('/developer/dashboard');
								break;
							case 'Admin':
								console.log("hi")
								router.push('/admin/dashboard');
								break;
						}

					})
					.catch((err) => {
						Swal.fire(' Error', 'Email or Password is wrong', 'error');
						
					});
			} catch (error) {
				console.error('Error sending data:', error);
			}
		},
	});

	//register
	const formiksignup = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: ''
		},
		validate: (values) => {
			const errors: { name?: string; password?: string; confirmPassword?: string; email?: string; role?: string } = {};

			if (!values.name) {
				errors.name = 'Required';
			}

			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.password) {
				errors.password = 'Required';
			}
			if (!values.confirmPassword) {
				errors.confirmPassword = 'Required';
			} else if (values.confirmPassword != values.password) {
				errors.confirmPassword = 'password not match';
			}
			if (!values.role) {
				errors.role = 'Required';
			}

			return errors;
		},
		validateOnChange: false,

		onSubmit: (values) => {

			try {
				axios
					.post("http://localhost:8090/user/singup", values)
					.then((res) => {
						Swal.fire(' Created!', 'Account created successfully', 'success');
						localStorage.setItem('token', res.data.token.token);
						switch (res.data.user) {
							case 'Project Manager':
								router.push('/projectmanager/dashboard');
								break;
							case 'HR Manager':
								router.push('/hrm/dashboard');
								break;
							case 'Developer':
								router.push('/developer/dashboard');
								break;
							case 'Admin':
								router.push('/admin/dashboard');
								break;
						}

					})
					.catch((err) => {
						Swal.fire(' Error', 'Email is already in use.', 'error');
					});
			} catch (error) {
				Swal.fire('Network Error', 'Please try again later', 'error');
			}
		},
	});

return (
		<PageWrapper
			isProtected={false}
		// className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}
		>
			<Head>
				<title>{singUpStatus ? 'Sign Up' : 'Login'}</title>
			</Head>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										href='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										{/* <Logo width={200} /> */}
									</Link>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										{/* <div className='col'> */}
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												// onClick={() => {
												// 	setSignInPassword(false);
												// 	setSingUpStatus(!singUpStatus);
												// }}
												>
												Login
											</Button>
										{/* </div> */}
										{/* <div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Sign Up
											</Button>
										</div> */}
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />


								<form className='row g-4'>
									{singUpStatus ? (
										<>
											<div className='col-12'>
												<FormGroup id='name' label='Name' className='col-md-12'>
													<Input
														autoComplete='username'
														value={formiksignup.values.name}
														onChange={formiksignup.handleChange}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup id='email' label='Email' className='col-md-12'>
													<Input
														autoComplete='username'
														value={formiksignup.values.email}
														onChange={formiksignup.handleChange}
													/>
												</FormGroup>
											</div>

											<div className='col-12'>
												<FormGroup
													id='role'
													label='State'
													className='col-md-12'>
													<Select
														ariaLabel='State'
														placeholder='Choose...'
														list={[
															{ value: 'Project Manager', text: 'Project Manager' },
															{ value: 'HR Manager', text: 'HR Manager' },
															{ value: 'Developer', text: 'Developer' },

														]}
														onChange={formiksignup.handleChange}
														onBlur={formiksignup.handleBlur}
														value={formiksignup.values.role}
														isValid={formiksignup.isValid}
														isTouched={formiksignup.touched.role}
														invalidFeedback={formiksignup.errors.role}
													/>
												</FormGroup>
											</div>

											<div className='col-12'>
												<FormGroup id='password' label='Password' className='col-md-12'>
													<Input
														type='password'
														autoComplete='username'
														value={formiksignup.values.password}
														onChange={formiksignup.handleChange}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup id='confirmPassword' label='confirm Password' className='col-md-12'>
													<Input
														type="password"
														value={formiksignup.values.confirmPassword}
														onChange={formiksignup.handleChange}

														onBlur={formiksignup.handleBlur}
														isValid={formiksignup.isValid}
														isTouched={formiksignup.touched.confirmPassword}
														invalidFeedback={formiksignup.errors.confirmPassword}
														validFeedback='Looks good!'
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={formiksignup.handleSubmit}>
													Sign Up
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup id='email' label='Your email or username' className='col-md-12'>
													<Input
														autoComplete='username'
														value={formik.values.email}
														onChange={formik.handleChange}
													/>
												</FormGroup>
												<FormGroup id='password' label='Password' className='col-md-12'>
													<Input
														type='password'
														value={formik.values.password}
														onChange={formik.handleChange}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>

												<Button
													color='warning'
													className='w-100 py-3'
													onClick={formik.handleSubmit}>
													Login
												</Button>

											</div>
										</>
									)}

								</form>
							</CardBody>
						</Card>

					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Login;
