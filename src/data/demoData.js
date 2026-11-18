/*
 * ContactVault demo dataset — 21 fictional contacts.
 * Completely distinct people from any other address-book project;
 * categories (students, teachers, developers, designers, family,
 * friends, clients) are expressed through roles and tags only.
 * Dates are generated relative to "now" at seed time.
 */

import { stampDaysAgo } from '../utils/date.js';

const note = (index, text, daysAgo, now) => ({
  id: `dv-${index}`,
  text,
  createdAt: stampDaysAgo(daysAgo, now),
});

function contactsData(now) {
  return [
    {
      id: 'cv-01', firstName: 'Aditi', lastName: 'Raman',
      phone: '+91 98401 22334', altPhone: '',
      email: 'aditi.raman@example.com', company: 'Chennai Institute of Technology', jobTitle: 'Software Student',
      address: '12, 2nd Cross Street', city: 'Adyar', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '2003-02-14',
      tags: ['College', 'Important'], favorite: true,
      notes: [note('n1', 'Met during the campus placement workshop.', 20, now)],
      photo: '', createdAt: stampDaysAgo(5, now), updatedAt: stampDaysAgo(2, now),
    },
    {
      id: 'cv-02', firstName: 'Bharath', lastName: 'Iyer',
      phone: '+91 94441 87210', altPhone: '',
      email: 'bharath.iyer@example.com', company: 'Crescent Public School', jobTitle: 'Physics Teacher',
      address: '45, Lake View Road', city: 'T. Nagar', state: 'Tamil Nadu', country: 'India',
      website: 'bharathiyer.example.com', birthday: '1978-10-02',
      tags: ['College', 'Mentor'], favorite: true,
      notes: [note('n2', 'Wrote my first recommendation letter.', 60, now)],
      photo: '', createdAt: stampDaysAgo(80, now), updatedAt: stampDaysAgo(10, now),
    },
    {
      id: 'cv-03', firstName: 'Charu', lastName: 'Devi',
      phone: '+91 93827 11045', altPhone: '',
      email: '', company: '', jobTitle: 'Homemaker',
      address: '3, temple street', city: 'Mylapore', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1969-06-21',
      tags: ['Family'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(200, now), updatedAt: stampDaysAgo(40, now),
    },
    {
      id: 'cv-04', firstName: 'Deepak', lastName: 'Sundar',
      phone: '+91 90035 76120', altPhone: '+91 90035 76121',
      email: 'deepak.sundar@example.com', company: 'Marina Softworks', jobTitle: 'iOS Developer',
      address: '88, rajalakshmi nagar', city: 'Velachery', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '',
      tags: ['Work', 'Friend'], favorite: true,
      notes: [note('n3', 'Reviewing the app-store checklist together.', 9, now)],
      photo: '', createdAt: stampDaysAgo(30, now), updatedAt: stampDaysAgo(1, now),
    },
    {
      id: 'cv-05', firstName: 'Eshwar', lastName: 'Krishnan',
      phone: '+91 98410 55230', altPhone: '',
      email: 'eshwar@kaverifoods.example.com', company: 'Kaveri Foods', jobTitle: 'Business Owner',
      address: '5, industrial estate', city: 'Guindy', state: 'Tamil Nadu', country: 'India',
      website: 'kaverifoods.example.com', birthday: '1975-04-11',
      tags: ['Client', 'VIP'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(60, now), updatedAt: stampDaysAgo(20, now),
    },
    {
      id: 'cv-06', firstName: 'Fathima', lastName: 'Noor',
      phone: '+91 96770 34512', altPhone: '',
      email: 'fathima.noor@example.com', company: 'Inkwell Studio', jobTitle: 'Illustrator',
      address: '21, beach avenue', city: 'Besant Nagar', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1996-09-30',
      tags: ['Design'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(12, now), updatedAt: stampDaysAgo(12, now),
    },
    {
      id: 'cv-07', firstName: 'Gopal', lastName: 'Menon',
      phone: '+91 94452 61078', altPhone: '',
      email: 'gopal.menon@example.com', company: '', jobTitle: 'Retired Banker',
      address: '17, 12th main road', city: 'Anna Nagar', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1958-01-30',
      tags: ['Family'], favorite: false,
      notes: [note('n4', 'Calls every Sunday morning without fail.', 90, now)],
      photo: '', createdAt: stampDaysAgo(250, now), updatedAt: stampDaysAgo(30, now),
    },
    {
      id: 'cv-08', firstName: 'Harini', lastName: 'Balaji',
      phone: '+91 98847 90123', altPhone: '',
      email: 'harini.balaji@example.com', company: 'Brightframe', jobTitle: 'HR Manager',
      address: '62, Gnite Avenue', city: 'Nungambakkam', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1994-11-18',
      tags: ['Friend', 'Work'], favorite: true,
      notes: [], photo: '', createdAt: stampDaysAgo(45, now), updatedAt: stampDaysAgo(8, now),
    },
    {
      id: 'cv-09', firstName: 'Ishaan', lastName: 'Verma',
      phone: '+91 99201 45678', altPhone: '',
      email: 'ishaan.verma@example.com', company: 'Cloudline Systems', jobTitle: 'Frontend Developer',
      address: '9, baner road', city: 'Pune', state: 'Maharashtra', country: 'India',
      website: 'ishaanverma.example.com', birthday: '1997-07-08',
      tags: ['Work'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(3, now), updatedAt: stampDaysAgo(3, now),
    },
    {
      id: 'cv-10', firstName: 'Jaya', lastName: 'Lakshmi',
      phone: '+91 93810 27456', altPhone: '',
      email: 'jaya.lakshmi@example.com', company: 'Sunshine Academy', jobTitle: 'School Principal',
      address: '4, mount puspagiri street', city: 'Porur', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1965-03-09',
      tags: ['Family'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(210, now), updatedAt: stampDaysAgo(25, now),
    },
    {
      id: 'cv-11', firstName: 'Karthik', lastName: 'Subramanian',
      phone: '+91 91762 88090', altPhone: '',
      email: 'karthik@sterlingretail.example.com', company: 'Sterling Retail', jobTitle: 'Sales Director',
      address: '301, mount road', city: 'Chennai', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '',
      tags: ['Client'], favorite: false,
      notes: [note('n5', 'Prefers email over calls in the morning.', 30, now)],
      photo: '', createdAt: stampDaysAgo(90, now), updatedAt: stampDaysAgo(14, now),
    },
    {
      id: 'cv-12', firstName: 'Lakshmi', lastName: 'Narayanan',
      phone: '+91 94448 33671', altPhone: '',
      email: 'lakshmi.n@example.com', company: 'Vidya Mandir', jobTitle: 'Chemistry Teacher',
      address: '18, 4th cross street', city: 'Saidapet', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1972-12-25',
      tags: ['College'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(150, now), updatedAt: stampDaysAgo(50, now),
    },
    {
      id: 'cv-13', firstName: 'Meenakshi', lastName: 'Rao',
      phone: '+91 98450 67321', altPhone: '',
      email: 'meenakshi.rao@example.com', company: 'Golden Hour Studio', jobTitle: 'Brand Designer',
      address: '27, indira nagar', city: 'Bengaluru', state: 'Karnataka', country: 'India',
      website: 'goldenhour.example.com', birthday: '1992-08-05',
      tags: ['Design', 'Friend'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(20, now), updatedAt: stampDaysAgo(6, now),
    },
    {
      id: 'cv-14', firstName: 'Naveen', lastName: 'Chandra',
      phone: '+91 96001 73485', altPhone: '',
      email: 'naveen.chandra@example.com', company: 'Iron Yard Gym', jobTitle: 'Fitness Trainer',
      address: '7, 1st avenue', city: 'Adyar', state: 'Tamil Nadu', country: 'India',
      website: '', birthday: '1990-04-22',
      tags: ['Friend'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(70, now), updatedAt: stampDaysAgo(35, now),
    },
    {
      id: 'cv-15', firstName: 'Olivia', lastName: 'Fernandes',
      phone: '+91 88882 41067', altPhone: '',
      email: 'olivia@casafiesta.example.com', company: 'Casa Fiesta', jobTitle: 'Guest House Owner',
      address: '31, fontainhas lane', city: 'Panjim', state: 'Goa', country: 'India',
      website: 'casafiesta.example.com', birthday: '',
      tags: ['Client'], favorite: false,
      notes: [], photo: '', createdAt: stampDaysAgo(100, now), updatedAt: stampDaysAgo(45, now),
    },
  ];
}

export function buildDemoContacts(now = new Date()) {
  return contactsData(now);
}