<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <style>
        body {
            font-family: 'Figtree', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 4rem;
            color: #1f2937;
            margin: 0;
            font-weight: 600;
        }
        p {
            color: #6b7280;
            margin-top: 1rem;
        }
        .back-link {
            display: inline-block;
            margin-top: 2rem;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>HEY ATE</h1>
        <p>Dashboard Message</p>
        <a href="/" class="back-link">&larr; Back to Home</a>
    </div>
</body>
</html>
