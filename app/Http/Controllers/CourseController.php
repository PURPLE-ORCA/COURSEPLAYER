<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('user_id', Auth::id())
        ->get();

        return Inertia::render('Dashboard' , [
            'courses' => $courses,
        ]);
    }

    public function welcome(Request $request)
    {
        $query = Course::with(['user', 'categories']) // Eager load categories
            ->whereHas('chapters'); // Only fetch courses with chapters
    
        // Search by title or description
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }
    
        // Filter by category (if categories are added later)
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }
    
        // Filter by tag (if tags are added later)
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }
    
        $courses = $query->get();
    
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'courses' => $courses,
        ]);
    }
    
    public function show(Course $course)
    {
        // Eager load the chapters relationship
        $course->load('chapters');

        // Return the course details to the Inertia view
        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }

    public function player(Course $course)
    {
        // Eager load the chapters relationship
        $course->load('chapters');

         // If the course has no chapters, show a message
        if ($course->chapters->isEmpty()) {
            return Inertia::render('Courses/Player', [
                'course' => $course,
                'noChapters' => true, // Flag to indicate no chapters
            ]);
        }
    
        // Return the course details to the Inertia view
        return Inertia::render('Courses/Player', [
            'course' => $course,
            'noChapters' => false, // Flag to indicate chapters exist
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $course = new Course();
        $course->title = $request->title;
        $course->description = $request->description;
        $course->user_id = Auth::id();

        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
            $course->cover = $path;
        }

        $course->save();

        return redirect()->route('dashboard')->with('success', 'Course created successfully.');
    }

    public function storeChapter(Request $request, Course $course)
    {
        // Validate the request
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'required|file|mimes:mp4,mov,avi|max:102400', // Allow video uploads (max 100MB)
        ]);

        // Store the video file
        $videoPath = $request->file('video')->store('chapters_videos', 'public');

        // Create the chapter and associate it with the course
        $course->chapters()->create([
            'title' => $request->title,
            'video' => $videoPath,
            'course_id' => $course->id, // Explicitly set the course_id
        ]);

        return redirect()->route('courses.show', $course)
            ->with('success', 'Chapter added successfully!');
    }
}