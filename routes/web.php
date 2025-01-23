<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Models\Course;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CourseController::class, 'welcome']); 

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
    Route::get('/courses/{course}/player', [CourseController::class, 'player'])
    ->name('courses.player');

});

require __DIR__.'/auth.php';