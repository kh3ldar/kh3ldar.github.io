import type { AppDefinition } from './types'

/** App-wide settings and every piece of UI copy that isn't a label in metadata. */
export const app: AppDefinition = {
  appId: 'career',
  appName: 'Career Hub',
  ownerName: 'Barış Kuzu',
  ownerTitle: 'Dynamics 365 CE Developer',
  profileRoute: { pagetype: 'entityrecord', etn: 'contact', id: 'baris' },
  helpUrl: 'https://github.com/kh3ldar/kh3ldar.github.io#readme',
  idleMinutes: 15,
  contact: {
    email: 'bbariskuzu@gmail.com',
    linkedin: 'https://www.linkedin.com/in/beratbariskuzu/',
    github: 'https://github.com/kh3ldar',
    cvHref: '/cv/Baris-Kuzu-CV.pdf',
    cvFileName: 'Baris-Kuzu-CV.pdf',
    mailSubjectTemplate: '{subject}',
    mailBodyTemplate: 'Hi Barış,\n\n{description}\n\n{fullname}\n{companyname}\n{emailaddress1}',
    cardTitle: 'Lead created. Sort of.',
    cardBody:
      'This site has no backend, so your lead is stored nowhere. Pick a channel below and it becomes real. The email option opens your mail app with what you typed.',
  },
  launcher: {
    title: 'Apps',
    apps: [
      { label: 'Career Hub', description: 'You are here', icon: 'apps', href: '/', current: true },
      { label: 'ProductGrid', description: 'PCF control on GitHub', icon: 'code', href: 'https://github.com/kh3ldar/ProductGrid' },
      {
        label: 'ProductAddGrid',
        description: 'PCF control on GitHub',
        icon: 'code',
        href: 'https://github.com/kh3ldar/ProductAddGrid',
      },
      { label: 'LinkedIn', description: 'The other CV', icon: 'link', href: 'https://www.linkedin.com/in/beratbariskuzu/' },
    ],
  },
  messages: {
    linkCopied: 'Link copied.',
    linkCopyFailed: "Couldn't copy the link. It's the address in your browser bar.",
    exported: 'Exported {count} {entities}.',
    exportEmpty: 'Exported the column headers. The view has no rows.',
    requiredField: 'Required fields must be filled in.',
    invalidEmail: 'Enter a valid email address.',
    working: 'Working on it...',
    noData: 'No data available.',
    readOnlyField: 'Read-only field',
    emptyValue: '---',
    searchPlaceholder: 'Search',
    searchNoResults: 'No results. Try a skill, a project or a company.',
    filterPlaceholder: 'Filter by keyword',
    recordUnavailableTitle: 'Record is unavailable',
    recordUnavailableBody: 'The requested record was not found, or you do not have sufficient permissions to view it.',
    setDefaultView: 'Set as default view',
    defaultViewSaved: 'Default view saved, in this browser only.',
    signOutToast: "You can't sign out of a static site. You can close the tab, though.",
    emailCopied: 'Email address copied.',
  },
  session: {
    title: 'Your session is about to expire',
    body: "You've been idle for a while. Select Continue to keep reading. Nothing actually expires: this site has no session.",
    continueLabel: 'Continue',
    signOutLabel: 'Sign out',
  },
  about: {
    title: 'About Career Hub',
    lines: [
      { label: 'Version', value: '{version}' },
      { label: 'Built', value: '{buildDate}' },
      { label: 'Server version', value: 'None. It is a static site on GitHub Pages.' },
      { label: 'Made with', value: 'React 19, Fluent UI 9, Vite' },
      { label: 'Source', value: 'github.com/kh3ldar/kh3ldar.github.io' },
      { label: 'Disclaimer', value: 'A parody of a model-driven app. Not affiliated with Microsoft.' },
    ],
  },
  personalization: {
    title: 'Personalization Settings',
    themeLabel: 'Theme',
    themeOptions: { system: 'Use system setting', light: 'Light', dark: 'Dark' },
    languageLabel: 'User interface language',
    languageValue: 'English',
    languageNote: 'Only one language pack is installed in this environment.',
  },
  errorLogTemplate:
    'Unhandled exception: CareerHub.Platform.BusinessProcessException\n' +
    'Message: {message}\n' +
    'Error code: {errorCode}\n' +
    'Activity ID: {activityId}\n' +
    'Timestamp: {timestamp}\n' +
    'Location: {location}\n' +
    'Plugin: CareerHub.Plugins.Common (shipped as a plugin package, naturally)\n' +
    'Suggested action: create a Lead.\n',
}
