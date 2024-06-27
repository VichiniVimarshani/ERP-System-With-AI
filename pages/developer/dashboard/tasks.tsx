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
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
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
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [ststus, setStatus] = useState<boolean>(true)
    const { items, requestSort, getClassNamesFor } = useSortableData(project);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);
    //get curent user 
    useEffect(() => {
        const fetchData = async () => {
            // Load data from localStorage when the component mounts
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get("http://localhost:8090/user/curentuser", {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    });
                    await setId(res.data._id)
                    console.log(id)

                } catch (error: any) {
                    console.error("Error fetching current user:", error.message);

                }
            }

        };

        fetchData(); // Call the async function
    }, [id])

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

    //change ststus
    const chagestatus = async (project: Project, index: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this status!',
            // text: id,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        })

        if (result.isConfirmed) {
            try {
                if (project.task[index].status == "pending") {
                    project.task[index].status = "Ongoing"
                } else if (project.task[index].status == "Ongoing") {
                    project.task[index].status = "In Review"
                }
                console.log(project)
                axios
                    .put(`http://localhost:8090/project/${project._id}`, project)
                    .then((res: any) => {

                        Swal.fire('Updated!', 'ststus has been update.', 'success');
                    })
                    .catch((err) => {
                        console.error('Error fetching data: ', err);
                    });

            } catch (error) {
                console.error('Error fetching data: ', error);
            }

        }

        if (ststus) {
            setStatus(false)
        }
        else {
            setStatus(true)
        }


    }


    const onhandlechange = (index: any) => {
        setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (

        <PageWrapper>
        {/* Table for displaying customer data */}
        <Card >
            <CardHeader borderSize={1}>
                <CardLabel icon='AddTask' iconColor='warning'>
                    <CardTitle>Tasks</CardTitle>
                </CardLabel>

            </CardHeader>
            <CardBody isScrollable={false} className='table-responsive'>
            <div>
                <table  className='table table-modern table-hover mt-4' >
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
                           dataPagination(items, currentPage, perPage).filter((val) => {
                                if (searchTerm === "") {
                                    let x: any =
                                        val.task.filter((val1: any) => {
                                            if (val1.employee.includes(id)) {
                                                console.log(val1)
                                                return val1
                                            }
                                        })
                                    if (x.length >= 1) {
                                        return val
                                    }
                                } else if (val.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    let x: any =
                                        val.task.filter((val1: any) => {

                                            if (val1.employee.includes(id)) {
                                                console.log(val1)
                                                return val1
                                            }
                                        })
                                    if (x.length >= 1) {
                                        return val
                                    }
                                }
                            })
                                .map((project, index) => (
                                    <>
                                        {project.task.filter((val: any) => {
                                            if (val.employee.includes(id) && val.status == "Ongoing") {
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
                                                                                Number(index1),
                                                                            )} text-${getColorNameWithIndex(index1)} rounded-2 d-flex align-items-center justify-content-center`}>
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