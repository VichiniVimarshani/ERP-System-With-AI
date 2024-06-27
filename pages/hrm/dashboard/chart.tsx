import React, { FC, useEffect, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Select from '../../../components/bootstrap/forms/Select';
import axios from 'axios';

interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}

interface data {

	projectname: string;
	total: number;

}
interface BudgetEstimation {
	projectName: string;
	projectNumber: string;
	clientNIC: string;
	clientemail: string;
	proposalnumber: string;
	budgetnumber: string;
	companyName: string;
	cid: string;
	clientname: string
	country: string;
	clientmobile: string;
	currency: string;
	Duedate: string;
	totalCost: string;
	discount: string;
	totalEstimation: string;
	rows: any
	documenturl: string
}

interface Employee {
	balance: number;
	id: string;
	cid: string;
	name: string;
	email: string;
	type: string;
	salary: number
	NIC: string;
	designation: string;
	points: string;
	taskname: string;
	status: string;
	role:string

}

const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {


	const [income, setIncome] = useState<number[]>([])
	const [expenses, setExpenses] = useState<number[]>([])
	const [data1, setData] = useState<data[]>([])
	const [role, setRole] = useState<any>('se');

	//get data from database
	const [budgetEstimationData, setBudgetEstimationData] = useState<BudgetEstimation[]>([]);


	//get data
	const [employeeData, setEmployeeData] = useState<Employee[]>([]);


	// //fetch data
	useEffect(() => {
		const fetchData = async () => {
		  try {
			axios
			  .get("http://localhost:8090/employee/")
			  .then((res: any) => {
				setEmployeeData(res.data)
			  })
			  .catch((err:any) => {
				console.error('Error fetching data: ', err);
			  });
	
		  } catch (error) {
			console.error('Error fetching data: ', error);
		  }
		};
	
		fetchData();
	  }, []);












	//get incom and expenses acoding to the month

	useEffect(() => {
		const calculateTotals = () => {
			const filteredItems = employeeData.filter(item => item.designation.includes(role));

			const totalAmounts = filteredItems.map(item => item.points);
			const itemNames = filteredItems.map(item => item.name);

			console.log(filteredItems)
			const newData: any[] = totalAmounts.map((total, index) => ({
				projectname: itemNames[index],
				total: total,
			}));

			setData(newData);
			console.log(newData)


		}
		calculateTotals()
	}, [employeeData,role]);

	//set data to show in chart
	const data: data[] = data1

	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='BarChart' iconColor='warning'>
						<CardTitle>Chart</CardTitle>
					</CardLabel>
					<CardActions>
						<select className="form-select" aria-label="Default select example" onClick={(e:any)=>{setRole(e.target.value)}}>
							
							<option selected value="se">software engineer</option>
							<option value="hr">HR</option>
							<option value="pm">project manager</option>
							<option value="associate">associate</option>
						</select>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="projectname" />
								<YAxis />
								<Tooltip contentStyle={{ backgroundColor: "#1E2027", border: "0", borderRadius: 5 }} />
								<Legend />
								<Bar dataKey="total" fill="rgba(75,192,192,0.6)" name="Employee Name" />
								<Line type="monotone" dataKey="total" stroke="rgba(255, 206, 86, 1)" name="Difference" />
							</BarChart>
						</ResponsiveContainer>
					</>
				</CardBody>

			</Card>
		</>
	);
};

export default CommonUpcomingEvents;
