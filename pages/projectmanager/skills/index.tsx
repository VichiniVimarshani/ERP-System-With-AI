import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useFormik } from 'formik';
import useDarkMode from '../../../hooks/useDarkMode';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import { demoPagesMenu } from '../../../menu';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';

import moment from 'moment';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import COLORS from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import data from '../../../common/data/dummyCustomerData';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Popovers from '../../../components/bootstrap/Popovers';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import { string } from 'prop-types';
import axios from 'axios';
import { tr } from 'date-fns/locale';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import router from 'next/router';

interface Employee {
	_id: string;
	balance: number;
	id: string;
	cid: string;
	name: string;
	email: string;
	type: string;
	salary: number;
	NIC: string;
	designation: string;
	membershipDate: moment.Moment;
	lskills: any;
	sSkills: any;
}

interface skills {
	date: any;
	skill: string;
	ratting: any;
}

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	//store search feild data
	const [searchTerm, setSearchTerm] = useState('');
	const [id, setId] = useState<any>();
	const [isSave, setIsSave] = useState<boolean>(true);
	const [status, setStatus] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const [employeeData, setEmployeeData] = useState<Employee[]>([]);
	const [selectedRowIndex, setSelectedRowIndex] = useState(null);
	const [skills, setSkills] = useState<any>([]);
	const [lkills, setLkills] = useState<any>([]);
	const { items, requestSort, getClassNamesFor } = useSortableData(employeeData);
	// Replace this with your OpenAI API key

	const genAI = new GoogleGenerativeAI('AIzaSyBOuKQeL_tedOz3cl6_kqglHLeAw-mvw0I');

	//get user role
	useEffect(() => {
		const fetchData = async () => {
			// Load data from localStorage when the component mounts
			const role = localStorage.getItem('role');
			if (role != 'Project Manager') {
				router.push('/');
			}
		};
		fetchData(); // Call the async function
	}, []);

	// getemployee data
	useEffect(() => {
		const fetchData = async () => {
			try {
				axios
					.get('http://localhost:8090/user/employee/')
					.then((res: any) => {
						setEmployeeData(res.data);
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

	useEffect(() => {
		if (employeeData) {
			const skillsArray = employeeData.map((employee) => employee);
			setSkills(skillsArray);
			setLkills(skillsArray);
		}
	}, [employeeData]);

	useEffect(() => {
		setId(employeeData.length + 1);
	}, [employeeData]);

	// save skills
	const handleClickSave = async (index: any) => {
		//show processing
		const processingPopup = Swal.fire({
			title: 'Processing...',
			html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
			allowOutsideClick: false,
			showCancelButton: false,
			showConfirmButton: false,
		});
		//set dataset
		const skill = skills[index].sSkills;
		console.log(skills[index].sSkills);
		const data = {
			sSkills: skills[index].sSkills,
			improveS: '',
		};
		//send messege to geminiAI
		const prompt = `According to a procedure of giving points from one to ten to develop the soft skills of employees working in a software production company, ${skill[0].ratting} points are given for Communication Skills,  ${skill[1].ratting} points are given for Response on time,  ${skill[2].ratting} points are given for Teamwork and  ${skill[3].ratting} points are given for Availability, the actions to be followed to develop those skills And provide necessary youtube video link,text,documents etc. to develop skills. give answer in html format output `;
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		console.log(text);
		data.improveS = text;

		axios
			.put(`http://localhost:8090/user/${skills[index]._id}`, data)
			.then((res: any) => {
				Swal.fire('Updated!', 'Employee has been update.', 'success');
			})
			.catch((err) => {
				console.error('Error fetching data: ', err);
			});
	};

	// save learning skills
	const handleClickSave1 = async (index: any) => {
		//show processing
		const processingPopup = Swal.fire({
			title: 'Processing...',
			html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
			allowOutsideClick: false,
			showCancelButton: false,
			showConfirmButton: false,
		});

		const data = {
			lskills: lkills[index].lskills,
			improveT: '',
		};

		const tskills = lkills[index].lskills;
		const values = {
			bug_fixing: tskills[3].ratting,
			on_time_delivery: tskills[2].ratting,
			clean_code: tskills[1].ratting,
			technologies: tskills[0].ratting,
		};
		axios
			.post(`https://asia-south1-researcherp.cloudfunctions.net/learning-skills`, values)
			.then((res: any) => {
				data.improveT = res.data;
				axios
					.put(`http://localhost:8090/user/tskills/${lkills[index]._id}`, data)
					.then((res: any) => {
						Swal.fire('Updated!', 'Employee has been update.', 'success');
					})
					.catch((err) => {
						console.error('Error fetching data: ', err);
					});
			})
			.catch((err) => {
				console.error('Error fetching data: ', err);
			});
	};
	const onhandlechange = (index: any) => {
		setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	// skills  drop doen show
	const handleButtonClick = (rating: any, rowindex: any, index: any) => {
		setIsSave(false);
		const updatedRows = [...employeeData];
		updatedRows[rowindex].lskills[index].ratting = rating;
		setLkills(updatedRows);
	};

	const renderButtons = (rating: any, rowindex: any, index: any) => {
		const buttons: any = [];
		if (index == 0) {
			buttons.push(
				<Input
					type='text'
					value={rating}
					onChange={(e: any) => handleButtonClick(e.target.value, rowindex, index)}
				/>,
			);
			return buttons;
		} else {
			for (let i = 1; i <= 10; i++) {
				const buttonColor = i <= rating ? '#46BCAA' : 'gray';
				buttons.push(
					<Popovers trigger='hover' desc={i + '0%'}>
						<Button
							className='m-1'
							key={i}
							style={{ backgroundColor: buttonColor, height: 20, width: 20 }}
							onClick={() => handleButtonClick(i, rowindex, index)}></Button>
					</Popovers>,
				);
			}
			return buttons;
		}
	};

	//soft skills
	// skills show
	const handleButtonClick1 = (rating: any, rowindex: any, index: any) => {
		setIsSave(false);
		const updatedRows = [...employeeData];
		updatedRows[rowindex].sSkills[index].ratting = rating;
		setSkills(updatedRows);
	};

	const renderButtons1 = (rating: any, rowindex: any, index: any) => {
		const buttons = [];
		for (let i = 1; i <= 10; i++) {
			const buttonColor = i <= rating ? '#46BCAA' : 'gray';
			buttons.push(
				<Popovers trigger='hover' desc={i + '0%'}>
					<Button
						className='m-1'
						key={i}
						style={{ backgroundColor: buttonColor, height: 20, width: 20 }}
						onClick={() => handleButtonClick1(i, rowindex, index)}></Button>
				</Popovers>,
			);
		}
		return buttons;
	};

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					{/* Search input */}
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search employee...'
						// onChange={formik.handleChange}
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th>Employee Name</th>
											<th>Email</th>
											<th>Started Date</th>
											<th>Special expertise</th>
											<th>improvement</th>
										</tr>
									</thead>
									<tbody>
										{dataPagination(
											employeeData.filter((val) => {
												if (searchTerm === '') {
													return val;
												} else if (
													val.name
														.toLowerCase()
														.includes(searchTerm.toLowerCase())
												) {
													return val;
												}
											}),
											currentPage,
											perPage,
										).map((employee, index) => (
											<>
												<tr
													key={employee.id}
													onClick={() => onhandlechange(index)}>
													<td>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<div
																	className='ratio ratio-1x1 me-3'
																	style={{ width: 48 }}>
																	<div
																		className={`bg-l${
																			darkModeStatus
																				? 'o25'
																				: '25'
																		}-${getColorNameWithIndex(
																			Number(employee.NIC),
																		)} text-${getColorNameWithIndex(
																			index,
																		)} rounded-2 d-flex align-items-center justify-content-center`}>
																		<span className='fw-bold'>
																			{getFirstLetter(
																				employee.name,
																			)}
																		</span>
																	</div>
																</div>
															</div>
															<div className='flex-grow-1'>
																<div className='fs-6 fw-bold'>
																	{employee.name}
																</div>
																<div className='text-muted'>
																	<Icon icon='Label' />{' '}
																	<small>{employee.type}</small>
																</div>
																<div className='text-muted'>
																	<Icon icon='Label' />{' '}
																	<small>
																		{employee.designation}
																	</small>
																</div>
															</div>
														</div>
													</td>
													<td>
														<Button
															isLink
															color='light'
															icon='Email'
															className='text-lowercase'
															tag='a'
															href={`mailto:${employee.email}`}>
															{employee.email}
														</Button>
													</td>
													<td>
														<div>
															{moment(employee.membershipDate).format(
																'll',
															)}
														</div>
														<div>
															<small className='text-muted'>
																{moment(
																	employee.membershipDate,
																).fromNow()}
															</small>
														</div>
													</td>
													<td></td>
													<td></td>
												</tr>
												<tr hidden={selectedRowIndex !== index}>
													<td colSpan={5}>
														<div className='row'>
															<div className='col-6'>
																<div className='row g-4'>
																	<p className='fs-4'>
																		{' '}
																		tech Skills
																	</p>
																	{employee.lskills.map(
																		(
																			skills: skills,
																			index1: any,
																		) => (
																			<>
																				<div className='col-3'>
																					{skills.skill}
																				</div>
																				<div className='col-9'>
																					{renderButtons(
																						skills.ratting,
																						index,
																						index1,
																					)}
																				</div>
																			</>
																		),
																	)}
																</div>
																<Button
																	color='info'
																	className='mt-3'
																	onClick={() => {
																		handleClickSave1(index);
																	}}
																	icon='Save'>
																	Save
																</Button>
															</div>
															<div className='col-6'>
																<div className='row g-4'>
																	<p className='fs-4'>
																		{' '}
																		Soft Skills
																	</p>

																	{employee.sSkills.map(
																		(
																			skills: skills,
																			index1: any,
																		) => (
																			<>
																				<div className='col-3'>
																					{skills.skill}
																				</div>
																				<div className='col-9'>
																					{renderButtons1(
																						skills.ratting,
																						index,
																						index1,
																					)}
																				</div>
																			</>
																		),
																	)}
																</div>
																<Button
																	color='info'
																	className='mt-3'
																	onClick={() => {
																		handleClickSave(index);
																	}}
																	icon='Save'>
																	Save
																</Button>
															</div>
														</div>
													</td>
												</tr>
											</>
										))}
									</tbody>
								</table>
							</CardBody>
							{/* PaginationButtons component can be added here if needed */}
							<PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;
