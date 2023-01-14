import { XCircleIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast, Toast, Toaster } from "react-hot-toast";

import Logo from "./logo";

type FormValues = {
  username: string;
  email: string;
  password: string;
  apiError: string;
};

export default function Signup() {
  const methods = useForm<FormValues>({});
  const {
    register,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  const handleErrors = async (resp: Response) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
  };

  const signUp: SubmitHandler<FormValues> = async (data) => {
    const res = await toast
      .promise(
        fetch("/api/auth/signup", {
          body: JSON.stringify({
            ...data,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then(handleErrors)
          .then(async () => {
            await signIn<"credentials">("credentials", {
              ...data,
              callbackUrl: "https://app.documenso.com/dashboard",
            });
          }),
        {
          loading: "Creating your account...",
          success: "Done!",
          error: (err) => err.message,
        },
        {
          style: {
            minWidth: "200px",
          },
        }
      )
      .catch((err) => {
        toast.dismiss();
        methods.setError("apiError", { message: err.message });
      });
  };

  function renderApiError() {
    if (!errors.apiError) return;
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {errors.apiError && <div>{errors.apiError?.message}</div>}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  function renderFormValidation() {
    if (!errors.password && !errors.email) return;
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {errors.password && <div>{errors.password?.message}</div>}
            </h3>
            <h3 className="text-sm font-medium text-red-800">
              {errors.email && <div>{errors.email?.message}</div>}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create a shiny, new <br></br>Documenso Account{" "}
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="rgb(17 24 39 / var(--tw-text-opacity))"
                className="w-8 h-8 inline mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create your account and start using<br></br>
              state-of-the-art document signing for free.
            </p>
          </div>
          {renderApiError()}
          {renderFormValidation()}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(signUp)}
              onChange={() => {
                methods.clearErrors();
                trigger();
              }}
              className="mt-8 space-y-6"
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neon focus:outline-none focus:ring-neon sm:text-sm"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    {...register("password", {
                      minLength: {
                        value: 7,
                        message:
                          "Your password has to be at least 7 characters long.",
                      },
                    })}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neon focus:outline-none focus:ring-neon sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  methods.clearErrors();
                }}
                type="submit"
                value="submit"
                className="sgroup relative flex w-full justify-center rounded-md border border-transparent bg-neon py-2 px-4 text-sm font-medium text-white hover:bg-neon-dark focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                Create Account
              </button>
              <div className="pt-2">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center"></div>
                </div>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-neon hover:text-neon"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
      {/* <Toaster position="top-center"></Toaster> */}
    </>
  );
}
