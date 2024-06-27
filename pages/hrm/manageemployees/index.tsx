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
import CustomerEditModal from '../addemployee/CustomerEditModal';
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
  salary: number;
  NIC: string;
  role: string;
  designation: string;
  membershipDate: moment.Moment;
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get("http://localhost:8090/user/employee/")
          .then((res: any) => {
            setEmployeeData(res.data)
          })
          .catch((err) => {
            console.error('Error fetching data: ', err);
          });

      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [editModalStatus, status]);

  const { items, requestSort, getClassNamesFor } = useSortableData(employeeData);

  useEffect(() => {
    setId(employeeData.length + 1)
  }, [employeeData]);

  const handleClickDelete = async (id: string) => {
    console.log(id)
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this employee!',
        // text: id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {

        axios
          .delete(`http://localhost:8090/user/${id}`)
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
            placeholder='Search Developer...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Dropdown>
            <DropdownToggle hasIcon={false}>
              <Button
                icon='FilterAlt'
                color='dark'
                isLight
                className='btn-only-icon position-relative'>

              </Button>
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size='lg'>
              <div className='container py-2'>
                <div className='row g-3'>

                  <FormGroup label='Employee type' className='col-12'>
                    <ChecksGroup>

                      {/* <input type="checkbox" value="ful-time" name='fulltime' id='fulltime' checked onClick={handlefilter}/>
                     <label htmlFor="" style={{padding:"8px"}}> full-time</label><br/>
                     <input type="checkbox" value="ful-time" name='fulltime'  id='parttime' checked onClick={handlefilter}  />
                     <label htmlFor="" style={{padding:"8px"}}> part-time</label> */}
                      <Checks
                        key="full-time"
                        id="full-time"
                        label="full-time"
                        name='full-time'
                        value="full-time"

                        onClick={handlefulltimefilter}
                        checked={fulltime}
                      />

                      <Checks
                        key="part-time"
                        id="part-time"
                        label="part-time"
                        name='part-time'
                        value="part-time"

                        onClick={handleparttimefilter}
                        checked={parttime}

                      />

                    </ChecksGroup>
                  </FormGroup>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
          <SubheaderSeparator />
          {/* Button to open new employee modal */}
          <Button icon='PersonAdd' color='primary' isLight onClick={() => setEditModalStatus(true)}>
            New Developer
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch>
              <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Started Date</th>
                      <th>Salary or Allowance</th>
                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {dataPagination(
                      employeeData.filter((val) => {
                        if (searchTerm === "") {
                          if (fulltime == true && parttime == true) {
                            return val;
                          } else if (parttime == true && fulltime == false) {
                            return val.type.toLowerCase().includes('part-time');
                          } else if (parttime == false && fulltime == true) {
                            return val.type.toLowerCase().includes('full-time');
                          }
                        } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                          if (fulltime == true && parttime == true) {
                            return val;
                          } else if (parttime == true && fulltime == false) {
                            return val.type.toLowerCase().includes('part-time');
                          } else if (parttime == false && fulltime == true) {
                            return val.type.toLowerCase().includes('full-time');
                          }
                        }
                      }),
                      currentPage,
                      perPage
                    ).map((employee, index) => (
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
                          <Button
                            icon='Delete'
                            isLight
                            onClick={() => handleClickDelete(employee._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
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
      <CustomerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id="" />
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
