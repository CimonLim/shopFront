'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Checkbox, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { SignUpSchema, signUpSchema } from '@/validators/signup.schema';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAgreed: false,
};

export default function SignUpForm() {
    const [reset, setReset] = useState({});

    const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
        console.log(data);
        setReset({ ...initialValues, isAgreed: false });
    };

    return (
        <>
            <Form<SignUpSchema>
                validationSchema={signUpSchema}
                resetValues={reset}
                onSubmit={onSubmit}
                useFormProps={{
                    defaultValues: initialValues,
                }}
            >
                {({ register, formState: { errors } }) => (
                    <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
                        <Input
                            type="text"
                            size="lg"
                            label="이름"
                            placeholder="이름을 입력하세요"
                            className="[&>label>span]:font-medium"
                            inputClassName="text-sm"
                            {...register('firstName')}
                            error={errors.firstName?.message}
                        />
                        {/*<Input*/}
                        {/*  type="text"*/}
                        {/*  size="lg"*/}
                        {/*  label="성"*/}
                        {/*  placeholder="성을 입력하세요"*/}
                        {/*  className="[&>label>span]:font-medium"*/}
                        {/*  inputClassName="text-sm"*/}
                        {/*  {...register('lastName')}*/}
                        {/*  error={errors.lastName?.message}*/}
                        {/*/>*/}
                        <Input
                            type="email"
                            size="lg"
                            label="이메일"
                            className="col-span-2 [&>label>span]:font-medium"
                            inputClassName="text-sm"
                            placeholder="이메일을 입력하세요"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <Password
                            label="비밀번호"
                            placeholder="비밀번호를 입력하세요"
                            size="lg"
                            className="[&>label>span]:font-medium"
                            inputClassName="text-sm"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                        <Password
                            label="비밀번호 확인"
                            placeholder="비밀번호를 다시 입력하세요"
                            size="lg"
                            className="[&>label>span]:font-medium"
                            inputClassName="text-sm"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />
                        <div className="col-span-2 flex items-start">
                            <Checkbox
                                {...register('isAgreed')}
                                className="[&>label>span]:font-medium [&>label]:items-start"
                                label={
                                    <>
                                        가입 시{' '}
                                        <Link
                                            href="/"
                                            className="font-medium text-blue transition-colors hover:underline"
                                        >
                                            이용약관
                                        </Link>{' '}
                                        및{' '}
                                        <Link
                                            href="/"
                                            className="font-medium text-blue transition-colors hover:underline"
                                        >
                                            개인정보처리방침
                                        </Link>
                                        에 동의하게 됩니다
                                    </>
                                }
                            />
                        </div>
                        <Button size="lg" type="submit" className="col-span-2 mt-2">
                            <span>시작하기</span>{' '}
                            <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                        </Button>
                    </div>
                )}
            </Form>
            <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
                이미 계정이 있으신가요?{' '}
                <Link
                    href={routes.auth.signIn1}
                    className="font-semibold text-gray-700 transition-colors hover:text-blue"
                >
                    로그인
                </Link>
            </Text>
        </>
    );
}