import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { isString, useFormik } from 'formik';
import dayjs from 'dayjs';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '../../components/bootstrap/Modal';
import data from '../../common/data/dummyCustomerData';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Card, {
    CardBody,
    CardFooter,
    CardHeader,
    CardLabel,
    CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Label from '../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../common/data/enumPaymentMethod';

import moment from 'moment';
import { Value } from 'sass';
import { it } from 'node:test';
import Avatar from '../../components/Avatar';
import USERS from '../../common/data/userDummyData';
import Popovers from '../../components/bootstrap/Popovers';
import Select from '../../components/bootstrap/forms/Select';
import Wizard, { WizardItem } from '../../components/Wizard';
import { firestore, auth, storage } from '../../firebaseConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';




// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
    id: string;
    isOpen: boolean;
    setIsOpen(...args: unknown[]): unknown;
}

interface skills {

    date: any;
    skill: string;
    ratting: any;


}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {
    const router = useRouter();
    const [isedit, setEdit] = useState<boolean>(false);
    const [ispassword, setPassword] = useState<boolean>(false);
    const [passwordbutton, setPasswordbutton] = useState<boolean>(false);
    const [isedit1, setEdit1] = useState<boolean>(false);



    const lskills: skills[] = [
        { date: new Date(), skill: "React", ratting: 0 },
        { date: new Date(), skill: "Node", ratting: 0 },
        { date: new Date(), skill: "Nest js", ratting: 0 },
        { date: new Date(), skill: "Next js", ratting: 0 },
        { date: new Date(), skill: "Sql", ratting: 0 },
        { date: new Date(), skill: "NoSql", ratting: 0 },
    ]

    interface Employee {
        document: string;
        documentname: string;
        imageurl: string;
        streetAddress2: string;
        name: string;
        email: string;
        type: string;
        designation: string;
        balance: number;
        streetAddress: string;
        city: string;
        salary: number
        stateFull: string;
        zip: string;
        password: string;
        NIC: string;
        birthday: moment.Moment;
        accountNumber: string;
        bankName: string;
        membershipDate: moment.Moment;
        _id: string;
        role: string;
    }
    const [selectedButtonIndex, setSelectedButtonIndex] = useState<skills[]>(lskills);
    const [showButton, setShowdButton] = useState<skills[]>(lskills);
    const [user, setUser] = useState<Employee>();
    const [imageurl, setImageurl] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

                    console.log(res.data.lskills[res.data.lskills.length - 1])
                    await setShowdButton(res.data.lskills[res.data.lskills.length - 1])

                    await setUser(res.data)
                    await setSelectedImage(res.data.imageurl)
                    console.log(user)

                } catch (error: any) {
                    console.error("Error fetching current user:", error.message);
                    router.push("/")
                }
            }
            else {
                router.push("/")
            }
        };

        fetchData(); // Call the async function
    }, [id, setIsOpen, isOpen]);

    const handleedit = () => {
        setEdit(true)
    }
    const handlepassword = () => {
        setPassword(true)
        setPasswordbutton(true)
    }
    const cancel = () => {
        setEdit(false)
        setPassword(false)
    }
    const handleedit1 = () => {
        setEdit1(true)
    }
    const cancel1 = () => {
        setEdit1(false)
    }

    let item: any = user;
    const handleUploadimage = async () => {

        if (imageurl) {
            // Assuming generatePDF returns a Promise
            const pdfFile = imageurl;
            console.log(imageurl)
            const storageRef = ref(storage, `employees/${pdfFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, pdfFile);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress1 = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                    },
                    (error) => {
                        console.error(error.message);
                        reject(error.message);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((url) => {
                                console.log('File uploaded successfully. URL:', url);

                                console.log(url);
                                resolve(url); // Resolve the Promise with the URL
                            })
                            .catch((error) => {
                                console.error(error.message);
                                reject(error.message);
                            });
                    }
                );
            });
        } else {
            return null
        }
    }

    const formik = useFormik({

        initialValues: {
            // 	// Set initial form values based on existing customer data
            name: '',
            email: '',
            birthday: '',
            NIC: '',
            accountNumber: '',
            bankName: '',
            password: "",
            confirmPassword: "",

        }
        ,

        validate: (values) => {
            const errors: {
                name?: string;
                email?: string;
                birthday?: string;
                NIC?: string;
                accountNumber?: string;
                bankName?: string;
                password?: string;
                confirmPassword?: string

            } = {};
            if (!item.name) {
                errors.name = 'Required';
            }

            if (!item.birthday) {
                errors.birthday = 'Required';
            }
            if (!item.NIC) {
                errors.NIC = 'Required';
            }
            if (!item.accountNumber) {
                errors.accountNumber = 'Required';
            }
            if (!item.bankName) {
                errors.bankName = 'Required';
            }
            if (!item.email) {
                errors.email = 'Required';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(item.email)
            ) {
                errors.email = 'Invalid email address';
            }
            if (passwordbutton) {
                if (!item.password) {
                    errors.password = 'Required';
                }

                if (!values.confirmPassword) {
                    errors.confirmPassword = 'Required';
                } else if (values.confirmPassword != item.password) {
                    errors.confirmPassword = 'password not match';
                }
            }

            return errors;
        },


        onSubmit: async (values) => {
            try {
                console.log(item)
                const processingPopup = Swal.fire({
                    title: "Processing...",
                    html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                });

                try {
                    console.log(item)
                    const imgurl: any = await handleUploadimage()

                    if (imgurl) {
                        item.imageurl = imgurl;
                    }


                    axios
                        .put(`http://localhost:8090/user/employee/${user?._id}`, item)
                        .then((res: any) => {
                            setIsOpen(false);
                            Swal.fire('Updated!', 'Employee has been update.', 'success');
                        })
                        .catch((err) => {
                            console.error('Error fetching data: ', err);
                        });

                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            } catch (error) {
                console.error('Error during handleUpload: ', error);
                alert('An error occurred during file upload. Please try again later.');
            }

        },
    });



    const handleButtonClick = (index: any, rowindex: any) => {
        const updatedRows = [...selectedButtonIndex]
        updatedRows[rowindex].ratting = index;
        setSelectedButtonIndex(updatedRows);
    };
    const handlesaveClick = () => {
        try {
            axios
                .put(`http://localhost:8090/user/${user?._id}`, selectedButtonIndex)
                .then((res: any) => {
                    setIsOpen(false);
                    Swal.fire('Updated!', 'Employee has been update.', 'success');
                })
                .catch((err) => {
                    console.error('Error fetching data: ', err);
                });

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const renderButtons = (index: any) => {
        const buttons = [];
        for (let i = 1; i <= 10; i++) {
            const buttonColor = i <= selectedButtonIndex[index].ratting ? '#46BCAA' : 'gray';
            buttons.push(
                <Popovers trigger='hover' desc={i + "0%"}>
                    <Button
                        className='m-1'

                        key={i}
                        style={{ backgroundColor: buttonColor, height: 20, width: 20 }}
                        onClick={() => handleButtonClick(i, index)}
                    >

                    </Button>
                </Popovers>
            );
        }
        return buttons;
    };

    const renderButtons1 = (index: any) => {
        const buttons = [];
        for (let i = 1; i <= 10; i++) {
            const buttonColor = i <= showButton[index].ratting ? '#46BCAA' : 'gray';
            buttons.push(
                <Popovers trigger='hover' desc={i + "0%"}>
                    <Button
                        className='m-1'

                        key={i}
                        style={{ backgroundColor: buttonColor, height: 20, width: 20 }}

                    >

                    </Button>
                </Popovers>
            );
        }
        return buttons;
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
            <ModalHeader setIsOpen={setIsOpen} className='p-4'>
                <ModalTitle id="">Profile Page</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4 m-4'>
                <div>
                    <div className='row g-4'>
                        <div className='col-12'>
                            <div className='row g-4 align-items-center'>
                                <div className='col-lg-auto'>
                                    {selectedImage ?
                                        <img src={selectedImage} className="mx-auto d-block mb-4"
                                            alt="Selected Profile Picture"
                                            style={{ width: '150px', height: '150px', borderRadius: 70 }}
                                        /> : <Avatar
                                            src={USERS.JOHN.src}
                                            color={USERS.JOHN.color}
                                        />}

                                </div>
                                <div className='col-lg'>
                                    <div className='row g-2'>
                                        <p className="fs-1">{user?.name}</p>

                                        <p className='lead text-muted'>
                                            {user?.role}<br />
                                            <small>{user?.streetAddress},{user?.streetAddress2}{user?.city}</small>
                                        </p>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row mt-5'>
                        <div className='col-xl-12'>
                            <Card >
                                <CardHeader borderSize={1}>
                                    <CardLabel iconColor='success'>
                                        <CardTitle>
                                            Personal Information
                                            <Popovers trigger='hover' desc='Edit'>
                                                <Button icon='Edit' size="lg" onClick={handleedit}> </Button>

                                            </Popovers>
                                        </CardTitle>
                                    </CardLabel>
                                </CardHeader>
                                <CardBody className='table-responsive' isScrollable={false}>
                                    <div className='row'>
                                        <div className='col-xl-6 mt-3' >
                                            <div className='row'>
                                                <div className='col-xl-6 mt-3' >
                                                    Name
                                                </div>
                                                <div className='col-xl-6  mt-3'>
                                                    {
                                                        isedit ?
                                                            <FormGroup id='name' onChange={(e: any) => { item.name = e.target.value }} className='col-md-12'>
                                                                <Input
                                                                    type='text'
                                                                    // onChange={(e:any)=>{item.name=e.target.value}} 
                                                                    onChange={formik.handleChange}

                                                                    value={item?.name}
                                                                    onBlur={formik.handleBlur}
                                                                    isValid={formik.isValid}
                                                                    isTouched={formik.touched.name}
                                                                    invalidFeedback={formik.errors.name}
                                                                    validFeedback='Looks good!'


                                                                />
                                                            </FormGroup>

                                                            : <>{user?.name}</>
                                                    }

                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    Email
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ? <FormGroup id='email' onChange={formik.handleChange} className='col-md-12'>
                                                            <Input
                                                                required
                                                                type='email'
                                                                onChange={(e: any) => { item.email = e.target.value }}
                                                                value={item?.email}
                                                                onBlur={formik.handleBlur}
                                                                isValid={formik.isValid}
                                                                isTouched={formik.touched.email}
                                                                invalidFeedback={formik.errors.email}
                                                                validFeedback='Looks good!'

                                                            />
                                                        </FormGroup>


                                                            : <>{user?.email}</>
                                                    }
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    Birthdate
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ? <FormGroup id='birthday' onChange={formik.handleChange} className='col-md-12'>
                                                            <Input
                                                                type='date'
                                                                onChange={(e: any) => { item.birthday = e.target.value }}
                                                                value={formik.values.birthday || dayjs(item?.birthday).format('YYYY-MM-DD')}
                                                                // value={formik.values.birthday}
                                                                isValid={formik.isValid}
                                                                isTouched={formik.touched.birthday}
                                                                invalidFeedback={formik.errors.birthday}
                                                                validFeedback='Looks good!' />
                                                        </FormGroup>


                                                            : <>{dayjs(item?.birthday).format('YYYY-MM-DD')}</>
                                                    }
                                                </div>


                                                <div className='col-xl-6 mt-3'>
                                                    NIC
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ? <FormGroup id='NIC' onChange={formik.handleChange} className='col-md-12'>
                                                            <Input
                                                                onChange={(e: any) => { item.NIC = e.target.value }}
                                                                value={item?.NIC}
                                                                isValid={formik.isValid}
                                                                isTouched={formik.touched.NIC}
                                                                invalidFeedback={formik.errors.NIC}
                                                                validFeedback='Looks good!'

                                                            />
                                                        </FormGroup>


                                                            : <>{user?.NIC}</>
                                                    }
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    Bank Account number
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ? <FormGroup id='accountNumber' onChange={formik.handleChange} className='col-md-12'>
                                                            <Input

                                                                onChange={(e: any) => { item.accountNumber = e.target.value }}
                                                                value={item?.accountNumber}
                                                                isValid={formik.isValid}
                                                                isTouched={formik.touched.accountNumber}
                                                                invalidFeedback={formik.errors.accountNumber}
                                                                validFeedback='Looks good!'

                                                            />
                                                        </FormGroup>


                                                            : <>{user?.accountNumber}</>
                                                    }

                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    Branch
                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ?
                                                            <FormGroup id='bankName' onChange={formik.handleChange} className='col-md-12'>
                                                                <Input
                                                                    onChange={(e: any) => { item.bankName = e.target.value }}
                                                                    value={item?.bankName}
                                                                    isValid={formik.isValid}
                                                                    isTouched={formik.touched.bankName}
                                                                    invalidFeedback={formik.errors.bankName}
                                                                    validFeedback='Looks good!'

                                                                />
                                                            </FormGroup>


                                                            : <>{user?.bankName}</>
                                                    }

                                                </div>
                                                <div className='col-xl-6 mt-3'>
                                                    {
                                                        isedit ?
                                                            <FormGroup label='Profile Picture' className='col-md-12'>
                                                                <Input
                                                                    type='file'
                                                                    onChange={(e: any) => {
                                                                        setImageurl(e.target.files[0]);
                                                                        // Display the selected image
                                                                        setSelectedImage(URL.createObjectURL(e.target.files[0]));
                                                                    }}
                                                                />

                                                            </FormGroup>
                                                            : <></>
                                                    }

                                                </div>


                                            </div>
                                        </div>
                                        <div className='col-xl-6  mt-3'>
                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                {
                                                    isedit ?
                                                        <Button onClick={handlepassword} hidden={passwordbutton}>change password</Button>
                                                        : ""
                                                }


                                            </div>
                                            {
                                                ispassword ?
                                                    <>
                                                        <div className='col-12'>
                                                            <FormGroup id='password' label='Password' onChange={formik.handleChange} className='col-md-12'>
                                                                <Input
                                                                    type='password'
                                                                    autoComplete='username'
                                                                    value={formik.values.password}
                                                                    onChange={(e: any) => { item.password = e.target.value }}
                                                                    isValid={formik.isValid}
                                                                    isTouched={formik.touched.password}
                                                                    invalidFeedback={formik.errors.password}
                                                                    validFeedback='Looks good!'
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                        <div className='col-12'>
                                                            <FormGroup id='confirmPassword' label='confirm Password' className='col-md-12'>
                                                                <Input
                                                                    type="password"
                                                                    value={formik.values.confirmPassword}
                                                                    onChange={formik.handleChange}

                                                                    onBlur={formik.handleBlur}
                                                                    isValid={formik.isValid}
                                                                    isTouched={formik.touched.confirmPassword}
                                                                    invalidFeedback={formik.errors.confirmPassword}
                                                                    validFeedback='Looks good!'
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    </> : ""
                                            }


                                        </div>
                                        {
                                            isedit ?
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                    <Button color="info" className='mt-4' onClick={cancel}>Cancel</Button>
                                                    <Button color="info" className='mt-4' onClick={formik.handleSubmit}>Save</Button>
                                                </div>
                                                : ""
                                        }
                                    </div>




                                </CardBody>

                            </Card>
                        </div>
      
                    </div>


                </div>
            </ModalBody>

        </Modal>
    );
}
// If 'id' is not present, return null (modal won't be rendered)



// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;