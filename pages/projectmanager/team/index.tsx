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
import TeamAddModal from './AddNewTeam/TeamAddModal';
import TeamEditModal from './EditTeam/TeamEditModal';
import axios from 'axios';
import useDarkMode from '../../../hooks/useDarkMode';
import { Item } from '../../../layout/Navigation/Navigation';
import moment from 'moment';
import router from 'next/router';
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
            New Team
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div>
          <table border={1} className='table table-modern table-hover mt-5' >
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
                teams.filter((val) => {
                  if (searchTerm === "") {
                    return val
                  } else if (val.TeamName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return val
                  }

                })
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
                          <Button icon='Edit' onClick={() => (setEditModalStatus(true), setId(team._id))}>
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
      </Page>
      <TeamAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id="" />
      <TeamEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />

    </PageWrapper>
  )
}

export default Index