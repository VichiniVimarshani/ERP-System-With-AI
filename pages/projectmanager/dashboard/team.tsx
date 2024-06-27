import { NextPage } from 'next/types'
import React, { useEffect, useState } from 'react'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Head from 'next/head';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import axios from 'axios';
import useDarkMode from '../../../hooks/useDarkMode';
import { Item } from '../../../layout/Navigation/Navigation';
import moment from 'moment';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import PaginationButtons, { PER_COUNT, dataPagination } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
interface Team {
    _id: string;
    id: string,
    TeamName: string;
    email: string;
    leader: string;
    employees: any
}
interface Employee {
    _id: string;
    balance: number;
    id: string;
    cid: string;
    name: string;
    email: string;
    type: string;
    salary: number
    NIC: string;
    designation: string;
    membershipDate: moment.Moment;
    imageurl: string
}

const Index: NextPage = () => {
    const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
    const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
    const { darkModeStatus } = useDarkMode();
    const [teams, setTeams] = useState<Team[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);
    const { items, requestSort, getClassNamesFor } = useSortableData(teams);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/team")
                    .then((res: any) => {
                        setTeams(res.data)
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.error('Error fetching data: ', err);
                    });

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [editModalStatus, addModalStatus]);

    const onhandlechange = (index: any) => {
        setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        <PageWrapper>
            {/* Table for displaying customer data */}
            <Card >
                <CardHeader borderSize={1}>
                    <CardLabel icon='SupervisorAccount' iconColor='warning'>
                        <CardTitle>Teams</CardTitle>
                    </CardLabel>

                </CardHeader>
                <CardBody isScrollable={false} className='table-responsive'>
                    <div>
                        <table className='table table-modern table-hover mt-5' >
                            <thead>
                                <tr>
                                    <th>Team Name</th>
                                    <th>Leader</th>
                                    <th>Member count</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataPagination(items, currentPage, perPage)
                                        .map((team, index) => (
                                            <>
                                                <tr key={team.id} >
                                                    <td onClick={() => onhandlechange(index)}>
                                                        <div className='d-flex align-items-center'>
                                                            <div className='flex-shrink-0'>
                                                                <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>

                                                                    <div
                                                                        className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                                                            Number(index),
                                                                        )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                                                        <span className='fw-bold'>{getFirstLetter(team.TeamName)}</span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className='flex-grow-1'>
                                                                <div className='fs-6 fw-bold'>{team.TeamName}</div>
                                                                <div className='text-muted'>
                                                                    <Icon icon='Label' /> <small>{team.id}</small>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td onClick={() => onhandlechange(index)}>
                                                        <div>{team.leader}</div>
                                                        <div>
                                                            <small className='text-muted'>{team.email}</small>
                                                        </div>
                                                    </td>
                                                    <td onClick={() => onhandlechange(index)}>{team.employees.length} developers</td>
                                                    <th>

                                                    </th>
                                                </tr>
                                                <tr hidden={selectedRowIndex !== index}>
                                                    <td colSpan={4}>

                                                        <div className='row g-4 '>
                                                            <table border={1} className='table table-modern table-hover mt-5' >
                                                                <thead>
                                                                    <tr>
                                                                        <th>Developer Name</th>
                                                                        <th>Started Date</th>
                                                                        <th>Email</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {team.employees.map((employee: Employee, index: any) => (
                                                                        <>


                                                                            <tr key={employee.id} >
                                                                                <td onClick={() => onhandlechange(index)}>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <div className='flex-shrink-0'>
                                                                                            <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
                                                                                                {employee.imageurl ? (
                                                                                                    <img src={employee.imageurl} alt={employee.name} style={{ width: '50px', height: '50px', borderRadius: '5%' }} />
                                                                                                ) : (
                                                                                                    <div
                                                                                                        className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                                                                                            Number(employee.NIC),
                                                                                                        )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                                                                                        <span className='fw-bold'>{getFirstLetter(employee.name)}</span>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='flex-grow-1'>
                                                                                            <div className='fs-6 fw-bold'>{employee.name}</div>
                                                                                            <div className='text-muted'>
                                                                                                <Icon icon='Label' /> <small>{employee.type}</small>
                                                                                            </div>
                                                                                            <div className='text-muted'>
                                                                                                <Icon icon='Label' /> <small>{employee.designation}</small>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>

                                                                                <td onClick={() => onhandlechange(index)}>
                                                                                    <div>{moment(employee.membershipDate).format('ll')}</div>
                                                                                    <div>
                                                                                        <small className='text-muted'>{moment(employee.membershipDate).fromNow()}</small>
                                                                                    </div>
                                                                                </td>
                                                                                <td onClick={() => onhandlechange(index)}>{employee.email}</td>

                                                                            </tr>


                                                                        </>

                                                                    )

                                                                    )}
                                                                </tbody>

                                                            </table>
                                                        </div>

                                                    </td>
                                                </tr>
                                            </>

                                        ))
                                }

                            </tbody>
                        </table>


                    </div>
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



    )
}

export default Index