import React, { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useFormik } from 'formik';
import useDarkMode from '../../../hooks/useDarkMode';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';

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

import useSortableData from '../../../hooks/useSortableData';
import axios from 'axios';
interface Employee {
    balance: number;
    id: string;
    cid: string;
    name: string;
    email: string;
    type: string;
    salary: number
    NIC: string;
    designation: string;
    points: string;
    taskname: string;
    status: string;

}
interface ICommonUpcomingEventsProps {
    isFluid?: boolean;
}
const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {

    const { darkModeStatus } = useDarkMode();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);


    //fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/user/developer/")
                    .then((res: any) => {
                        setEmployeeData(res.data)
                    })
                    .catch((err: any) => {
                        console.error('Error fetching data: ', err);
                    });

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const dataCollection = collection(firestore, 'employees');
    //             const querySnapshot = await getDocs(dataCollection);
    //             const firebaseData = querySnapshot.docs.map((doc) => {
    //                 const data = doc.data() as Employee;
    //                 return {

    //                     ...data,

    //                     cid: doc.id,
    //                 };
    //             });
    //             setEmployeeData(firebaseData);
    //         } catch (error) {
    //             console.error('Error fetching data: ', error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    const { items, requestSort, getClassNamesFor } = useSortableData(employeeData);

    return (
        <PageWrapper>
            {/* Table for displaying customer data */}
            <Card stretch={isFluid}>
                <CardHeader borderSize={1}>
                    <CardLabel icon='Person' iconColor='success'>
                        <CardTitle>Employee</CardTitle>
                    </CardLabel>

                </CardHeader>
                <CardBody isScrollable={isFluid} className='table-responsive'>
                    <table className='table table-modern table-hover'>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Points</th>
                                <th>Task Name</th>
                                <th>Statues</th>
                                <td />
                            </tr>
                        </thead>
                        <tbody>
                            {dataPagination(items, currentPage, perPage).map((employee,index) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <div className='flex-shrink-0'>
                                                <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
                                                    <div
                                                        className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                                            Number(employee.NIC),
                                                        )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                                        <span className='fw-bold'>{getFirstLetter(employee.name)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-grow-1'>
                                                <div className='fs-6 fw-bold'>{employee.name}</div>
                                                <div className='text-muted'>
                                                    <Icon icon='Label' /> <small>{employee.type}</small>
                                                </div>
                                                <div className='text-muted'>
                                                    <Icon icon='Label' /> <small>{employee.role}</small>
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
                                        <div>{moment(employee.membershipDate).format('ll')}</div>
                                        <div>
                                            <small className='text-muted'>{moment(employee.membershipDate).fromNow()}</small>
                                        </div>
                                    </td>
                                    <td>{employee.salary}</td>
                                    <td>
                                        <Button
                                            icon='Visibility'
                                            tag='a'
                                            href={`/hrm/viewemployee/${employee._id}`}
                                        >
                                            View
                                        </Button>

                                    </td>
                                </tr>
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

        </PageWrapper>
    );
};
export default CommonUpcomingEvents;
