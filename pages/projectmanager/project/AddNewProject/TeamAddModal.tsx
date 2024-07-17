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
import Select from '../../../../components/bootstrap/forms/Select';
import Option from '../../../../components/bootstrap/Option';
import { Item } from '../../../../layout/Navigation/Navigation';
// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
    id: string;
    isOpen: boolean;
    setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const TeamAddModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

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
        _id: string;
        id: string,
        TeamName: string;
        email: string;
        leader: string;
        employees: any;
        leaderId:string;

    }

    interface task {
        name: string
        time: string
        employee: string
        status: string
    }


    const [team, setTeam] = useState<Team[]>([]);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee[]>([]);
    const [teamnumber, setTeamNumber] = useState(generateRandomNumber());
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<task[]>([{ name: "", time: "", employee: "", status: "pending" }])


    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get("http://localhost:8090/team")
                    .then((res: any) => {
                        setTeam(res.data)
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


    //add new row to inome
    const addRow = () => {

        setRows([...rows, { name: "", time: "", employee: "", status: "pending" }]);
    };

    const deleteRow = (index: number) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };

    // generate team number
    function generateRandomNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    }

 // Initialize formik for form management
    const formik = useFormik({

        initialValues: {
            // 	// Set initial form values based on existing customer data
            projectName: '',
            id: teamnumber,
            team: '',
            teamId: '',
            leader:'',
            task: [{}],

        },

        validate: (values) => {
            const errors: {
                projectName?: string;
                team?: string;
                id?: string;
                leader?: string;

            } = {};
            if (!values.projectName) {
                errors.projectName = 'Required';
            }
            if (!values.team) {
                errors.team = 'Required';
            }

            return errors;
        },
        onSubmit: async (values) => {

            if (rows.length == 0) {
                Swal.fire('Error', 'please add task to the Project.', 'error');
                return
            }
            values.task=rows
            console.log(values)


            const isInvalidRow = rows.some((row1) => !row1.employee|| !row1.name||!row1.time);

            if (isInvalidRow) {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Data',
                text: 'Please fill  all rows in task .',
              });
              return;
            }

            const res: any = postservice('project/', values)
            if (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully add project',
                  });
                  console.log("ok")
                setIsOpen(false)
                  return;
                
            } else {
                console.log("bad")
            }
        },
    });


    const handleLeaderChange = (event: any) => {
        formik.handleChange(event);
    };

    const handleLeaderBlur = (event: any) => {
        const selectedLeader = team.find(team => team.TeamName.toLowerCase().includes(event.target.value));

        console.log(selectedLeader)

        if (selectedLeader) {
            formik.setFieldValue('team', selectedLeader.TeamName);
            formik.setFieldValue('teamId', selectedLeader._id);
            formik.setFieldValue('leader', selectedLeader.leaderId);
        }
        formik.handleBlur(event);
    };


    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
            <ModalHeader setIsOpen={setIsOpen} className='p-4'>
                <ModalTitle id="">{'New Project'}</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
                {/* Form fields for customer information */}
                <div className='row g-4'>

                    <FormGroup id='projectName' label='Project Name' className='col-md-6'>
                        <Input
                            onChange={formik.handleChange}
                            value={formik.values.projectName}

                            onBlur={formik.handleBlur}
                            isValid={formik.isValid}
                            isTouched={formik.touched.projectName}
                            invalidFeedback={formik.errors.projectName}
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

                    <FormGroup id='team' label='Select Team' className='col-md-6'>
                        <Input
                            onChange={handleLeaderChange}
                            value={formik.values.team}
                            onBlur={handleLeaderBlur}
                            isValid={formik.isValid}
                            isTouched={formik.touched.team}
                            invalidFeedback={formik.errors.team}
                            validFeedback='Looks good!'
                        />
                    </FormGroup>
                    <p className="h5">Add task</p>

                    <Card stretch style={{ height: "500px" }}>
                        <CardBody isScrollable={true} className='table-responsive'>

                            <div className='row g-4'>
                                {/* <div className='col-10'>
                                    <Input
                                        id='searchInput'
                                        type='search'
                                        className='border-1 shadow-none bg-transparent'
                                        placeholder='Search developer...'
                                        onChange={(event: any) => { setSearchTerm(event.target.value); }}
                                        value={searchTerm}
                                    />
                                </div> */}
                            </div>
                            <table className="table mt-5" >
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Developer</th>
                                        <th></th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control test-end"
                                                    value={row.name}
                                                    onChange={(e) => {
                                                        const updatedRows = [...rows];
                                                        updatedRows[index].name = e.target.value;
                                                        setRows(updatedRows);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Select
                                                    ariaLabel='Default select example'
                                                    placeholder='select time'
                                                    className='col-6'
                                                    value={row.time}
                                                    onChange={(e: any) => {
                                                        const updatedRows = [...rows];
                                                        updatedRows[index].time = e.target.value;
                                                        setRows(updatedRows);
                                                    }}
                                                >
                                                    <Option value='One Hour'>One Hour</Option>
                                                    <Option value='Two Hour'>Two Hour</Option>
                                                    <Option value='Fore Hour'>Fore Hour</Option>
                                                    <Option value='One Day'>One Day</Option>
                                                    <Option value='Two Day'>Two Days</Option>
                                                    <Option value='Three Day'>Three Days</Option>

                                                </Select>
                                            </td>
                                            <td>
                                                <Select
                                                    ariaLabel='Default select example'
                                                    placeholder='select time'
                                                    className='col-6'
                                                    value={row.employee}
                                                    onChange={(e: any) => {
                                                        const updatedRows = [...rows];
                                                        updatedRows[index].employee = e.target.value;
                                                        setRows(updatedRows);
                                                    }}
                                                >
                                                    {
                                                        team.filter((val) => {
                                                            if (formik.values.teamId.includes(val._id)) {
                                                                return val
                                                            }
                                                        }).map((team, index) => (
                                                            <>
                                                                {team.employees.map((employee: any, index: any) => (
                                                                    <Option value={employee._id}>{employee.name}</Option>
                                                                ))
                                                                }
                                                            </>
                                                        ))
                                                    }
                                                </Select>
                                            </td>
                                            <td>
                                                <Button className='mt-1' color="danger" onClick={() => deleteRow(index)} >
                                                    Cancle
                                                </Button>

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                            <Button icon="Add" color="primary" onClick={addRow}>
                                Add Row
                            </Button>



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
