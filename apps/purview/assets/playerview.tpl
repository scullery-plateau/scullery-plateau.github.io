<html>
  <head>
    <title>Player View</title>
    <link rel="icon" type="image/x-icon" href="../../favicon.ico">

    <!-- external styles -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Caudex"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Modern+Antiqua"
      rel="stylesheet"
    />
    <script
      src="https://kit.fontawesome.com/d550ee8263.js"
      crossorigin="anonymous"
    ></script>

    <!-- project styles -->
    <link rel="stylesheet" href="../../style/rpg.css" />
    <link rel="stylesheet" href="../../style/font.css" />
    <link rel="stylesheet" href="../../style/menu.css" />

    <!-- local styles -->
    <link rel="stylesheet" href="./style.css" />

    <!-- external scripts -->
    <script src="https://voltron42.github.io/gizmo-atheneum/structure/importnamespace/script.js"></script>
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>


    <!-- bind app root -->
  </head>
  <body class="m-0 p-0" onload="document.dispatchEvent(new CustomEvent('fullyLoaded'))">
    <div id="app-root" class="m-0 p-0"></div>
  </body>
</html>
