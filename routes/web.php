<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Models\Course;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    $courses = Course::with('user')->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'courses' => $courses,
    ]);
});

Route::get('/dashboard', [CourseController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('courses', CourseController::class); // This defines all CRUD routes
    Route::post('/courses/{course}/chapters', [CourseController::class, 'storeChapter'])
    ->name('courses.chapters.store');

});

require __DIR__.'/auth.php';