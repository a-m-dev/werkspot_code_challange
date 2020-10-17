# werkspot code challenge 

A New Version of HackerNews Website

### start project

first run `npm install` or `yarn`
then run `npm run build` and finally run `npm run start`

for development purpose, you can user `npm run dev` or relevant `yarn` command to boot up the express server on port 3000!

### Also here are some notes about the project:

Frist off I created a node js http server with express and used that to serve my pages and show them. I used vanilla js ( as recommended in the readme file ) during the development of the project, although, I used some features like babel to transpire and minify my ESNext code to old plain js code for major browsers.

i used ejs as templating engine for my express for composing the html Partials on on server side in order to keep code DRY. also I implemented the lazy loading for home page of the project via IntersectionObserverAPI.

Also another interesting feature of this project is the ability to cache the request calls in order to prevent repeatedly calls to the server, I Might used something like IndexedDB for this mechanism but for the sake of boilerplate code and lack of time I decided to handle it with local storage, although I am fully aware of that localStorage might be not a good options for caching mechanism.

For testing I used jest but time was a little bit less than I could write all of my tests.

Best! 
Ahmad!

@a_m_dev
