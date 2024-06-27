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
import TeamAddModal from './AddNewProject/TeamAddModal';
import TeamEditModal from './EditProject/TeamEditModal';
import axios from 'axios';
import useDarkMode from '../../../hooks/useDarkMode';
import { Item } from '../../../layout/Navigation/Navigation';
import moment from 'moment';
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
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const { darkModeStatus } = useDarkMode();
  const [project, setProject] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  //get user role
  useEffect(() => {
    const fetchData = async () => {
      // Load data from localStorage when the component mounts
      const role = localStorage.getItem('role');
      if (role != "Project Manager") {
        router.push("/")
      }
    };
    fetchData(); // Call the async function
  }, []);

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
      <Head>
        <title></title>
      </Head>
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
            placeholder='Search team...'
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}

          />
        </SubHeaderLeft>
        <SubHeaderRight>


          <SubheaderSeparator />
          {/* Button to open new employee modal */}
          <Button icon='PersonAdd' color='primary' isLight onClick={() => setAddModalStatus(true)}>
            New project
          </Button>
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
                          <Button icon='Edit' onClick={() => (setEditModalStatus(true), setId(project._id))}>
                            Edit
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
      <TeamAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id="" />
      <TeamEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />

    </PageWrapper>
  )
}

export default Index