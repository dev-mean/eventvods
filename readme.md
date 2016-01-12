# EventVODs Website Project
This project contains the web front and back end to the EventVODs website project.

## Branches

### Master
The master branch contains the latest development branch. This will be replaced by the develop branch at some point in the future.

### Development
Not yet in place.

### Project File Structure
    - app
        ----- models/
        ---------- model.js 	<!-- the model model to handle CRUD -->
    ----- routes.js
    - config
        ----- db.js
    - node_modules 				<!-- created by npm install -->
    - public 					<!-- all front end and angular stuff -->
    ----- css
    ----- js
	
    ---------- controllers 		<!-- angular controllers -->
	---------- routes 			<!-- angular routes -->
    ---------- services 		<!-- angular services -->
    ---------- app.js 			<!-- angular application -->
    ----- img
    ----- libs 					<!-- created by bower install -->
    ----- views
    ---------- home.html
    ---------- event.html
    ---------- overview.html
    ----- index.html
    - .bowerrc 					<!-- tells bower where to put files (public/libs) -->
    - bower.json 				<!-- tells bower which files we need -->
    - package.json 				<!-- tells npm which packages we need -->
	- gulp.js					<!-- gulp task file -->
    - server.js 				<!-- set up our node application -->
	- readme.md					<!-- project official read me -->
