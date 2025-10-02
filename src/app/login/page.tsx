<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>PetConnect - Login</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#ee2bad",
            "background-light": "#f8f6f7",
            "background-dark": "#22101c",
          },
          fontFamily: {
            "display": ["Plus Jakarta Sans"]
          },
          borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
        },
      },
    }
  </script>
<style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
<div class="flex flex-col min-h-screen">
<header class="w-full">
<div class="container mx-auto px-6 py-4 flex justify-between items-center">
<div class="flex items-center gap-3">
<svg class="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6L7 11H10V15H14V11H17L12 6Z"></path>
</svg>
<h1 class="text-2xl font-bold text-gray-900 dark:text-white">PetConnect</h1>
</div>
</div>
</header>
<main class="flex-grow flex items-center justify-center">
<div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-background-dark/50 rounded-xl shadow-lg m-4">
<div class="text-center">
<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back!</h2>
<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to find your pet's perfect match.</p>
</div>
<form class="mt-8 space-y-6">
<div class="rounded-lg space-y-4">
<div>
<label class="sr-only" for="email-address">Username or Email</label>
<input autocomplete="email" class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-background-light dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" id="email-address" name="email" placeholder="Username or Email" required="" type="email"/>
</div>
<div>
<label class="sr-only" for="password">Password</label>
<input autocomplete="current-password" class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-background-light dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" id="password" name="password" placeholder="Password" required="" type="password"/>
</div>
</div>
<div class="flex items-center justify-end">
<div class="text-sm">
<a class="font-medium text-primary hover:text-primary/80" href="#">
                Forgot your password?
              </a>
</div>
</div>
<div>
<button class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" type="submit">
              Log In
            </button>
</div>
</form>
<div class="relative">
<div class="absolute inset-0 flex items-center">
<div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
</div>
<div class="relative flex justify-center text-sm">
<span class="px-2 bg-white dark:bg-background-dark/50 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
</div>
</div>
<div>
<div class="grid grid-cols-2 gap-3">
<div>
<a class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
<span class="sr-only">Sign in with Google</span>
<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path><path d="M1 1h22v22H1z" fill="none"></path>
</svg>
</a>
</div>
<div>
<a class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
<span class="sr-only">Sign in with Facebook</span>
<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.046C18.343 21.128 22 16.991 22 12z"></path>
</svg>
</a>
</div>
</div>
</div>
</div>
</main>
</div>

</body></html>