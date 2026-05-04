'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';

export default function SignInForm() {
    const [state, formAction, isPending] = useActionState(signInWithEmail, null);

    return (
        <div className="h-full flex items-start">
            <form action={formAction}
                className="flex flex-col gap-5 mt-32 shadow-lg rounded-md mx-auto items-center justify-center pb-4">

                <div className="w-sm">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold text-white">Sign in to your account</h1>
                </div>

                <div className='flex flex-col gap-1.5 w-[90%] border-b border-indigo-400'>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email address</label>
                    <input id="email" name="email" type="email" required placeholder="john@my-company.com"
                        className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500" />
                </div>

                <div className='flex flex-col gap-1.5 w-[90%] border-b border-indigo-400'>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
                    <input id="password" name="password" type="password" required placeholder="*****"
                        className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500" />
                </div>

                {state?.error && (
                    <div className="rounded-md px-3 py-2 text-sm text-red-500">
                        {state.error}
                    </div>
                )}

                <button type="submit" disabled={isPending}
                    className="flex justify-center rounded-md bg-emerald-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 w-[90%] mx-auto">
                    Sign in
                </button>
            </form>
        </div>
    );
}