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
                <h2 className="text-xl font-semibold leading-tight text-purple-400">
                    {course.title}
                </h2>
            }
        >
            <Head title={course.title} />

        <main className=' bg-black'>
            <div className="max-w-6xl mx-auto p-2">
                {/* Course Details */}
                <div className="p-6 flex gap-4 shadow-lg">
                    {course.cover && (
                        <img
                            src={`/storage/${course.cover}`}
                            alt="Course cover"
                            className="w-72 h-46 object-cover "
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {course.title} details
                        </h1>
                        <p className="text-white mt-4">
                            {course.description}
                        </p>    
                    </div>

                </div>

                {/* Chapters List */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-purple-400 mb-6">
                        Chapters
                    </h2>
                    {course.chapters && course.chapters.length > 0 ? (
                        <ul className="space-y-6">
                            {course.chapters.map((chapter) => (
                                <li key={chapter.id} className="bg-gray-800 p-6 flex gap-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">

                                    {chapter.video && (
                                        <div className="">
                                            <video controls className="w-48 rounded-lg">
                                                <source src={`/storage/${chapter.video}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-semibold text-purple-400">
                                        {chapter.title}
                                    </h3>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 mt-4">
                            No chapters available.
                        </p>
                    )}
                </div>

                {/* Add Chapter Form */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-purple-400 mb-6">
                        Add a New Chapter
                    </h2>
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg" encType="multipart/form-data">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Chapter Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Chapter Video
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setData('video', e.target.files[0])}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                accept="video/*"
                            />
                            {errors.video && (
                                <p className="text-red-500 text-sm mt-1">{errors.video}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Chapter'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Link
                        href={route('dashboard')}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>

        </AuthenticatedLayout>
    );
}