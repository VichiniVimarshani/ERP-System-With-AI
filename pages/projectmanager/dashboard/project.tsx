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
import PaginationButtons, { PER_COUNT, dataPagination } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
interface Project {
    _id: string;
    projectName: string,
    id: string;
    team: string;
    teamId: string;
    task: any
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
    const [project, setProject] = useState<Project[]>([]);
    const [developers, setDevelopers] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const { items, requestSort, getClassNamesFor } = useSortableData(project);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/project/")
                    .then((res: any) => {
                        setProject(res.data)

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/user/developer/")
                    .then((res: any) => {
                        setDevelopers(res.data)
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
                    <CardLabel icon='Task' iconColor='info'>
                        <CardTitle>Project</CardTitle>
                    </CardLabel>

                </CardHeader>
                <CardBody isScrollable={false} className='table-responsive'>

                    <div>
                        <table className='table table-modern table-hover mt-5' >
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Team</th>
                                    <th>Task count</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataPagination(items, currentPage, perPage)
                                        .map((project, index) => (
                                            <>
                                                <tr key={project.id} >
                                                    <td onClick={() => onhandlechange(index)}>
                                                        <div className='d-flex align-items-center'>
                                                            <div className='flex-shrink-0'>
                                                                <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>

                                                                    <div
                                                                        className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                                                            Number(index),
                                                                        )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                                                        <span className='fw-bold'>{getFirstLetter(project.projectName)}</span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className='flex-grow-1'>
                                                                <div className='fs-6 fw-bold'>{project.projectName}</div>
                                                                <div className='text-muted'>
                                                                    <Icon icon='Label' /> <small>{project.id}</small>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td onClick={() => onhandlechange(index)}>
                                                        <div>{project.team}</div>
                                                        <div>
                                                            {/* <small className='text-muted'>{team.}</small> */}
                                                        </div>
                                                    </td>
                                                    <td onClick={() => onhandlechange(index)}>{project.task.length} tasks </td>
                                                    <th>

                                                    </th>
                                                </tr>
                                                <tr hidden={selectedRowIndex !== index}>
                                                    <td colSpan={4}>

                                                        <div className='row g-4 '>
                                                            <table border={1} className='table table-modern table-hover mt-5' >
                                                                <thead>
                                                                    <tr>
                                                                        <th>Task Name</th>
                                                                        <th>Developer</th>
                                                                        <th>Time</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {project.task.map((task: any, index: any) => (
                                                                        <>
                                                                            <tr key={task.id} >
                                                                                <td onClick={() => onhandlechange(index)}>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <div className='flex-shrink-0'>
                                                                                            <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>

                                                                                                <div
                                                                                                    className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                                                                                        Number(index),
                                                                                                    )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                                                                                    <span className='fw-bold'>{getFirstLetter(task.name)}</span>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='flex-grow-1'>
                                                                                            <div className='fs-6 fw-bold'>{task.name}</div>


                                                                                        </div>
                                                                                    </div>
                                                                                </td>

                                                                                <td onClick={() => onhandlechange(index)}>

                                                                                    {developers.filter((val: any) => {
                                                                                        if (val._id.includes(task.employee)) {
                                                                                            return val
                                                                                        }

                                                                                    })
                                                                                        .map((developer: any, index) => (
                                                                                            <>
                                                                                                <div>{developer.name}</div>
                                                                                                <div>
                                                                                                    <small className='text-muted'>{developer.email}</small>
                                                                                                </div>
                                                                                            </>
                                                                                        ))
                                                                                    }
                                                                                </td>
                                                                                <td onClick={() => onhandlechange(index)}>{task.time}</td>

                                                                                <td>
                                                                                    {task.status}
                                                                                </td>
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