import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const courses = usePage().props.courses; // Get the courses from the backend
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        cover: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData object for file upload
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.cover) {
            formData.append('cover', data.cover);
        }

        post(route('courses.store'), formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                // Reset form
                setData({
                    title: '',
                    description: '',
                    cover: null,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <main className="py-6 text-center">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Welcome back, {user.name}!
                </h1>

                <div className="mt-6">
                    <button 
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add a new course
                    </button>
                </div>

                {/* Display Courses */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Your Courses
                    </h2>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Link  href={route('courses.show', course.id)} key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            You haven't created any courses yet.
                        </p>
                    )}
                </div>

                {/* Modal for Adding a New Course */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Add a New Course
                            </h2>

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        rows="3"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                                        Cover Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={e => setData('cover', e.target.files[0])}
                                        className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        accept="image/*"
                                    />
                                    {errors.cover && (
                                        <p className="text-red-500 text-sm mt-1">{errors.cover}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </AuthenticatedLayout>
    );
}