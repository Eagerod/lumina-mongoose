# Lumina-Mongoose

This is an extension of the lumina package that allows for easy access entities from a MongoDB database when using Mongoose as your database driver.

## Usage 

Start out by installing Lumina-Mongoose using npm:

    npm install lumina-mongoose

Set up your Restify server to use lumina-mongoose's provided Lumina method:

```javascript
var lumina = require("lumina");
var luminamongoose = require("lumina-mongoose")

var lumen = new lumina();

lumen.use("fetchObjectsFromRoute", luminamongoose.fetchObjectsFromRoute());
```

Then set up your routes to take advantage of the mongoose Lumina method.

```javascript
server.get("/models/:modelId", lumen.illuminate({
    fetchObjectsFromRoute : [new luminamongoose.FetchContext("modelId", Model, "_model")],
    handler : function(req, res, next) {
        res.send(200, req._model);
        return next();
    }
}));
```

And you're done. No more need to write code that fetches entities and tests if anything was found, or tests your routing parameters to make sure that they're valid MongoDB ObjectIds. Lumina-Mongoose will send back 404s on your behalf whenever an object isn't found, or if an ObjectId is invalid. 

It can even be stacked so that it can fetch several entities all in one fell swoop, and will error out whenever any of them fail to be found. 

```javascript
server.get("/school/:schoolId/course/:courseId/lesson/:lessonId", lumen.illuminate({
    fetchObjectsFromRoute : [
        new luminamongoose.FetchContext("schoolId", School, "_school")],
        new luminamongoose.FetchContext("courseId", Course, "_course")],
        new luminamongoose.FetchContext("lessonId", Lesson, "_lesson")]
    ],
    handler : function(req, res, next) {
        res.send(200, req._lesson.title);
        return next();
    }
}));
```
