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

const Index: NextPage = () => {

  const { darkModeStatus } = useDarkMode();
  const [project, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [ststus, setStatus] = useState<boolean>(true)


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
          console.log(user)

        } catch (error: any) {
          console.error("Error fetching current user:", error.message);

        }
      }

    };

    fetchData(); // Call the async function
  }, [])

  //get all project 



  const onhandlechange = (index: any) => {
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <PageWrapper>
      <Head>
        <title></title>
      </Head>
      <SubHeader>

        <SubHeaderRight>


          <SubheaderSeparator />
          {/* Button to open new employee modal */}

        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div>
          {
            user.map((improve: any) => (
              <div>
                <iframe
                  className='mt-5'
                  title="Embedded HTML Content"
                  width="100%"
                  height="500"
                  srcDoc={improve}
                  frameBorder="0"
                  allowFullScreen
                />
                <hr />
              </div>
            ))
          }
        </div>
      </Page>


    </PageWrapper>
  )
}

export default Index