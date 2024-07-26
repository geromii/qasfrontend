'use client';

import { SignIn } from '@clerk/nextjs';

import { getI18nPath } from '@/utils/Helpers';

const SignInPage = ({ params }: { params: { locale: string } }) => (
  <SignIn path={getI18nPath('/sign-in', params.locale)} />
);

export default SignInPage;
