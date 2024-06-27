import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useFormik } from 'formik';
import useDarkMode from '../../../hooks/useDarkMode';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import { demoPagesMenu } from '../../../menu';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
// import CustomerEditModal from './addemployee/CustomerEditModal';
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
import router from 'next/router';
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

  // Dark mode
  const { darkModeStatus } = useDarkMode();
  //store search feild data
  const [searchTerm, setSearchTerm] = useState("");
  const [fulltime, setFulltime] = useState<boolean>(true);
  const [parttime, setParttime] = useState<boolean>(true);
  const [id, setId] = useState<any>();
  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState([])
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    //get user role
    useEffect(() => {
      const fetchData = async () => {
        // Load data from localStorage when the component mounts
        const role = localStorage.getItem('role');
        if (role != "Admin") {
          router.push("/")
        }
      };
      fetchData(); // Call the async function
    }, []);
    
  //get project deyails
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
  }, [status]);

  //get all developer
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
  }, [status]);

  const onhandlechange = (index: any) => {
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };


  useEffect(() => {
    setId(employeeData.length + 1)
  }, [employeeData]);

  //handle delete 
  const handleClickDelete = async (id: string) => {
    
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this project!',
        // text: id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {

        axios
          .delete(`http://localhost:8090/project/${id}`)
          .then((res: any) => {
           setStatus(true)
          })
          .catch((err) => {
            console.error('Error fetching data: ', err);
          });
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to delete employee.', 'error');
    }



  };


  return (
    <PageWrapper>
      
      <SubHeader>
        <SubHeaderLeft>
          {/* Search input */}
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search Team...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          
          <SubheaderSeparator />
          {/* Button to open new employee modal */}
          {/* <Button icon='PersonAdd' color='primary' isLight onClick={() => setEditModalStatus(true)}>
            New Employee
          </Button> */}
        </SubHeaderRight>
      </SubHeader>
      <Page>
      <div>
          <table border={1} className='table table-modern table-hover mt-5' >
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
                project.filter((val) => {
                  if (searchTerm === "") {
                    return val
                  } else if (val.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return val
                  }

                })
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
                        <Button
                            icon='Delete'
                            isLight
                            onClick={() => handleClickDelete(project._id)}
                          >
                            Delete
                          </Button>
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
      </Page>
      {/* <CustomerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id="" /> */}
    </PageWrapper>
  );
};



export default Index;
