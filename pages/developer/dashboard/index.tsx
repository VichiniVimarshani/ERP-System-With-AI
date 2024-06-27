import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTour } from '@reactour/tour';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import ThemeContext from '../../../context/themeContext';
import useDarkMode from '../../../hooks/useDarkMode';
import { TABS, TTabs } from '../../../common/type/helper';
import Page from '../../../layout/Page/Page';
import Task from './tasks'
import Profile from '../../../components/Profile'
import router from 'next/router';

const Index: NextPage = () => {
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
    
  return (
    <PageWrapper>
    <Head>
      <title>{demoPagesMenu.sales.subMenu.dashboard.text}</title>
    </Head>

    <Page container='fluid'>
      <div className='row'>
        <div className='col-xxl-12'>
       <Profile/>
        </div>
        <div className='col-xxl-12'>
        <Task/>
        </div>
        <div className='col-xxl-12'>
          
        </div>
      </div>

    </Page>

  </PageWrapper>
  )
}

export default Index