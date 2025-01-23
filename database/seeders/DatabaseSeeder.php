<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Seed Categories
        $categories = [
            ['name' => 'Web Development'],
            ['name' => 'Mobile Development'],
            ['name' => 'Data Science'],
            ['name' => 'Programming Languages'],
            ['name' => 'DevOps'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Seed Tags
        $tags = [
            ['name' => 'PHP'],
            ['name' => 'Laravel'],
            ['name' => 'JavaScript'],
            ['name' => 'React'],
            ['name' => 'Node.js'],
            ['name' => 'Python'],
            ['name' => 'Database'],
            ['name' => 'API'],
            ['name' => 'Frontend'],
            ['name' => 'Backend'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }

        // Create multiple users
        $user1 = User::create([
            'name' => 'Test User 1',
            'email' => 'test1@example.com',
            'password' => Hash::make('password'), // Use a secure password
        ]);

        $user2 = User::create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => Hash::make('password'), // Use a secure password
        ]);

        $user3 = User::create([
            'name' => 'Test User 3',
            'email' => 'test3@example.com',
            'password' => Hash::make('password'), // Use a secure password
        ]);

        // Create multiple courses
        $course1 = Course::create([
            'title' => 'Introduction to Laravel',
            'description' => 'Learn the basics of Laravel, a powerful PHP framework.',
            'cover' => 'covers/COURSEPLAYER cover 1.png', // Use the same cover for all courses
            'user_id' => $user1->id,
        ]);

        $course2 = Course::create([
            'title' => 'Advanced Laravel Techniques',
            'description' => 'Learn advanced techniques in Laravel.',
            'cover' => 'covers/COURSEPLAYER cover.png', // Use the same cover for all courses
            'user_id' => $user1->id,
        ]);

        $course3 = Course::create([
            'title' => 'React for Beginners',
            'description' => 'Get started with React, a popular JavaScript library.',
            'cover' => 'covers/COURSEPLAYER cover 2.png', // Use the same cover for all courses
            'user_id' => $user2->id,
        ]);

        $course4 = Course::create([
            'title' => 'Node.js Mastery',
            'description' => 'Master Node.js and build scalable applications.',
            'cover' => 'covers/COURSEPLAYER cover.png', // Use the same cover for all courses
            'user_id' => $user3->id,
        ]);

        // Helper function to toggle between the two video files
        $getVideoPath = function ($index) {
            return $index % 2 === 0
                ? 'chapters_videos/COURSEPLAYER VID.mp4'
                : 'chapters_videos/COURSEPLAYER VID 1.mp4';
        };

        // Create chapters for Course 1: Introduction to Laravel
        Chapter::create([
            'title' => 'Chapter 1: Getting Started',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course1->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 2: Routing in Laravel',
            'video' => $getVideoPath(1), // COURSEPLAYER VID 1.mp4
            'course_id' => $course1->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 3: Database Migrations',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course1->id,
        ]);

        // Create chapters for Course 2: Advanced Laravel Techniques
        Chapter::create([
            'title' => 'Chapter 1: Advanced Eloquent',
            'video' => $getVideoPath(1), // COURSEPLAYER VID 1.mp4
            'course_id' => $course2->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 2: API Development',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course2->id,
        ]);

        // Create chapters for Course 3: React for Beginners
        Chapter::create([
            'title' => 'Chapter 1: Introduction to React',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course3->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 2: Components and Props',
            'video' => $getVideoPath(1), // COURSEPLAYER VID 1.mp4
            'course_id' => $course3->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 3: State and Lifecycle',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course3->id,
        ]);

        // Create chapters for Course 4: Node.js Mastery
        Chapter::create([
            'title' => 'Chapter 1: Introduction to Node.js',
            'video' => $getVideoPath(1), // COURSEPLAYER VID 1.mp4
            'course_id' => $course4->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 2: Building REST APIs',
            'video' => $getVideoPath(0), // COURSEPLAYER VID.mp4
            'course_id' => $course4->id,
        ]);

        Chapter::create([
            'title' => 'Chapter 3: Working with Databases',
            'video' => $getVideoPath(1), // COURSEPLAYER VID 1.mp4
            'course_id' => $course4->id,
        ]);

        // Add a course with no chapters (edge case)
        $course5 = Course::create([
            'title' => 'Empty Course',
            'description' => 'This course has no chapters.',
            'cover' => 'covers/COURSEPLAYER cover.png', // Use the same cover
            'user_id' => $user1->id,
        ]);

        // Add a course with many chapters (edge case)
        $course6 = Course::create([
            'title' => 'Course with Many Chapters',
            'description' => 'This course has many chapters to test scrolling or pagination.',
            'cover' => 'covers/COURSEPLAYER cover.png', // Use the same cover
            'user_id' => $user2->id,
        ]);

        for ($i = 1; $i <= 10; $i++) {
            Chapter::create([
                'title' => "Chapter $i: Topic $i",
                'video' => $getVideoPath($i), // Toggle between the two videos
                'course_id' => $course6->id,
            ]);
        }

        // Associate categories and tags with courses
        $categories = Category::all();
        $tags = Tag::all();

        $course1->categories()->attach($categories->whereIn('name', ['Web Development', 'Programming Languages'])->pluck('id'));
        $course1->tags()->attach($tags->whereIn('name', ['PHP', 'Laravel'])->pluck('id'));

        $course2->categories()->attach($categories->whereIn('name', ['Web Development', 'DevOps'])->pluck('id'));
        $course2->tags()->attach($tags->whereIn('name', ['PHP', 'Laravel', 'API'])->pluck('id'));

        $course3->categories()->attach($categories->whereIn('name', ['Web Development', 'Frontend'])->pluck('id'));
        $course3->tags()->attach($tags->whereIn('name', ['JavaScript', 'React'])->pluck('id'));

        $course4->categories()->attach($categories->whereIn('name', ['Web Development', 'Backend'])->pluck('id'));
        $course4->tags()->attach($tags->whereIn('name', ['JavaScript', 'Node.js', 'API'])->pluck('id'));

        $course5->categories()->attach($categories->whereIn('name', ['Web Development'])->pluck('id'));
        $course5->tags()->attach($tags->whereIn('name', ['PHP'])->pluck('id'));

        $course6->categories()->attach($categories->whereIn('name', ['Web Development'])->pluck('id'));
        $course6->tags()->attach($tags->whereIn('name', ['JavaScript', 'React', 'Node.js'])->pluck('id'));
    }
}