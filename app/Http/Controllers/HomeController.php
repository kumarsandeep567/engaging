<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * This function will serve the homepage that will shown to 
     * authenticated users
     */
    public function home() 
    {
        return Inertia::render('Home');
    }
}