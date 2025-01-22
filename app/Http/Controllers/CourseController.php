<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('user_id', Auth::id())->get();

        return Inertia::render('Dashboard' , [
            'courses' => $courses,
        ]);
    }

    public function show(Course $course)
    {
        // Ensure the user can only view their own courses
        if ($course->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Eager load the chapters relationship
        $course->load('chapters');

        // Return the course details to the Inertia view
        return Inertia::render('Courses/Show', [
            'course' => $course,
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