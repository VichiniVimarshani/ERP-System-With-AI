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

interface Team {
  id: string,
  TeamName: string;
  email: string;
  leader: string;
  employees: any
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
  const [teams, setTeams] = useState<Team[]>([]);
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
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get("http://localhost:8090/team/")
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
  }, [status]);

  const onhandlechange = (index: any) => {
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const { items, requestSort, getClassNamesFor } = useSortableData(employeeData);

  useEffect(() => {
    setId(employeeData.length + 1)
  }, [employeeData]);

  const handleClickDelete = async (id: string) => {
    
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this team!',
        // text: id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {

        axios
          .delete(`http://localhost:8090/team/${id}`)
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

  // filter
  const handlefulltimefilter = () => {
    if (fulltime == true) {
      setFulltime(false)

    } else {
      setFulltime(true)
    }


  }
  //filter parttime
  const handleparttimefilter = () => {

    if (parttime == true) {
      setParttime(false)
    }
    else {
      setParttime(true)
    }

  }
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
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch>
              <CardBody isScrollable className='table-responsive'>
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
                    {dataPagination(
                      teams.filter((val) => {
                        if (searchTerm === "") {
                          return val
                        } else if (val.TeamName.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val
                        }
      
                      }),
                      currentPage,
                      perPage
                    )
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
                        <Button
                            icon='Delete'
                            isLight
                            onClick={() => handleClickDelete(team._id)}
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
                    ))}
                  </tbody>
                  <tbody>
                    {/* {dataPagination(items, currentPage, perPage).map((i) => (
      
     
   ))} */}
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
      {/* <CustomerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id="" /> */}
    </PageWrapper>
  );
};



export default Index;



// import React, { useState, useEffect } from 'react';
// import type { NextPage } from 'next';
// import { GetStaticProps } from 'next';
// import Head from 'next/head';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useFormik } from 'formik';
// import useDarkMode from '../../../hooks/useDarkMode';
// import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
// import { demoPagesMenu } from '../../../menu';
// import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
// import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
// import Icon from '../../../components/icon/Icon';
// import Input from '../../../components/bootstrap/forms/Input';
// import Button from '../../../components/bootstrap/Button';
// import Page from '../../../layout/Page/Page';
// import Card, { CardBody } from '../../../components/bootstrap/Card';
// import CustomerEditModal from '../../hrm/_common/CustomerEditModal';
// import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { firestore } from '../../../firebase';
// import moment from 'moment';
// import { getColorNameWithIndex } from '../../../common/data/enumColors';
// import { getFirstLetter } from '../../../helpers/helpers';

// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   type: string;
//   designation: string;
//   balance: number;
//   membershipDate: moment.Moment;
// }

// const Index: NextPage = () => {
//   // Dark mode
//   const { darkModeStatus } = useDarkMode();

//   // State for current page and items per page
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

//   const [editModalStatus, setEditModalStatus] = useState<boolean>(false);

//   // Formik form for search and filter
//   const formik = useFormik({
//     initialValues: {
//       searchInput: '',
//       type: [],
//     },
//     onSubmit: () => {
//       // alert(JSON.stringify(values, null, 2));
//     },
//   });

//   const [employeeData, setEmployeeData] = useState<Employee[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const dataCollection = collection(firestore, 'employees');
//         const querySnapshot = await getDocs(dataCollection);
//         const firebaseData = querySnapshot.docs.map((doc) => {
//           const data = doc.data() as Employee;
//           return {
//             id: doc.id,
//             ...data,
//             membershipDate: moment(data.membershipDate),
//           };
//         });
//         setEmployeeData(firebaseData);
//         console.log('Firebase Data:', firebaseData);
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };

//     fetchData();
//   }, []);

// 	function handleClickDelete(id: string): unknown {
// 		throw new Error('Function not implemented.');
// 	}

// 	function priceFormat(balance: number): string {
// 		return `$${balance.toFixed(2)}`;
// 	}

//   return (
//     <PageWrapper>
//       <Head>
//         <title>{demoPagesMenu.hrm.subMenu.customersList.text}</title>
//       </Head>
//       <SubHeader>
//         <SubHeaderLeft>
//           {/* Search input */}
//           <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
//             <Icon icon='Search' size='2x' color='primary' />
//           </label>
//           <Input
//             id='searchInput'
//             type='search'
//             className='border-0 shadow-none bg-transparent'
//             placeholder='Search employee...'
//             onChange={formik.handleChange}
//             value={formik.values.searchInput}
//           />
//         </SubHeaderLeft>
//         <SubHeaderRight>
//           {/* Button to open new employee modal */}
//           <Button icon='PersonAdd' color='primary' isLight onClick={() => setEditModalStatus(true)}>
//             New Employee
//           </Button>
//         </SubHeaderRight>
//       </SubHeader>
//       <Page>
//         <div className='row h-100'>
//           <div className='col-12'>
//             {/* Table for displaying customer data */}
//             <Card stretch>
//               <CardBody isScrollable className='table-responsive'>
//                 <table className='table table-modern table-hover'>
//                   <thead>
//                     <tr>
//                       <th>Employee Name</th>
//                       <th>Email</th>
//                       <th>Started Date</th>
//                       <th>Salary or Allowance</th>
//                       <td />
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employeeData.map((employee) => (
//                       <tr key={employee.id}>
//                         <td>
//                           <div className='d-flex align-items-center'>
//                             <div className='flex-shrink-0'>
//                               <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
//                                 <div
//                                   className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
//                                     employee.id,
//                                   )} text-${getColorNameWithIndex(employee.id)} rounded-2 d-flex align-items-center justify-content-center`}>
//                                   <span className='fw-bold'>{getFirstLetter(employee.name)}</span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className='flex-grow-1'>
//                               <div className='fs-6 fw-bold'>{employee.name}</div>
//                               <div className='text-muted'>
//                                 <Icon icon='Label' /> <small>{employee.type}</small>
//                               </div>
//                               <div className='text-muted'>
//                                 <Icon icon='Label' /> <small>{employee.designation}</small>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <Button
//                             isLink
//                             color='light'
//                             icon='Email'
//                             className='text-lowercase'
//                             tag='a'
//                             href={`mailto:${employee.email}`}>
//                             {employee.email}
//                           </Button>
//                         </td>
//                         <td>
//                           <div>{employee.membershipDate.format('ll')}</div>
//                           <div>
//                             <small className='text-muted'>{employee.membershipDate.fromNow()}</small>
//                           </div>
//                         </td>
//                         <td>{priceFormat(employee.balance)}</td>
//                         <td>
//                           <Button
//                             icon='Visibility'
//                             tag='a'
//                             href={`/${demoPagesMenu.hrm.subMenu.customerID.path}/${employee.id}`}>
//                             View
//                           </Button>
//                           <Button
//                             icon='Delete'
//                             isLight
//                             onClick={() => handleClickDelete(employee.id)}>
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </CardBody>
//               {/* PaginationButtons component can be added here if needed */}
//             </Card>
//           </div>
//         </div>
//       </Page>
//       <CustomerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id='0' />
//     </PageWrapper>
//   );
// };

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common', 'menu'])),
//   },
// });

// export default Index;
