import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ course }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Course Details
                </h2>
            }
        >
            <Head title={course.title} />

            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    {course.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                    {course.description}
                </p>
                {course.cover && (
                    <img
                        src={`/storage/${course.cover}`}
                        alt="Course cover"
                        className="w-full h-64 object-cover mt-6 rounded-lg"
                    />
                )}

                {/* Optional: Add a back button */}
                <div className="mt-6">
                    <Link
                        href={route('dashboard')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}