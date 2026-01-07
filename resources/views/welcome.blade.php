<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SmartEnroll</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    
    @viteReactRefresh
    
    @vite(['resources/css/app.scss', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>