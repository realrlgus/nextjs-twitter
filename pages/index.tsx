import moment from "moment";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { cls } from "../util";

type FormData = {
  text: string;
};

type ListData = {
  id: number;
  createdAt: Date;
  text: string;
  writerId: number;
  writer: {
    name: string;
  };
  liked: [{ id: number }] | [];
  _count: {
    feeds: number;
    liked: number;
  };
};

export default () => {
  const { data: userData, error: userError } = useSWR("/api/profile");
  const { data: listData } = useSWR("/api/list");
  const { register, handleSubmit, watch, resetField } = useForm<FormData>();
  const [disabled, setDisabled] = useState(true);
  const init = useRef(false);
  const watchText = watch("text");
  const prefetch = () => {
    mutate(
      "/api/list",
      fetch("/api/list").then((response) => response.json())
    );
  };

  const clickLike = async (e: PointerEvent, likePostId: number) => {
    try {
      e.preventDefault();
      await fetch("/api/liked", {
        method: "POST",
        body: JSON.stringify({ likePostId, likeUserId: userData.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      prefetch();
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const newData = { ...data, writerId: userData?.id };
      await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      prefetch();
      resetField("text");
    } catch (e) {}
  };

  useEffect(() => {
    if (userError && init.current) {
      Router.push("/log-in");
    } else {
      init.current = true;
    }
  }, [userError]);

  useEffect(() => {
    setDisabled(watchText ? false : true);
  }, [watchText]);

  if (!userData && !userError) {
    return null;
  }
  return (
    <div className="min-h-screen py-4 px-6 md:w-[28rem] md:mx-auto ">
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">Home</span>
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
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-3">
        <div className="text-md">{`Welcome ${userData?.name}! `}</div>
        <input
          type="text"
          {...register("text")}
          placeholder="What's happening?"
          className={cls(
            "w-full appearance-none rounded-md border-1 border-gray-300 p-2 h-12 focus:border-none focus:outline-none focus:ring-2 ",
            userData?.user ? "focus:ring-red-600" : "focus:ring-blue-400"
          )}
        />
        <div className="text-right">
          <input
            type="submit"
            value="Tweet"
            disabled={disabled}
            className="rounded-full cursor-pointer py-1.5 bg-blue-400 px-5 text-white font-bold disabled:bg-blue-300"
          />
        </div>
      </form>
      <div className="bg-gray-200 h-[1px] mt-2 mb-6  "></div>
      {listData?.length === 0 && (
        <div className="space-y-2">
          <div className="text-2xl font-bold">Welcome to Twitter!</div>
          <div className="text-gray-500">
            This is the best place to see what’s happening in your world. Find
            some people and topics to follow now.
          </div>
        </div>
      )}
      {listData?.length > 0 &&
        listData.map((list: ListData) => (
          <Link key={list.id} href={`/tweet/${list.id}`}>
            <a className="px-2 block py-4 border-b-[1px] space-y-2">
              <div className="space-x-1.5">
                <span className="font-semibold text-lg">
                  {list.writer.name}
                </span>
                <span>·</span>
                <span className="text-gray-400">
                  {moment(list.createdAt).fromNow()}
                </span>
              </div>
              <div>{list.text}</div>
              <div className="flex flex-row cursor-pointer items-center gap-10">
                <div className="flex items-center gap-2 text-gray-500 fill-gray-500 hover:text-sky-300 hover:fill-sky-300 transition-colors">
                  <div className="w-6">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g>
                        <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                      </g>
                    </svg>
                  </div>
                  <div>{list._count.feeds}</div>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer text-gray-500 fill-gray-500  hover:text-rose-500 hover:fill-rose-500 transition-colors"
                  onClick={(e) => clickLike(e, list.id)}
                >
                  <div className="w-6">
                    {list.liked.length === 0 ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                        </g>
                      </svg>
                    ) : (
                      <svg
                        className="fill-rose-500"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <g>
                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
                        </g>
                      </svg>
                    )}
                  </div>
                  <div className={list.liked.length > 0 ? "text-rose-500" : ""}>
                    {list._count.liked}
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
    </div>
  );
};
