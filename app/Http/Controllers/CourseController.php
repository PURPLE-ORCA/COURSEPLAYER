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
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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
}