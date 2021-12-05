const categoriesRouter = require("./categories.router");
const commentsRouter = require("./comments.router");
const reviewsRouter = require("./reviews.router");
const usersRouter = require("./users.router");
const apiRouter = require("express").Router();

const listRoutes = (routes, stack, parent) => {
  parent = parent || "";
  if (stack) {
    stack.forEach((r) => {
      if (r.route && r.route.path) {
        for (let method in r.route.methods) {
          if (r.route.methods[method]) {
            routes.push({
              method: method.toUpperCase(),
              path: parent + r.route.path,
            });
          }
        }
      } else if (r.handle && r.handle.name == "router") {
        const routerName = r.regexp.source
          .replace("^\\", "")
          .replace("\\/?(?=\\/|$)", "");
        return listRoutes(routes, r.handle.stack, parent + routerName);
      }
    });
    return routes;
  } else {
    return listRoutes([], apiRouter.stack);
  }
};

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ routes: listRoutes() });
});

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
