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
//import TYPES from '../../../common/data/employeeType';
import moment from 'moment';
import { Value } from 'sass';
import { it } from 'node:test';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
	addDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { firestore, auth, storage } from '../../../firebaseConfig';
//import { Storage } from '../../../firebase';
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	uploadBytesResumable,
} from 'firebase/storage';
import { error } from 'node:console';

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
		salary: number;
		stateFull: string;
		zip: string;
		NIC: string;
		birthday: moment.Moment;
		accountNumber: string;
		bankName: string;
		membershipDate: moment.Moment;
		_id: string;
	}

	//image upload values

	const [imageurl, setImageurl] = useState<any>(null);
	const [documentupload, setDocumentupload] = useState<any>(null);
	const [documentuploadname, setDocumentuploadname] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [documenturl, setdocumenturl] = useState<string>('');
	//save button click\
	const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
	//featch data
	const [employeeData, setEmployeeData] = useState<Employee[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				axios
					.get(`http://localhost:8090/user/${id}`)
					.then((res: any) => {
						console.log('hi', id);
						setEmployeeData(res.data);
						// console.log(employeeData?.name)
					})
					.catch((err) => {
						console.error('Error fetching data: ', err);
					});
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	let item: any = employeeData;

	// const itemData = id ? employeeData.filter((item) => item._id.toString() === id.toString()) : {};
	// console.log(item.birthday)

	const handleUploadimage = async () => {
		if (imageurl) {
			// Assuming generatePDF returns a Promise
			const pdfFile = imageurl;
			console.log(imageurl);
			const storageRef = ref(storage, `employees/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
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
					},
				);
			});
		} else {
			return null;
		}
	};

	const handleUploadDocument = async () => {
		if (documentupload) {
			// Assuming generatePDF returns a Promise
			const pdfFile = documentupload;
			setDocumentuploadname(pdfFile.name);
			const storageRef = ref(storage, `employees/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
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
					},
				);
			});
		} else {
			return null;
		}
	};

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			// 	// Set initial form values based on existing customer data
			name: employeeData[0]?.email || '',
			email: employeeData[0]?.email || '',
			membershipDate: '',
			type: employeeData[0]?.type || '',
			streetAddress: employeeData[0]?.streetAddress || '',
			streetAddress2: employeeData[0]?.streetAddress2 || '',
			city: employeeData[0]?.city || '',
			stateFull: employeeData[0]?.stateFull || '',
			zip: employeeData[0]?.zip || '',
			birthday: '' || '',
			NIC: employeeData[0]?.NIC || '',
			accountNumber: employeeData[0]?.accountNumber || '',
			bankName: employeeData[0]?.bankName || '',
			designation: employeeData[0]?.designation || '',
			salary: employeeData[0]?.salary || '',
			imageurl: imageurl,
			document: documenturl,
			documentname: '',
		},
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
			// if (!item.name) {
			// 	errors.name = 'Required';
			// }
			// if (!item.membershipDate) {
			// 	errors.membershipDate = 'Required';
			// }
			// if (!item.designation) {
			// 	errors.designation = 'Required';
			// }
			// if (!item.type) {
			// 	errors.type = 'Required';
			// }
			// if (!item.salary) {
			// 	errors.salary = 'Required';
			// }
			// if (!item.streetAddress) {
			// 	errors.streetAddress = 'Required';
			// }
			// if (!item.city) {
			// 	errors.city = 'Required';
			// }
			// if (!item.birthday) {
			// 	errors.birthday = 'Required';
			// }
			// if (!item.NIC) {
			// 	errors.NIC = 'Required';
			// }
			// if (!item.accountNumber) {
			// 	errors.accountNumber = 'Required';
			// }
			// if (!item.bankName) {
			// 	errors.bankName = 'Required';
			// }
			// if (!item.email) {
			// 	errors.email = 'Required';
			// } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(item.email)) {
			// 	errors.email = 'Invalid email address';
			// }

			
			return errors;
		},

		onSubmit: async (values) => {
			// Handle form submission

			try {
				console.log(item);
				const processingPopup = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					console.log(item);
					const imgurl: any = await handleUploadimage();
					const docurl: any = await handleUploadDocument();
					if (imgurl) {
						item.imageurl = imgurl;
					}
					if (docurl) {
						item.document = docurl || employeeData[0].document;
						item.documentname = documentuploadname || employeeData[0].documentname;
					}

					axios
						.put(`http://localhost:8090/user/employee/${id}`, item)
						.then((res: any) => {
							setIsOpen(false);
							Swal.fire('Updated!', 'Employee has been update.', 'success');
						})
						.catch((err) => {
							console.error('Error fetching data: ', err);
						});
				} catch (error) {
					console.error('Error fetching data: ', error);
				}
				// 	const imgurl: any = await handleUploadimage()
				// 	const docurl: any = await handleUploadDocument()
				// 	item.imageurl = imgurl || employeeData[0].imageurl;
				// 	item.document = docurl || employeeData[0].document
				// 	item.documentname = documentuploadname || employeeData[0].documentname
				// 	const docRef = doc(firestore, "employees", id);
				// 	// Update the data

				// 	updateDoc(docRef, item).then(() => {

				// 		setIsOpen(false);
				// 		showNotification(
				// 			<span className='d-flex align-items-center'>
				// 				<Icon icon='Info' size='lg' className='me-1' />
				// 				<span>Successfully Update</span>
				// 			</span>,
				// 			'Employee has been update successfully',
				// 		);
				// 	}).catch((error) => {
				// 		console.error('Error update document: ', error);
				// 		alert('An error occurred while adding the document. Please try again later.');
				// 	});

				// 	Swal.fire('Updated!', 'Employee has been update.', 'success');

				// 	// }
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	// Render the modal content if 'id' is present

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{employeeData[0]?.name || 'New Customer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				{selectedImage && (
					<img
						src={selectedImage}
						className='mx-auto d-block mb-4'
						alt='Selected Profile Picture'
						style={{ width: '150px', height: '150px', borderRadius: 70 }}
					/>
				)}

				<div className='row g-4'>
					<FormGroup
						id='name'
						label='Name'
						onChange={(e: any) => {
							item.name = e.target.value;
						}}
						className='col-md-6'>
						<Input
							type='text'
							// onChange={(e:any)=>{item.name=e.target.value}}
							onChange={formik.handleChange}
							value={item?.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='email'
						label='Email'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							required
							type='email'
							onChange={(e: any) => {
								item.email = e.target.value;
							}}
							value={item?.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='membershipDate'
						label='Started Date'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							type='date'
							onChange={(e: any) => {
								item.membershipDate = e.target.value;
							}}
							value={
								formik.values.membershipDate ||
								dayjs(item?.membershipDate).format('YYYY-MM-DD')
							}
							// dayjs(item?.membershipDate).format('YYYY-MM-DD')|
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.membershipDate}
							invalidFeedback={formik.errors.membershipDate}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{/* <FormGroup id='designation' label='Designation' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { item.designation = e.target.value }}
							value={item?.designation}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.designation}
							invalidFeedback={formik.errors.designation}
							validFeedback='Looks good!'
						/>
					</FormGroup> */}

					<FormGroup
						id='salary'
						label='Salary'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.salary = e.target.value;
							}}
							value={item?.salary}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.salary}
							invalidFeedback={formik.errors.salary}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='membershipDate' className='col-md-12'>
						<Label htmlFor='ChecksGroup'>Type</Label>
						<ChecksGroup
							onChange={formik.handleChange}
							isInline
							isValid={formik.isValid}
							isTouched={formik.touched.type}
							invalidFeedback={formik.errors.type}>
							<Checks
								type='radio'
								key={'full-time'}
								id={'full-time'}
								label={'full-time'}
								name='type'
								value={'full-time'}
								onChange={(e: any) => {
									item.type = e.target.value;
								}}
								checked={item?.type}
							/>
							<Checks
								type='radio'
								key={'part-time'}
								id={'part-time'}
								label={'part-time'}
								name='type'
								value={'part-time'}
								onChange={(e: any) => {
									item.type = e.target.value;
								}}
								checked={item?.type}
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
										onChange={formik.handleChange}>
										<Input
											onChange={(e: any) => {
												item.streetAddress = e.target.value;
											}}
											value={item?.streetAddress}
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
										onChange={formik.handleChange}>
										<Input
											value={item?.streetAddress2 || ''}
											onChange={(e: any) => {
												item.streetAddress2 = e.target.value;
											}}
										/>
									</FormGroup>
									<FormGroup
										id='city'
										label='City'
										onChange={formik.handleChange}
										className='col-md-4'>
										<Input
											value={item?.city}
											onChange={(e: any) => {
												item.city = e.target.value;
											}}
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
										onChange={formik.handleChange}>
										<Input
											onChange={(e: any) => {
												item.stateFull = e.target.value;
											}}
											value={item?.stateFull || ''}
										/>
									</FormGroup>
									<FormGroup
										id='zip'
										label='Zip'
										onChange={formik.handleChange}
										className='col-md-4'>
										<Input
											onChange={(e: any) => {
												item.zip = e.target.value;
											}}
											value={item?.zip}
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
									<FormGroup
										id='birthday'
										label='Birthday'
										onChange={formik.handleChange}
										className='col-md-6'>
										<Input
											type='date'
											onChange={(e: any) => {
												item.birthday = e.target.value;
											}}
											value={
												formik.values.birthday ||
												dayjs(item?.birthday).format('YYYY-MM-DD')
											}
											// value={formik.values.birthday}
											isValid={formik.isValid}
											isTouched={formik.touched.birthday}
											invalidFeedback={formik.errors.birthday}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='NIC'
										label='NIC'
										onChange={formik.handleChange}
										className='col-md-6'>
										<Input
											onChange={(e: any) => {
												item.NIC = e.target.value;
											}}
											value={item?.NIC}
											isValid={formik.isValid}
											isTouched={formik.touched.NIC}
											invalidFeedback={formik.errors.NIC}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='accountNumber'
										label='Bank Account Number'
										onChange={formik.handleChange}
										className='col-md-6'>
										<Input
											onChange={(e: any) => {
												item.accountNumber = e.target.value;
											}}
											value={item?.accountNumber}
											isValid={formik.isValid}
											isTouched={formik.touched.accountNumber}
											invalidFeedback={formik.errors.accountNumber}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='bankName'
										label='Bank Name'
										onChange={formik.handleChange}
										className='col-md-6'>
										<Input
											onChange={(e: any) => {
												item.bankName = e.target.value;
											}}
											value={item?.bankName}
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
												setSelectedImage(
													URL.createObjectURL(e.target.files[0]),
												);
											}}
										/>
									</FormGroup>

									<FormGroup
										id='documents'
										label='Documents'
										className='col-md-6'>
										<Input
											type='file'
											onChange={(e: any) => {
												setDocumentupload(e.target.files[0]);
											}}
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
				<Button color='info' onClick={formik.handleSubmit} isDisable={isButtonDisabled}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// If 'id' is not present, return null (modal won't be rendered)

// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;
