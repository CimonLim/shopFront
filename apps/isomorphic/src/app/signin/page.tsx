import Image from 'next/image';
import SignInForm from './sign-in-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Sign In'),
};

export default function SignIn() {
    return (
        <AuthWrapperOne
            title={
                <>
                    다시 오신 것을 환영합니다!{' '}
                    <span className="relative inline-block">
            로그인
            <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
          </span>{' '}
                    해주세요.
                </>
            }
            description="가입하시면 독점 콘텐츠와 특별 혜택을 받으실 수 있으며,
      새로운 소식과 업데이트 소식을 가장 먼저 받아보실 수 있습니다."
            bannerTitle="워크스페이스를 관리하는 가장 간단한 방법"
            bannerDescription="더 나은 업무 환경을 위한 최적의 솔루션을 제공합니다."
            isSocialLoginActive={true}
            pageImage={
                <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
                    <Image
                        src={
                            'https://isomorphic-furyroad.s3.amazonaws.com/public/auth/sign-up.webp'
                        }
                        alt="회원가입 썸네일"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover"
                    />
                </div>
            }
        >
            <SignInForm />
        </AuthWrapperOne>
    );
}
