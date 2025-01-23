import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ReactPlayer from 'react-player'; // Import ReactPlayer

export default function Player({ course, noChapters }) {
    const [played, setPlayed] = useState(0); // Track played progress (0 to 1)
    const [selectedChapter, setSelectedChapter] = useState(
        noChapters ? null : course.chapters[0] // Default to the first chapter if chapters exist
    );

    const handleSeek = (e) => {
        const seekTo = (e.nativeEvent.offsetX / e.target.clientWidth) * 100;
        playerRef.current.seekTo(seekTo / 100);
    };

    const handleVideoEnd = () => {
        const currentIndex = course.chapters.findIndex(
            (chapter) => chapter.id === selectedChapter.id
        );

        if (currentIndex < course.chapters.length - 1) {
            setSelectedChapter(course.chapters[currentIndex + 1]);
        } else {
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

            <main className="bg-black">
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
                                <ReactPlayer
                                    key={selectedChapter.id}
                                    url={`/storage/${selectedChapter.video}`}
                                    controls
                                    playing
                                    width="100%"
                                    height="auto"
                                    onEnded={handleVideoEnd}
                                    onProgress={({ played }) => setPlayed(played)} // Update progress
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload',
                                            },
                                        },
                                    }}
                                />
                                    
                            </div>
                        )}
                    </div>

                    {/* Right Side: Chapter List */}
                    {!noChapters && (
                        <div className="lg:w-1/4 bg-black dark:bg-black p-4 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Chapters
                            </h3>
                            <ul className="space-y-2">
                                {course.chapters.map((chapter) => (
                                    <li
                                        key={chapter.id}
                                        className={`p-2 rounded-lg cursor-pointer ${
                                            selectedChapter.id === chapter.id
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-black dark:bg-black dark:hover:bg-purple-600 text-white'
                                        }`}
                                        onClick={() => setSelectedChapter(chapter)}
                                    >
                                        {chapter.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </AuthenticatedLayout>
    );
}