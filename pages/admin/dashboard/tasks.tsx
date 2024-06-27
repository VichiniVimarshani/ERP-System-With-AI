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
import Swal from 'sweetalert2';
import useSortableData from '../../../hooks/useSortableData';
import PaginationButtons, { PER_COUNT, dataPagination } from '../../../components/PaginationButtons';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
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
interface Project {
    _id: string;
    projectName: string,
    id: string;
    team: string;
    teamId: string;
    task: any
}

const Index: NextPage = () => {

    const { darkModeStatus } = useDarkMode();
    const [project, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("ongoing");
    const [id, setId] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [ststus, setStatus] = useState<boolean>(true)
    const { items, requestSort, getClassNamesFor } = useSortableData(project);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);

    //get all project 
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/project")
                    .then((res: any) => {
                        setProjects(res.data)

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





    const onhandlechange = (index: any) => {
        setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (

        <PageWrapper>
            {/* Table for displaying customer data */}
            <Card >
                <CardHeader borderSize={1}>
                    <CardLabel icon='AddTask' iconColor='success'>
                        <CardTitle>Tasks</CardTitle>
                    </CardLabel>
                    <CardActions>
                        <Input
                            id='searchInput'
                            type='search'
                            className='border-1 shadow-none bg-transparent'
                            placeholder='Search'
                            // onChange={formik.handleChange}
                            onChange={(event: any) => { setSearchTerm(event.target.value); }}
                            value={searchTerm}
                        />
                    </CardActions>
                </CardHeader>
                <CardBody isScrollable={false} className='table-responsive'>
                    <div>
                        <table className='table table-modern table-hover mt-4' >
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Task</th>
                                    <th>Time</th>
                                    <th>Team</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataPagination(items, currentPage, perPage).map((project, index) => (
                                        <>
                                            {project.task.filter((val: any) => {
                                                if (val.status.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                    return val
                                                }

                                            })
                                                .map((task: any, index1: any) => (
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
                                                                                <span className='fw-bold'>{getFirstLetter(project.projectName)}</span>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className='flex-grow-1'>
                                                                        <div className='fs-6 fw-bold'>{project.projectName}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td onClick={() => onhandlechange(index)}>{task.name}</td>
                                                            <td>
                                                                {task.time}
                                                            </td>
                                                            <td>
                                                                {project.team}
                                                            </td>
                                                            <td>
                                                                {task.status}
                                                            </td>
                                                            <td>
                                                                {/* <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" onClick={() => { chagestatus(project, index1) }} id="flexSwitchCheckCheckedDisabled" />
                                            <label className="form-check-label">In Review</label>
                                          </div> */}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                                )}
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