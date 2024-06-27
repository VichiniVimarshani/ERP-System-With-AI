import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const ProjectAside = dynamic(() => import('../pages/_layout/_asides/ProjectAside'));
const HRMAside = dynamic(() => import('../pages/_layout/_asides/HrmAside'));
const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));
const DeveloperAside = dynamic(() => import('../pages/_layout/_asides/DeveloperAside'));

const asides = [
	{ path: demoPagesMenu.login.path, element: null, exact: true },
	{ path: demoPagesMenu.signUp.path, element: null, exact: true },
	{ path: pageLayoutTypesPagesMenu.blank.path, element: null, exact: true },
	{ path: '/projectmanager/*', element: <ProjectAside />, exact: true },
	{ path: '/hrm/*', element: <HRMAside />, exact: true },
	{ path: '/admin/*', element: <AdminAside/>, exact: true },
	{ path: '/developer/*', element: <DeveloperAside />, exact: true },
];

export default asides;
