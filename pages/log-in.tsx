import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR from "swr";
import { cls } from "../util";

type FormData = {
  user: string;
  password: string;
};

const Login: NextPage = () => {
  const { data } = useSWR("/api/profile");
  const [disabled, setDisabled] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw Error("아이디 / 비밀번호를 다시 확인해주세요");
      }
      Router.push("/");
    } catch (e: any) {
      setError("password", {
        message: e.message,
      });
    }
  };
  const watchAllFields = watch();

  useEffect(() => {
    const { user, password } = watchAllFields;
    setDisabled(user?.length > 0 && password?.length > 0);
  }, [watchAllFields]);

  useEffect(() => {
    if (data) {
      Router.push("/");
    }
  }, [data]);

  return (
    <div className="p-2 flex justify-center items-center min-h-screen md:bg-black md:bg-opacity-30">
      <div className="flex flex-col w-screen h-screen md:w-[28rem] md:h-[32rem] md:rounded-xl bg-white md:p-4">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 p-1 hover:bg-gray-200 rounded-full transition-colors duration-300">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path>
              </g>
            </svg>
          </div>
          <div className="w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              aria-label="트위터"
              className="fill-[rgb(29,155,240)]"
            >
              <g>
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
              </g>
            </svg>
          </div>
          <div></div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col m-6 gap-6"
        >
          <span className="font-semibold text-2xl mb-2">
            트위터에 로그인하기
          </span>
          <input
            type="text"
            autoComplete="off"
            className={cls(
              "w-full appearance-none rounded-md border-gray-300 p-2 h-12 focus:border-none focus:outline-none focus:ring-2 ",
              errors?.user ? "focus:ring-red-600" : "focus:ring-blue-400"
            )}
            placeholder="사용자 아이디"
            {...register("user", {
              minLength: {
                message: "닉네임은 6글자 이상이여야 합니다.",
                value: 6,
              },
            })}
          />
          {errors?.user && (
            <span className="font-bold text-sm -mt-4 -mb-2 text-red-600">
              {errors.user.message}
            </span>
          )}
          <input
            type="password"
            className={cls(
              "w-full appearance-none rounded-md border-gray-300 p-2 h-12 focus:border-none focus:outline-none focus:ring-2 ",
              errors?.password ? "focus:ring-red-600" : "focus:ring-blue-400"
            )}
            placeholder="비밀번호"
            {...register("password", {
              minLength: {
                message: "비밀번호는 6글자 이상이여야 합니다.",
                value: 6,
              },
            })}
          />
          {errors?.password && (
            <span className="font-bold text-sm -mt-4 -mb-2 text-red-600">
              {errors.password.message}
            </span>
          )}
          <input
            type="submit"
            className="w-full rounded-full text-white bg-black font-semibold p-2.5 mt-auto disabled:bg-neutral-400"
            value="로그인하기"
            disabled={!disabled}
          />
          <span className="text-gray-500 text-sm ">
            계정이 없으신가요?{" "}
            <Link href={`/create-account`}>
              <a className="text-blue-400">가입하기</a>
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
