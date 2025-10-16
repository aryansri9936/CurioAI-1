
import React from 'react';

export const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </Icon>
);

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </Icon>
);

export const DocumentPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </Icon>
);

export const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </Icon>
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </Icon>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-6 h-6">
        <path d="M3 3v18h18"></path>
        <path d="M9 18v-6"></path>
        <path d="M13 18V4"></path>
        <path d="M17 18v-8"></path>
    </Icon>
);

export const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-6 h-6">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.5 5.162a1 1 0 0 0-1 0L2.597 9.084a1 1 0 0 0 0 1.838l8.903 3.916a1 1 0 0 0 .998 0l8.922-3.916z"></path>
        <path d="M3 10.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.5"></path>
        <path d="M22 10.5v6.5a2 2 0 0 1-2 2"></path>
    </Icon>
);

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </Icon>
);

export const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </Icon>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </Icon>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </Icon>
);

export const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="h-5 w-5">
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"></path>
    </Icon>
);
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} >
        <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
        <circle cx="12" cy="10" r="3" />
        <circle cx="12" cy="12" r="10" />
    </Icon>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
      <path d="m12 3-1.9 1.9-1.9-1.9-1.9 1.9L4.4 3 3 4.4l1.9 1.9-1.9 1.9 1.9 1.9L3 12l1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9L12 15.6l1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9-1.9-1.9 1.9-1.9-1.9-1.9-1.9-1.9zm0 0L10.1 4.9l-1.9 1.9 1.9 1.9L8.2 12l1.9 1.9-1.9 1.9 1.9 1.9 1.9 1.9 1.9-1.9 1.9-1.9-1.9-1.9 1.9-1.9 1.9-1.9-1.9-1.9-1.9-1.9z" />
    </Icon>
);

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </Icon>
);

export const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M4.5 3h15" />
        <path d="M6 3v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
        <path d="M6 14h12" />
    </Icon>
);

export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} className="w-5 h-5">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.5 9.5H11v1h-1.5v-1zM13 9.5h1.5v1H13v-1zm-3.5 3H11v1h-1.5v-1zm3.5 0h1.5v1H13v-1z" />
    </Icon>
);
