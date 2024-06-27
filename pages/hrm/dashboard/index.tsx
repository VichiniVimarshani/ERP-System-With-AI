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
import CommonDashboardRecentActivities from '../../../common/partial/CommonDashboardRecentActivities';
import CommonDashboardUserCard from '../../../common/partial/CommonDashboardUserCard';
import CommonDashboardMarketingTeam from '../../../common/partial/CommonDashboardMarketingTeam';
import CommonDashboardDesignTeam from '../../../common/partial/CommonDashboardDesignTeam';
import CommonDashboardIncome from '../../../common/partial/CommonDashboardIncome';
import CommonDashboardUserIssue from '../../../common/partial/CommonDashboardUserIssue';
import CommonDashboardSalesByStore from '../../../common/partial/CommonDashboardSalesByStore';
import CommonDashboardWaitingAnswer from '../../../common/partial/CommonDashboardWaitingAnswer';
//import CommonDashboardTopSeller from '../../../common/partial/CommonDashboardTopSeller';
import CommonMyWallet from '../../../common/partial/CommonMyWallet';

import Employee from './employee'
import Chart from './chart'
import Profile from '../../../components/Profile';
import router from 'next/router';

const Index: NextPage = () => {
	const { mobileDesign } = useContext(ThemeContext);
	const { setIsOpen } = useTour();

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
		if (
			typeof window !== 'undefined' &&
			localStorage.getItem('tourModalStarted') !== 'shown' &&
			!mobileDesign
		) {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('tourModalStarted', 'shown');
			}, 3000);
		}
		return () => { };
	}, []);

	const { themeStatus } = useDarkMode();

	const [activeTab, setActiveTab] = useState<TTabs>(TABS.YEARLY);

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
					<div className='col-xxl-9'>
						<Employee />
					</div><div className='col-xxl-3'>
						<CommonDashboardRecentActivities />
					</div><div className='col-xxl-12'>
						
					</div>
				</div>

			</Page>

			{/* <Page>					
					<div className='w-75 h-100' >
						<CommonDashboardRecentActivities />
					</div>
			</Page> */}
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Index;
