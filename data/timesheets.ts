export interface Timesheet {
  id: number;
  week: number;
  dateRange: string;
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING' | 'PENDING' | 'APPROVED';
  action: 'View' | 'Update' | 'Create';
  description: string;
  hours: number;
  project: string;
}

export const initialTimesheets: Timesheet[] = [
  {
    id: 1,
    week: 1,
    dateRange: '1 - 5 January, 2024',
    status: 'COMPLETED',
    action: 'View',
    description: 'Design Homepage',
    hours: 12,
    project: 'Web App',
  },
  {
    id: 2,
    week: 2,
    dateRange: '8 - 12 January, 2024',
    status: 'COMPLETED',
    action: 'View',
    description: 'Develop Login Feature',
    hours: 15,
    project: 'Web App',
  },
  {
    id: 3,
    week: 3,
    dateRange: '15 - 19 January, 2024',
    status: 'INCOMPLETE',
    action: 'Update',
    description: 'API Integration',
    hours: 10,
    project: 'Web App',
  },
  {
    id: 4,
    week: 4,
    dateRange: '22 - 26 January, 2024',
    status: 'COMPLETED',
    action: 'View',
    description: 'UI Testing',
    hours: 8,
    project: 'Web App',
  },
  {
    id: 5,
    week: 5,
    dateRange: '29 January - 1 February, 2024',
    status: 'MISSING',
    action: 'Create',
    description: 'Deploy to Server',
    hours: 6,
    project: 'Web App',
  },
];
