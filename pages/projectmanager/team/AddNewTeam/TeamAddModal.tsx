import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Card, {
    CardBody,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import moment from 'moment';
import axios from 'axios';
import useDarkMode from '../../../../hooks/useDarkMode';
import { getColorNameWithIndex } from '../../../../common/data/enumColors';
import { getFirstLetter } from '../../../../helpers/helpers';
import Icon from '../../../../components/icon/Icon';
import Swal from 'sweetalert2';
import postservice from '../../../../services/postservice'
// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
    id: string;
    isOpen: boolean;
    setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const TeamAddModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

    interface skills {
        date: any;
        skill: string;
        ratting: any;
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
    const lskills: skills[] = [
        { date: new Date(), skill: "React", ratting: 7 },
        { date: new Date(), skill: "Node", ratting: 8 },
        { date: new Date(), skill: "Nest js", ratting: 7 },
        { date: new Date(), skill: "Next js", ratting: 6 },
        { date: new Date(), skill: "Sql", ratting: 4 },
        { date: new Date(), skill: "NoSql", ratting: 7 },
    ]

    const { darkModeStatus } = useDarkMode();
    const [showskills, setShowskills] = useState<boolean>(true)
    const [employeeadd, setemployeeadd] = useState<boolean>(true)
    const [selectedButtonIndex, setSelectedButtonIndex] = useState<skills[]>(lskills);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee[]>([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [teamnumber, setTeamNumber] = useState(generateRandomNumber());
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/user/developer/")
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
    }, [isOpen]);

    const renderButtons = (index: any) => {
        const buttons = [];
        for (let i = 1; i <= 10; i++) {
            const buttonColor = i <= selectedButtonIndex[index].ratting ? '#46BCAA' : 'gray';
            buttons.push(
                <Button
                    className='m-1'
                    key={i}
                    style={{ backgroundColor: buttonColor, height: 20, width: 20 }}
                >
                </Button>
            );
        }
        return buttons;
    };

    const onhandlechange = (index: any) => {
        setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };


    const onEmployeeAddChange = () => {
        if (employeeadd) {
            console.log(selectedEmployeeData)
            setemployeeadd(false)
        } else {
            setemployeeadd(true)
        }
    }
    // generate team number
    function generateRandomNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    }

    //add employees to the team
    const handleCheckboxChange = async (checked: any, employee: Employee) => {
        console.log(checked)
        if (checked) {
            await setSelectedEmployeeData((prevData) => [...prevData, employee]);
        } else {
            await setSelectedEmployeeData((prevData) =>
                prevData.filter((emp) => emp._id !== employee._id)
            );
        }

    };

    // Initialize formik for form management
    const formik = useFormik({

        initialValues: {
            // 	// Set initial form values based on existing customer data
            TeamName: '',
            id: teamnumber,
            email: '',
            leader: '',
            leaderId:'',
            employees: [{}],

        },

        validate: (values) => {
            const errors: {
                TeamName?: string;
                email?: string;
                id?: string;
                leader?: string;

            } = {};
            if (!values.TeamName) {
                errors.TeamName = 'Required';
            }
            if (!values.email) {
                errors.email = 'Required';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address';
            }
            if (!values.leader) {
                errors.leader = 'Required';
            }
            return errors;
        },
        onSubmit: async (values) => {

            if (selectedEmployeeData.length == 0) {
                Swal.fire('Error', 'please add members to the team.', 'error');
                return
            }
            console.log(selectedEmployeeData)

            values.employees = selectedEmployeeData

            const res: any = postservice('team/', values)
            if (res) {
                console.log("ok")
                setIsOpen(false)
            } else {
                console.log("bad")
            }
        },
    });


    const handleLeaderChange = (event: any) => {
        formik.handleChange(event);
    };

    const handleLeaderBlur = (event: any) => {
        const selectedLeader = employeeData.find(leader => leader.name.toLowerCase().includes(event.target.value));
      
        console.log(selectedLeader)

        if (selectedLeader) {
            formik.setFieldValue('leader', selectedLeader.name);
            formik.setFieldValue('leaderId',selectedLeader._id)
            formik.setFieldValue('email',selectedLeader.email)
            formik.handleBlur(selectedLeader.name);
        }

        formik.handleBlur(event);
    };


    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
            <ModalHeader setIsOpen={setIsOpen} className='p-4'>
                <ModalTitle id="">{'New Team'}</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
                {/* Form fields for customer information */}
                <div className='row g-4'>

                    <FormGroup id='TeamName' label='Team Name' className='col-md-6'>
                        <Input
                            onChange={formik.handleChange}
                            value={formik.values.TeamName}

                            onBlur={formik.handleBlur}
                            isValid={formik.isValid}
                            isTouched={formik.touched.TeamName}
                            invalidFeedback={formik.errors.TeamName}
                            validFeedback='Looks good!'

                        />
                    </FormGroup>
                    <FormGroup id='id' label='Team ID' className='col-md-6'>
                        <Input
                            onChange={formik.handleChange}
                            value={formik.values.id}
                            disabled
                        />
                    </FormGroup>
                    <FormGroup id='leader' label='Leader' className='col-md-6'>
                        <Input
                            onChange={handleLeaderChange}
                            value={formik.values.leader}
                            onBlur={handleLeaderBlur}
                            isValid={formik.isValid}
                            isTouched={formik.touched.leader}
                            invalidFeedback={formik.errors.leader}
                            validFeedback='Looks good!'
                        />
                    </FormGroup>
                    <FormGroup id='email' label='Email' className='col-md-6'>
                        <Input
                            required
                            type='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                            isValid={formik.isValid}
                            isTouched={formik.touched.email}
                            invalidFeedback={formik.errors.email}
                            validFeedback='Looks good!'

                        />
                    </FormGroup>

                    <p className="h5">Add developers for team</p>

                    <Card stretch style={{ height: "500px" }}>
                        <CardBody isScrollable={true} className='table-responsive'>

                            <div className='row g-4'>
                                <div className='col-10'>
                                    <Input

                                        id='searchInput'
                                        type='search'
                                        className='border-1 shadow-none bg-transparent'
                                        placeholder='Search developer...'
                                        onChange={(event: any) => { setSearchTerm(event.target.value); }}
                                        value={searchTerm}
                                    />
                                </div><div className='col-2'>
                                    {/* {
                                        employeeadd ?
                                            <Button color='info' icon='Add' onClick={onEmployeeAddChange} >
                                                Add
                                            </Button>
                                            : <Button color='warning' icon='Edit' onClick={onEmployeeAddChange} >
                                                Edit
                                            </Button>
                                    } */}
                                    {/* <Button color='info' icon='Add' >
                                        Add
                                    </Button> */}
                                </div>
                            </div>


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
                                    {
                                        employeeData.filter((val) => {
                                            if (searchTerm === "") {
                                                return val
                                            } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                return val
                                            }

                                        })
                                            .map((employee, index) => (
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
                                                        <th>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                style={{ height: "20px", width: "20px" }}
                                                                value=""
                                                                id={`checkbox_${employee.id}`}
                                                                //   checked={selectedEmployeeData.some((e) => e.id === employee.id)}
                                                                onChange={(e) => handleCheckboxChange(e.target.checked, employee)}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr hidden={selectedRowIndex !== index}>
                                                        <td colSpan={4}>
                                                            <h5>Skills</h5>
                                                            <div className='row g-4 ms-5'>
                                                                {selectedButtonIndex.map((button, index: any) => (
                                                                    <>
                                                                        <div className='col-2'>
                                                                            {button.skill}
                                                                        </div><div className='col-9'>
                                                                            {renderButtons(index)}
                                                                        </div>
                                                                    </>

                                                                )

                                                                )}
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </>

                                            ))
                                    }

                                </tbody>
                            </table>



                        </CardBody>
                    </Card>

                </div>

            </ModalBody>
            <ModalFooter className='px-4 pb-4'>
                {/* Save button to submit the form */}
                <Button color='info' onClick={formik.handleSubmit} >
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    );
}
// If 'id' is not present, return null (modal won't be rendered)



// Prop types definition for CustomerEditModal component
TeamAddModal.propTypes = {
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
};

export default TeamAddModal;
