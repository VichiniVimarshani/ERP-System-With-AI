import { NextPage } from 'next/types'
import React, { useEffect, useState } from 'react'
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Head from 'next/head';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import { getColorNameWithIndex } from '../../../../common/data/enumColors';
import { getFirstLetter } from '../../../../helpers/helpers';

import axios from 'axios';
import useDarkMode from '../../../../hooks/useDarkMode';
import { Item } from '../../../../layout/Navigation/Navigation';
import moment from 'moment';
import Swal from 'sweetalert2';
import router from 'next/router';
import Popovers from '../../../../components/bootstrap/Popovers';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
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
  lskills: any;
  sSkills: any;
  improveS: any;
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
interface skills {

  date: any;
  skill: string;
  ratting: any;


}
const Index: NextPage = () => {
  const lskills: skills[] = [
    { date: new Date(), skill: "Communication Skills", ratting: 0 },
    { date: new Date(), skill: "Response on time", ratting: 0 },
    { date: new Date(), skill: "Team Work", ratting: 0 },
    { date: new Date(), skill: "Availability", ratting: 0 },

  ]
  const tskills: skills[] = [
    { date: new Date(), skill: "Technologies", ratting: "" },
    { date: new Date(), skill: "Clean Code", ratting: 0 },
    { date: new Date(), skill: "Bugs Fixing", ratting: 0 },
    { date: new Date(), skill: "On-time delivery", ratting: 0 },

  ]
  const { darkModeStatus } = useDarkMode();
  const [project, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [ststus, setStatus] = useState<boolean>(true)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<skills[]>(lskills);
  const [showButton, setShowdButton] = useState<skills[]>(lskills);

  const [selectedButtonIndex1, setSelectedButtonIndex1] = useState<skills[]>(tskills);
  const [showButton1, setShowdButton1] = useState<skills[]>(tskills);
  //get user role
  useEffect(() => {
    const fetchData = async () => {
      // Load data from localStorage when the component mounts
      const role = localStorage.getItem('role');
      if (role != "Developer") {
        router.push("/")
      }
    };
    fetchData(); // Call the async function
  }, []);

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
          await setUser(res.data.improveS)
          await setShowdButton(res.data.sSkills)
          await setShowdButton1(res.data.lskills)

          console.log(user)

        } catch (error: any) {
          console.error("Error fetching current user:", error.message);

        }
      }

    };

    fetchData(); // Call the async function
  }, [])

  //get all project 
  const renderButtons1 = (index: any) => {
    const buttons = [];
    for (let i = 1; i <= 10; i++) {
      const buttonColor = i <= showButton[index]?.ratting ? '#46BCAA' : 'gray';
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
  const renderButtons = (index: any) => {
    const buttons: any = [];
    if (index == 0) {
      buttons.push(
        <Input
       
          type='text'
          value={showButton1[index]?.ratting}
          
        />

      )
      return buttons;
    }
    else {
      for (let i = 1; i <= 10; i++) {
        const buttonColor = i <= showButton1[index]?.ratting ? '#46BCAA' : 'gray';
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
    }
  };


  const onhandlechange = (index: any) => {
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <PageWrapper>
      <Head>
        <title></title>
      </Head>
      <Page>

        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='AddTask' iconColor='warning'>
              <CardTitle>Soft Skills</CardTitle>
            </CardLabel>

          </CardHeader>
          <CardBody isScrollable={false} className='table-responsive'>
            <div className='row g-4 '>
              {selectedButtonIndex.map((button, index: any) => (
                <><div className='col-3'>
                  {button.skill}
                </div><div className='col-9'>
                    {renderButtons1(index)}
                  </div></>

              )

              )}
            </div>
          </CardBody>

        </Card>

        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='AddTask' iconColor='warning'>
              <CardTitle>Tech Skills</CardTitle>
            </CardLabel>

          </CardHeader>
          <CardBody isScrollable={false} className='table-responsive'>
            <div className='row g-4 col-6'>
              {selectedButtonIndex1.map((button, index: any) => (
                <><div className='col-3'>
                  {button.skill}
                </div><div className='col-7'>
                    {renderButtons(index)}
                  </div></>

              )

              )}
            </div>
          </CardBody>

        </Card>

      </Page>


    </PageWrapper>
  )
}

export default Index