import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const courses = usePage().props.courses;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        cover: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.cover) {
            formData.append('cover', data.cover);
        }
        post(route('courses.store'), formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setData({ title: '', description: '', cover: null });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <main className="py-12 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-purple-400 mb-4">Welcome back, {user.name}!</h1>
                    <p className="text-gray-400 text-lg">Manage your courses and create new ones.</p>
                </div>

                {/* Add Course Button */}
                <div className="flex justify-center mb-12">
                    <button
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Create New Course
                    </button>
                </div>

                {/* Courses Grid */}
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-purple-400 mb-8">Your Courses</h2>
                    {courses.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {courses.map((course) => (
                                <Link
                                    href={route('courses.show', course.id)}
                                    key={course.id}
                                    className="flex relative p-2 bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                                >
                                    {course.cover && (
                                        <img
                                            src={`/storage/${course.cover}`}
                                            alt="Course cover"
                                            className="w-64 h-24 sm:w-96 sm:h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                                        <p className="text-white text-xl">{course.description}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity"></div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center">You haven't created any courses yet.</p>
                    )}
                </div>

                {/* Add Course Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-purple-400 mb-6">Create a New Course</h2>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                            rows="3"
                                        ></textarea>
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('cover', e.target.files[0])}
                                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                            accept="image/*"
                                        />
                                        {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2 text-gray-400 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AuthenticatedLayout>
    );
}