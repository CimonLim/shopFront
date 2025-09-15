'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import toast from 'react-hot-toast';
import {UserErrorCode} from "@/app/api/common/errors/UserErrorCode.ts";
import {redirectToHome} from "@/lib/utils/redirect.ts";

const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_EMAIL_KEY = 'savedEmail';
//
// const initialValues: LoginSchema = {
//   email: 'admin@company.com',
//   password: 'AdminPass123!',
//   rememberMe: true,
// };

export default function SignInForm() {
  //TODO: why we need to reset it here
    const [reset, setReset] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<LoginSchema>({
        email: 'admin@company.com',
        password: 'AdminPass123!',
        rememberMe: true,
    });

    useEffect(() => {
        const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

        if (rememberMe && savedEmail) {
            setInitialValues({
                email: savedEmail,
                password: '',
                rememberMe: true,
            });
        }
    }, []);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
      setLoading(true);
      console.log(data);
      try {

          const result = await signIn('credentials', {
              ...data,
              redirect:false,
          });


          if (result?.error) {
              const resultCode = result?.status;
              switch (resultCode) {
                  case UserErrorCode.INVALID_PASSWORD: // INVALID_PASSWORD
                      toast.error("아이디(로그인 전화번호, 로그인 전용 아이디) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.");
                      break;
                  default:
                      toast.error("로그인 중 오류가 발생했습니다.");
              }

              setReset({
                  password: '', // 비밀번호만 리셋
              });
          }else if (result?.ok) {
              if (data.rememberMe) {
                  localStorage.setItem(REMEMBER_ME_KEY, 'true');
                  localStorage.setItem(SAVED_EMAIL_KEY, data.email);
              } else {
                  localStorage.removeItem(REMEMBER_ME_KEY);
                  localStorage.removeItem(SAVED_EMAIL_KEY);
              }

              await redirectToHome("환영합니다!",{delay:1000});
          }
      } catch (error) {
          console.error('Login error:', error);
          // ✅ 에러 시 비밀번호만 리셋
          setReset({
              password: '',
          });

          toast.error('로그인 중 오류가 발생했습니다.');
      }finally {
          setLoading(false);
      }
  }

    const handleKeyDown = (event: React.KeyboardEvent, handleSubmit: () => void) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };
    return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues
        }}
      >
        {({ register, formState: { errors }, handleSubmit }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
              onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
              onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              />
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link>
            </div>
            <Button 
              className="w-full" type="submit" size="lg"
              isLoading={isLoading} // 로딩 상태 적용
              disabled={isLoading} // 로딩 중 중복 클릭 방지
            >
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signUp1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign Up
        </Link>
      </Text>
    </>
  );
}
