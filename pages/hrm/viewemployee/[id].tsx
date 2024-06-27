import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';

import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '../../../hooks/useDarkMode';
import data from '../../../common/data/dummyCustomerData';
import latestSalesData from '../../../common/data/dummySalesData';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import CustomerEditModal from '../editemployee/editemploy';
import Swal from 'sweetalert2';
import moment from 'moment';
import { number } from 'prop-types';
import axios from 'axios';

interface Employee {
	_id: string;
	name: string;
	email: string;
	type: string;
	src: string
	designation: string;
	balance: number;
	streetAddress: string;
	city: string;
	state: string;
	stateFull: string;
	zip: string;
	NIC: string;
	birthday: Dayjs;
	accountNumber: string;
	bankName: string;
	membershipDate: moment.Moment;
	document: string;
	imageurl: string;
	cid: string;
	documentname: string;
	salary: string;
	points: string;
	role: string
}


const Id: NextPage = () => {
	const router = useRouter();
	const { id }: any = router.query;

	const { darkModeStatus } = useDarkMode();

	// Filter the customer data based on the 'id' parameter
	const itemData = data.filter((item) => item.id.toString() === id?.toString());
	const item = itemData[0];

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);

	// Sorting functionality for sales data
	const { items, requestSort, getClassNamesFor } = useSortableData(latestSalesData);

	// State for the edit modal
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);

	//get user role
	useEffect(() => {
		const fetchData = async () => {
			// Load data from localStorage when the component mounts
			const role = localStorage.getItem('role');
			if (role != "HR Manager") {
				router.push("/")
			}
		};
		fetchData(); // Call the async function
	}, []);

	// Open the edit modal
	const handleClickEdit = () => {
		setEditModalStatus(true);
	};
	//featch data
	const [employeeData, setEmployeeData] = useState<any>();
	useEffect(() => {
		const fetchData = async () => {
			try {
				axios
					.get(`http://localhost:8090/user/${id}`)
					.then(async (res: any) => {

						await setEmployeeData(res.data)

					})
					.catch((err) => {
						console.error('Error fetching data: ', err);
					});

			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [editModalStatus]);




	return (
		<PageWrapper>
			{/* <Head>
				<title>{demoPagesMenu.hrm.subMenu.customer.text}</title>
			</Head> */}
			<SubHeader>
				<SubHeaderLeft>
					{/* Back to list button */}
					<Button
						color='primary'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`/hrm/manageemployees/`}
					>
						Back to List
					</Button>
					<SubheaderSeparator />
				</SubHeaderLeft>
				<SubHeaderRight>
					{/* Edit and Delete buttons */}
					<Button icon='Edit' color='primary' isLight onClick={handleClickEdit}>
						Edit
					</Button>
					{/* <Button icon='Delete' color='primary' isLight onClick={() => handleClickDelete(id)}>
						Delete
					</Button> */}
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>{employeeData?.name}</span>
					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{employeeData?.role}
					</span>
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						{/* Avatar and basic info card */}
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12 d-flex justify-content-center'>
										<Avatar
											src={employeeData?.imageurl || ""}
											color={getColorNameWithIndex(Number(employeeData?._id))}
											isOnline={item?.isOnline}
										/>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Mail'
															size='3x'
															color='primary'
														/>
													</div>
													{/* Email information */}
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{employeeData?.email}
														</div>
														<div className='text-muted'>
															Email Address
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* Ratings and Membership duration card */}
						<Card>
							<CardHeader>
								<CardLabel icon='StackedLineChart'>
									<CardTitle>Statics</CardTitle>
								</CardLabel>
								<CardActions>
									Only in <strong>{dayjs().format('MMM')}</strong>.
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										{/* Rating */}
										<div
											className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
												}-primary rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Star' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-5 mb-1'> {employeeData?.points}</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Rating
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										{/* Membership duration */}
										<div
											className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
												}-success rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Timer' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-5 mb-1'>{moment(employeeData?.membershipDate).fromNow()}</div>
												<div className='text-muted mt-n2'>Membership</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>
						{/* Address, Birthday, NIC, Bank Details, and Type card */}
						<Card>
							<CardHeader>
								<CardLabel icon='MapsHomeWork'>
									<CardTitle>Address and Birthday</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-md-2'>
										{/* Address */}
										<p className='lead fw-bold'>Address</p>
										<div>{employeeData?.streetAddress},</div>
										<div>{employeeData?.city}</div>
										<div></div>
										<div>{`${employeeData?.state}, ${employeeData?.stateFull}`}</div>
										<div>{employeeData?.zip}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* Birthday */}
										<p className='lead fw-bold'>Birthday</p>
										<div>{dayjs(employeeData?.birthday).format('YYYY-MM-DD')}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* NIC */}
										<p className='lead fw-bold'>NIC</p>
										<div> {employeeData?.NIC}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* Bank Details */}
										<p className='lead fw-bold'>Bank Details</p>
										<div>{employeeData?.accountNumber}</div>
										<div>{employeeData?.bankName}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* NIC */}
										<p className='lead fw-bold'>Salary</p>
										<div> {employeeData?.salary}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										<p className='lead fw-bold'>Type</p>
										<div>{employeeData?.type}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* Personal Documents card */}
						<Card>
							<CardHeader>
								<CardLabel icon='Receipt'>
									<CardTitle>Personal Documents</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								{/* Document table */}
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('name')}
												className='cursor-pointer text-decoration-underline'>
												Document Name{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('name')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('date')}
												className='cursor-pointer text-decoration-underline'>
												{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('date')}
													icon='FilterList'
												/>
											</th>
										</tr>
									</thead>
									<tbody>

										<tr>
											<td>{employeeData?.documentname}</td>
											{/* View button */}
											<td>
												<Button
													icon='Visibility'
													tag='a'
													to={employeeData?.document}>
													View
												</Button>
											</td>
										</tr>

									</tbody>
								</table>
								{/* Pagination for documents */}
							</CardBody>
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
			{/* Edit modal */}
			<CustomerEditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={id}

			/>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export async function getStaticPaths() {
	return {
		paths: [
			// String variant:
			'/hrm/viewemployee/1',
			// Object variant:
			{ params: { id: '2' } },
		],
		fallback: true,
	};
}

export default Id;
