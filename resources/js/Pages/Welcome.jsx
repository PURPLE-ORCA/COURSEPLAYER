import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ courses }) {
    return (
        <>
            <Head title="Welcome" />

            {/* Navigation Bar */}
            <nav className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-purple-800 to-black shadow-lg">
                <div>
                    <ApplicationLogo />
                </div>
                <ul className="flex gap-6 items-center text-white font-semibold">
                    <li className='flex gap-6'>
                        <Link href={route('dashboard')} className="hover:text-purple-300 transition duration-300">
                            Dashboard
                        </Link>
                        <Link href={route('login')} className="hover:text-purple-300 transition duration-300">
                            Login
                        </Link>
                        <Link href={route('register')} className="hover:text-purple-300 transition duration-300">
                            Register
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="text-center text-white min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-6xl font-bold py-6 tracking-wide">
                    Welcome to this <span className="text-purple-400">CoursePlayer</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                    Create, share, and learn from courses on any topic.
                </p>

                {/* Courses Catalog */}
                <div className="mt-12 w-full px-4">
                    <h2 className="text-4xl font-semibold text-purple-400 mb-6">
                        Explore Our Courses
                    </h2>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        {course.description}
                                    </p>
                                    {course.cover && (
                                        <img
                                            src={`/storage/${course.cover}`}
                                            alt="Course cover"
                                            className="w-full h-32 object-cover mt-4 rounded-lg"
                                        />
                                    )}
                                    <div className="mt-4">
                                        <Link
                                            href={route('courses.player', course.id)}
                                            className="text-purple-600 hover:text-purple-800"
                                        >
                                            Enrolle in course
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            No courses available yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}