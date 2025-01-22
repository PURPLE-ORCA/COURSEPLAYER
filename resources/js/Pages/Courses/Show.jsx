import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ course }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        video: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.video) {
            formData.append('video', data.video);
        }

        post(route('courses.chapters.store', course.id), formData, {
            onSuccess: () => {
                setData({
                    title: '',
                    video: null,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {course.title}
                </h2>
            }
        >
            <Head title={course.title} />

            <div className="max-w-4xl mx-auto p-6">
                {/* Course Details */}
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

                {/* Chapters List */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Chapters
                    </h2>
                    {course.chapters && course.chapters.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {course.chapters.map((chapter) => (
                                <li key={chapter.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {chapter.title}
                                    </h3>
                                    {chapter.video && (
                                        <div className="mt-4">
                                            <video controls className="w-full rounded-lg">
                                                <source src={`/storage/${chapter.video}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            No chapters available.
                        </p>
                    )}
                </div>

                {/* Add Chapter Form */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Add a New Chapter
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-4" encType="multipart/form-data">
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300">
                                Chapter Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm text-gray-700 dark:text-gray-300">
                                Chapter Video
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setData('video', e.target.files[0])}
                                className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                accept="video/*"
                            />
                            {errors.video && (
                                <p className="text-red-500 text-sm mt-1">{errors.video}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Chapter'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back Button */}
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