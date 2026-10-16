import type { SiteMapDefinition } from './types'

export const sitemap: SiteMapDefinition = {
  areas: [
    {
      id: 'career',
      label: 'Career',
      icon: 'position',
      groups: [
        {
          id: 'overview',
          label: 'Overview',
          subareas: [
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: { pagetype: 'dashboard' } },
            {
              id: 'about',
              label: 'About me',
              icon: 'contact',
              route: { pagetype: 'entityrecord', etn: 'contact', id: 'baris' },
            },
          ],
        },
        {
          id: 'experience',
          label: 'Experience',
          subareas: [
            { id: 'positions', label: 'Positions', icon: 'position', route: { pagetype: 'entitylist', etn: 'position' } },
          ],
        },
        {
          id: 'qualifications',
          label: 'Qualifications',
          subareas: [
            { id: 'skills', label: 'Skills', icon: 'skill', route: { pagetype: 'entitylist', etn: 'skill' } },
            {
              id: 'certifications',
              label: 'Certifications',
              icon: 'certification',
              route: { pagetype: 'entitylist', etn: 'certification' },
            },
            { id: 'education', label: 'Education', icon: 'education', route: { pagetype: 'entitylist', etn: 'education' } },
          ],
        },
      ],
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: 'project',
      groups: [
        {
          id: 'work',
          label: 'Work',
          subareas: [
            { id: 'projects', label: 'Projects', icon: 'project', route: { pagetype: 'entitylist', etn: 'project' } },
          ],
        },
        {
          id: 'customers',
          label: 'Customers',
          subareas: [
            { id: 'accounts', label: 'Accounts', icon: 'account', route: { pagetype: 'entitylist', etn: 'account' } },
            { id: 'contacts', label: 'Contacts', icon: 'contact', route: { pagetype: 'entitylist', etn: 'contact' } },
          ],
        },
      ],
    },
  ],
}
