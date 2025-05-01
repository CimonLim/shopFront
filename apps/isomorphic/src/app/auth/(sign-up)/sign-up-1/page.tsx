import Image from 'next/image';
import UnderlineShape from '@core/components/shape/underline';
import SignUpForm from './sign-up-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('회원가입'),
};

export default function SignUp() {
    return (
        <AuthWrapperOne
            title={
                <>
                    지금 바로 가입하고 혜택을 놓치지 마세요 -{' '}
                    <span className="relative inline-block">
            회원가입!
            <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-28 text-blue xl:-bottom-1.5 xl:w-36" />
          </span>
                </>
            }
            description="회원가입을 통해 독점 콘텐츠, 특별 혜택을 받아보세요. 또한 새로운 소식과 업데이트 소식을 가장 먼저 받아보실 수 있습니다."
            bannerTitle="워크스페이스 관리를 가장 간단하게"
            bannerDescription="최고의 서비스를 제공하기 위해 끊임없이 노력하고 있습니다."
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
            <SignUpForm />
        </AuthWrapperOne>
    );
}
