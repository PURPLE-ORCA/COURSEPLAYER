import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {

    return (
        <>
            <Head title="Welcome" />

            {/* Navigation Bar */}
            <nav className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-purple-800 to-black shadow-lg">
                <div>
                    <ApplicationLogo />
                </div>
                <ul className="flex gap-6 items-center text-white font-semibold">
                    <li>
                        <Link href={route('login')} className="hover:text-purple-300 transition duration-300">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="text-center text-white min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-6xl font-bold py-6 tracking-wide">
                    Welcome to this<span className="text-purple-400">CoursePlayer</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                    Create, share, and learn from courses on any topic.
                </p>

                {/* Buttons */}
                <div className="flex gap-6 mt-8">
                    <Link
                        href={route('login')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        href={route('register')}
                        className="px-6 py-3 bg-purple-800 hover:bg-purple-900 text-white rounded-lg shadow-md transition duration-300"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </>
    );
}
