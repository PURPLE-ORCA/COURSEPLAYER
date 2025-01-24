import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ course }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for modal

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        title: course.title,
        description: course.description,
        cover: null,
    });
    
    const handleEditSubmit = (e) => {
        e.preventDefault();
    
        // Prepare the data to send
        const payload = {
            title: editData.title,
            description: editData.description,
            cover: editData.cover, // This will be null or a file object
        };
    
        console.log('Payload:', payload); // Debugging
    
        // Send the request
        put(route('courses.update', course.id), payload, {
            onSuccess: () => {
                console.log('Course updated successfully'); // Debugging
                closeEditModal(); // Close the modal after successful submission
            },
            onError: (errors) => {
                console.log('Edit Course Errors:', errors); // Debugging
            },
        });
    };

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
                        <div>
                            <button
                                onClick={openEditModal} // We'll define this function next
                                className="text-purple-400 hover:text-purple-600 transition"
                            >
                                <i className='bx bxs-edit-alt'></i> {/* Edit icon */}
                            </button>
                        </div>
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
        
        {isEditModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">
                Edit Course: {course.title}
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Title
                    </label>
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData('title', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                    {editErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Description
                    </label>
                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData('description', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                    {editErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Cover Image
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setEditData('cover', e.target.files[0])}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                        accept="image/*"
                    />
                    {editErrors.cover && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.cover}</p>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={editProcessing}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {editProcessing ? 'Updating...' : 'Update Course'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

        </AuthenticatedLayout>
    );
}