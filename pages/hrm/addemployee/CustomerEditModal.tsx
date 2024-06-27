import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { isString, useFormik } from 'formik';
import dayjs from 'dayjs';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import data from '../../../common/data/dummyCustomerData';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { firestore, auth, storage } from '../../../firebaseConfig';
//import { Storage } from '../../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
import { Value } from 'sass';
import { it } from 'node:test';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from '../../../components/bootstrap/forms/Select';
import postservice from '../../../services/postservice'


// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

	// Retrieve customer data based on the provided 'id'
	interface Employee {
		document: string;
		documentname: string;
		imageurl: string;
		streetAddress2: string;
		name: string;
		email: string;
		type: string;
		designation: string;
		balance: number;
		streetAddress: string;
		city: string;
		salary: number
		stateFull: string;
		zip: string;
		NIC: string;
		birthday: moment.Moment;
		accountNumber: string;
		bankName: string;
		membershipDate: moment.Moment;
		cid: string
	}

	interface skills {
		date: any;
		skill: string;
		ratting: any;
	  }
	//image upload values

	const [imageurl, setImageurl] = useState<any>(null);
	const [documentupload, setDocumentupload] = useState<any>(null);
	const [documentuploadname, setDocumentuploadname] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const lskills: skills[] = [

		{ date: new Date(), skill: "Technologies", ratting: "" },
		{ date: new Date(), skill: "Clean Code", ratting: 0 },
		{ date: new Date(), skill: "Bugs Fixing", ratting: 0 },
		{ date: new Date(), skill: "On-time delivery", ratting: 0 },
	  
	  ]
	  const Sskills: skills[] = [
		{ date: new Date(), skill: "Communication Skills", ratting: 0 },
		{ date: new Date(), skill: "Response on time", ratting: 0 },
		{ date: new Date(), skill: "Teamwork", ratting: 0 },
		{ date: new Date(), skill: "Availability", ratting: 0 },
	
	  
	  ]

	const handleUploadimage = async () => {

		if (imageurl) {
			// Assuming generatePDF returns a Promise
			const pdfFile = imageurl;
			console.log(imageurl)
			const storageRef = ref(storage, `employees/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								console.log('File uploaded successfully. URL:', url);

								console.log(url);
								resolve(url); // Resolve the Promise with the URL
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					}
				);
			});
		} else {
			return ""
		}
	}

	const handleUploadDocument = async () => {

		if (documentupload) {
			// Assuming generatePDF returns a Promise
			const pdfFile = documentupload;
			setDocumentuploadname(pdfFile.name)
			const storageRef = ref(storage, `employees/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								console.log('File uploaded successfully. URL:', url);

								console.log(url);
								resolve(url); // Resolve the Promise with the URL
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					}
				);
			});
		} else {
			return ""
		}
	}



	// Initialize formik for form management
	const formik = useFormik({

		initialValues: {

			name: '',
			email: '',
			membershipDate: "",
			type: '',
			streetAddress: '',
			streetAddress2: '',
			city: '',
			stateFull: '',
			zip: '',
			birthday: '',
			NIC: '',
			accountNumber: '',
			bankName: '',
			// designation: '',
			salary: "",
			imageurl: null,
			document: '',
			documentname: "",
			role:"Developer",
			lskills:lskills,
			sSkills:Sskills,
			password:""
		}
		,
		validate: (values) => {
			const errors: {
				name?: string;
				email?: string;
				membershipDate?: string;
				type?: string;
				streetAddress?: string;
				streetAddress2?: string;
				city?: string;
				stateFull?: string;
				zip?: string;
				birthday?: string;
				NIC?: string;
				accountNumber?: string;
				bankName?: string;
				designation?: string;
				salary?: string;
				imageurl?: string;
				document?: string;
				documentname?: string;
				
			} = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.membershipDate) {
				errors.membershipDate = 'Required';
			}
			// if (!values.designation) {
			// 	errors.designation = 'Required';
			// }
			if (!values.type) {
				errors.type = 'Required';
			}
			if (!values.salary) {
				errors.salary = 'Required';
			}
			if (!values.streetAddress) {
				errors.streetAddress = 'Required';
			}
			if (!values.city) {
				errors.city = 'Required';
			}
			if (!values.birthday) {
				errors.birthday = 'Required';
			}
			if (!values.NIC) {
				errors.NIC = 'Required';
			}
			if (!values.accountNumber) {
				errors.accountNumber = 'Required';
			}
			if (!values.bankName) {
				errors.bankName = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			} else if (
				!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
			) {
				errors.email = 'Invalid email address';
			}


			return errors;
		},
		onSubmit: async (values) => {

			try {
				const processingPopup = Swal.fire({
					title: "Processing...",
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				console.log(values)
				const imgurl: any = await handleUploadimage()
				const docurl: any = await handleUploadDocument()
				values.imageurl = await imgurl || "";
				values.document = await docurl || ""
				values.documentname = await documentuploadname
				values.password=values.NIC
				
				axios
					.post("http://localhost:8090/user/addemployee", values)
					.then((res) => {
						Swal.fire(' Created!', 'Employee added successfully', 'success');
						setIsOpen(false);
					})
					.catch((err) => {
						Swal.fire(' Error', 'Email is already in use.', 'error');
					});
			} catch (error) {
				Swal.fire('Network Error', 'Please try again later', 'error');
			}


			// try {
			// 	const processingPopup = Swal.fire({
			// 		title: "Processing...",
			// 		html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
			// 		allowOutsideClick: false,
			// 		showCancelButton: false,
			// 		showConfirmButton: false,
			// 	});
			// 	const imgurl: any = await handleUploadimage()
			// 	const docurl: any = await handleUploadDocument()
			// 	values.imageurl = imgurl || "";
			// 	values.document = docurl || ""
			// 	values.documentname = documentuploadname
			// 	const collectionRef = collection(firestore, 'employees');

			// 	addDoc(collectionRef, values).then(() => {

			// 		
			// 		showNotification(
			// 			<span className='d-flex align-items-center'>
			// 				<Icon icon='Info' size='lg' className='me-1' />
			// 				<span>Successfully Added</span>
			// 			</span>,
			// 			'Employee has been added successfully',
			// 		);
			// 		Swal.fire('Added!', 'Employee has been add successfully.', 'success');
			// 	}).catch((error) => {
			// 		console.error('Error adding document: ', error);
			// 		alert('An error occurred while adding the document. Please try again later.');
			// 	});


			// } catch (error) {
			// 	console.error('Error during handleUpload: ', error);
			// 	alert('An error occurred during file upload. Please try again later.');
			// }

		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'New Customer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				{selectedImage && <img src={selectedImage} className="mx-auto d-block mb-4" alt="Selected Profile Picture" style={{ width: '150px', height: '150px', borderRadius: 70 }} />}

				{/* Form fields for customer information */}
				<div className='row g-4'>

					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}

							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'

						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							required
							type='email'
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'

						/>
					</FormGroup>
					<FormGroup id='membershipDate' label='Started Date' onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='date'
							onChange={formik.handleChange}
							value={formik.values.membershipDate || dayjs(formik.values.membershipDate).format('YYYY-MM-DD')}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.membershipDate}
							invalidFeedback={formik.errors.membershipDate}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='salary' label='Salary' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.salary}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.salary}
							invalidFeedback={formik.errors.salary}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					{/* <FormGroup id='designation' label='Designation' onChange={formik.handleChange} className='col-md-6'>
						
						<Input
							onChange={formik.handleChange}
							value={formik.values.designation}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.designation}
							invalidFeedback={formik.errors.designation}
							validFeedback='Looks good!'

						/> 
						<Select
							ariaLabel='State'
							placeholder='Choose...'
							list={[
								{ value: 'software engineer', text: 'Software engineer' },
								{ value: 'senior software engineer', text: 'Senior Software engineer' },
								{ value: 'Developer', text: 'Developer' },
								{ value: 'project manager', text: 'Project manager' },
								{ value: 'quality assurance', text: 'Quality assurance' },


							]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.designation}
							isValid={formik.isValid}
							isTouched={formik.touched.designation}
							invalidFeedback={formik.errors.designation}
						/>

					</FormGroup>*/}

					<FormGroup id='membershipDate' className='col-md-12'>
						<Label htmlFor='ChecksGroup'>Type</Label>
						<ChecksGroup onChange={formik.handleChange} isInline
							isValid={formik.isValid}
							isTouched={formik.touched.type}
							invalidFeedback={formik.errors.type}>


							<Checks
								type='radio'
								key={"full-time"}
								id={"full-time"}
								label={"full-time"}
								name='type'
								value={"full-time"}
								onChange={formik.handleChange}
								checked={formik.values.type}

							/>
							<Checks
								type='radio'
								key={"part-time"}
								id={"part-time"}
								label={"part-time"}
								name='type'
								value={"part-time"}
								onChange={formik.handleChange}
								checked={formik.values.type}

							/>
						</ChecksGroup>
					</FormGroup>

					

					<div className='col-md-6'>
						<Card className='rounded-1 mb-0'>
							<CardHeader>
								<CardLabel icon='ReceiptLong'>
									<CardTitle>Address</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-3'>
									<FormGroup
										id='streetAddress'
										label='Address Line'
										className='col-12'

									>
										<Input
											onChange={formik.handleChange}
											value={formik.values.streetAddress}
											isValid={formik.isValid}
											isTouched={formik.touched.streetAddress}
											invalidFeedback={formik.errors.streetAddress}
											validFeedback='Looks good!'

										/>
									</FormGroup>
									<FormGroup
										id='streetAddress2'
										label='Address Line 2'
										className='col-12'
									>
										<Input

											value={formik.values.streetAddress2}
											onChange={formik.handleChange}

										/>
									</FormGroup>
									<FormGroup id='city' label='City' className='col-md-4'>
										<Input

											value={formik.values.city}

											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.city}
											invalidFeedback={formik.errors.city}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='stateFull'
										label='State'
										className='col-md-4'

									>
										<Input
											onChange={formik.handleChange}
											value={formik.values.stateFull}

										/>
									</FormGroup>
									<FormGroup id='zip' label='Zip' className='col-md-4'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.zip}

										/>
									</FormGroup>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-6'>
						<Card className='rounded-1 mb-0'>
							<CardHeader>
								<CardLabel icon='LocalShipping'>
									<CardTitle>Other Details</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-3'>
									<FormGroup id='birthday' label='Birthday' className='col-md-6'>
										<Input
											type='date'
											onChange={formik.handleChange}
											value={formik.values.birthday}
											// value={formik.values.birthday}
											isValid={formik.isValid}
											isTouched={formik.touched.birthday}
											invalidFeedback={formik.errors.birthday}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup id='NIC' label='NIC' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.NIC}
											isValid={formik.isValid}
											isTouched={formik.touched.NIC}
											invalidFeedback={formik.errors.NIC}
											validFeedback='Looks good!'

										// disabled
										/>
									</FormGroup>
									<FormGroup id='accountNumber' label='Bank Account Number' className='col-md-6'>
										<Input

											onChange={formik.handleChange}
											value={formik.values.accountNumber}
											isValid={formik.isValid}
											isTouched={formik.touched.accountNumber}
											invalidFeedback={formik.errors.accountNumber}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup id='bankName' label='Bank Name' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.bankName}
											isValid={formik.isValid}
											isTouched={formik.touched.bankName}
											invalidFeedback={formik.errors.bankName}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup label='Profile Picture' className='col-md-6'>
										<Input
											type='file'
											onChange={(e: any) => {
												setImageurl(e.target.files[0]);
												// Display the selected image
												setSelectedImage(URL.createObjectURL(e.target.files[0]));
											}}
										/>
									</FormGroup>

									<FormGroup id='documents' label='Documents' className='col-md-6'>
										<Input
											type='file'
											onChange={(e: any) => { setDocumentupload(e.target.files[0]) }}
										/>

									</FormGroup>

								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit} >
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
}
// If 'id' is not present, return null (modal won't be rendered)



// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;
