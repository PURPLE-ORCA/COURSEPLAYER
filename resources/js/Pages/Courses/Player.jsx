import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Player({ course, noChapters }) {
    // State to track the selected chapter
    const [selectedChapter, setSelectedChapter] = useState(
        noChapters ? null : course.chapters[0] // Default to the first chapter if chapters exist
    );

    // Function to handle video end
    const handleVideoEnd = () => {
        // Find the index of the current chapter
        const currentIndex = course.chapters.findIndex(
            (chapter) => chapter.id === selectedChapter.id
        );

        // Check if there is a next chapter
        if (currentIndex < course.chapters.length - 1) {
            // Move to the next chapter
            setSelectedChapter(course.chapters[currentIndex + 1]);
        } else {
            // If it's the last chapter, you can add a message or reset to the first chapter
            alert('You have completed the course!');
            setSelectedChapter(course.chapters[0]); // Reset to the first chapter
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {course.title}
                </h2>
            }
        >
            <Head title={`${course.title} - Player`} />

            <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Left Side: Video Player */}
                <div className="lg:w-3/4">
                    {noChapters ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                This course has no chapters yet. Please check back later!
                            </p>
                        </div>
                    ) : (
                        <div className="bg-black rounded-lg overflow-hidden">
                            <video
                                key={selectedChapter.id} // Force re-render when the chapter changes
                                controls
                                autoPlay // Automatically play the video
                                className="w-full h-full"
                                onEnded={handleVideoEnd} // Trigger when the video ends
                            >
                                <source src={`/storage/${selectedChapter.video}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>

                {/* Right Side: Chapter List */}
                {!noChapters && (
                    <div className="lg:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Chapters
                        </h3>
                        <ul className="space-y-2">
                            {course.chapters.map((chapter) => (
                                <li
                                    key={chapter.id}
                                    className={`p-2 rounded-lg cursor-pointer ${
                                        selectedChapter.id === chapter.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    onClick={() => setSelectedChapter(chapter)} // Update the selected chapter
                                >
                                    {chapter.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}