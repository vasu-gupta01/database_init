const db = require("./models");
const config = require("./config");
var bcrypt = require("bcryptjs");

const AuthController = require("./controllers/auth.controller");

const Approvers = db.approverModels.Approvers;
const Roles = db.approverModels.Roles;
const Fields = db.formModels.FieldTypes;
const ViewerFields = db.formModels.ViewerFieldTypes;

console.log("Starting setup...");

let setup = async () => {
  try {
    await db.mongoose
      .connect(config.DB_CONFIG, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Database connected successfuly."))
      .catch((err) => {
        console.log(
          "Database connection unsuccessful. Please make sure config.js has the correct values or database exists."
        );
        throw err;
      });

    console.log("Creating moderator role...");
    await Roles.create(
      { description: "", level: 4, name: "mod" },
      (check_keys = false)
    ).then(async (role) => {
      console.log("Role Creation: Successful");
      console.log("Creating moderator user account...");
      await AuthController.signup({
        username: "mod",
        firstname: "Moderator",
        lastname: "",
        role: role._id,
        password: bcrypt.hashSync(config.MOD_PASSWORD, 8),
      })
        .then((ret) => {
          if (ret) {
            console.log("Moderator Account Creation: Successful");
          } else {
            console.log("Skipping Account Creation...");
          }
        })
        .catch((e) => {
          throw e;
        });
    });

    console.log("Creating field types...");
    await Fields.create(
      [{ name: "time" }, { name: "email" }, { name: "text" }],
      (check_keys = false)
    )
      .then(() => {
        console.log("Field types creation: Successful");
      })
      .catch((e) => {
        console.log(e);
        console.log("Field types creation: Failed.");
        throw e;
      });

    console.log("Creating Viewer Field Types...");
    await ViewerFields.create({ name: "button-time" }, (check_keys = false))
      .then(() => {
        console.log("Viewer field types creation: Successful");
      })
      .catch((e) => {
        console.log(e);
        console.log("Viewer field types creation: Failed");
        throw e;
      });
  } catch (e) {
    throw e;
  }
};

setup()
  .then(() => {
    console.log("Setup successful!");
    return;
  })
  .catch((e) => {
    return;
  });
