// import { useAuth } from '@clerk/nextjs';
// import Link from 'next/link';
// import { useTranslations } from 'next-intl';

// import { LogOutButton } from './LogOutButton';

// const AccountLinks = () => {
//   const t = useTranslations('AccountLinks');
//   // eslint-disable-next-line unused-imports/no-unused-vars
//   const { isSignedIn, userId } = useAuth();

//   return isSignedIn ? (
//     <>
//       <li>
//         <Link
//           href="/dashboard/user-profile/"
//           className="border-none text-gray-700 hover:text-gray-900"
//         >
//           {t('user_profile_link')}
//         </Link>
//       </li>
//       <li>
//         <LogOutButton />
//       </li>
//     </>
//   ) : (
//     <>
//       <li>
//         <Link
//           href="/sign-in/"
//           className="border-none text-gray-700 hover:text-gray-900"
//         >
//           {t('sign_in_link')}
//         </Link>
//       </li>
//       <li>
//         <Link
//           href="/sign-up/"
//           className="border-none text-gray-700 hover:text-gray-900"
//         >
//           {t('sign_up_link')}
//         </Link>
//       </li>
//     </>
//   );
// };

// export default AccountLinks;
