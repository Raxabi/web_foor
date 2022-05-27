import usersSchm from "../models/usersSchm";

/* <=========== Rutas Get ===========> */

export const renderRegister = (req, res) => {
    res.render("login-register");
};

export const renderEachUser = async (req, res) => {
    const user = await usersSchm.find({
        "_id": req.params.user
    });
    res.render("user_Page");
}

/* <=========== Rutas Post ===========> */

/* User Register */

export const register = async (req, res) => {
    const userRegisterFetchedToDataBase = usersSchm(req.body);
    const userRegisterFetched = req.body;

    let errorClient = [];

    // Consulta en la base de datos si un nombre existe
    const userNameQuery = await usersSchm.findOne(
    {
        "name": userRegisterFetched.name
    }, {
        "_id": 0,
        "name": 1
    });
    
    // Consulta en la base de datos si el email ya esta en uso
    const userEmailQuery = await usersSchm.findOne(
    {
        "email": userRegisterFetched.email
    }, {
        "_id": 0,
        "email": 1
    });

    // <=========== Password Validation before be saved on MongoDB ===========> //
    // Si la contraseña no cumple con los requisitos
    if (userRegisterFetchedToDataBase.password.length <= 0) {
        errorClient.push({text: "La contraseña no puede estar vacia!"});
    } else if (userRegisterFetchedToDataBase.password.length < 8) {
        errorClient.push({text: "La contraseña debe de tener una longitud de 8 caracteres como minimo!"});
    };

    // <=========== Data to JSON conversion ===========> //
    // Convertimos los datos del objeto req.body a json para que los datos puedan ser validados
    /*
        NOTA IMPORTANTE:
        Este metodo es provisional, ya que posteriormente se validaRa directamente el valor del objeto
    */
    const user_Register_Name_To_JSON = JSON.stringify(userRegisterFetched.name);
    const user_Register_Email_To_JSON = JSON.stringify(userRegisterFetched.email);
    const user_Email_Query_To_JSON = JSON.stringify(userEmailQuery);
    const user_Name_Query_To_JSON = JSON.stringify(userNameQuery);

    // SI los datos ya existen en la base de datos, se deniega el registro
    if (user_Register_Name_To_JSON === user_Name_Query_To_JSON) {
        errorClient.push({text: "El nombre ya esta en uso, elige otro nombre!"});
    } else if (user_Register_Email_To_JSON === user_Email_Query_To_JSON) {
        errorClient.push({text: "El email ingresado ya esta en uso, usa otra cuenta de correo o inicia sesion si la cuenta es tuya"});
    };

    // Si la contraseña y la contraseña repetida no coinciden
    if (userRegisterFetched.repeat_password !== userRegisterFetched.password) {
        errorClient.push({text: "La contraseña repetida no coincide con la original, vuelve a intentarlo"});
    } else if (userRegisterFetched.password !== userRegisterFetched.repeat_password) {
        errorClient.push({text: "La contraseña original no coincide con al contraseña repetida, vuelve a intentarlo"});
    };

    const hashedPassword = bcrypt.hashSync(userRegisterFetchedToDataBase.password, 777);

    // Cambiamos el valor de la propiedad password en el objeto req.body
    Object.keys(userRegisterFetchedToDataBase).map(() => {
        userRegisterFetchedToDataBase.password = hashedPassword
    });

    // Si existen errores en el array se devuelven estos errores
    if(errorClient.length > 0) {
        res.render("register", { errorClient });
    } else {
        await userRegisterFetchedToDataBase.save();
        console.log("New user Saved");
        setTimeout(_ => {
            res.redirect("/");
        }, 1500);
    };
};

/* User Login */

export const login = async (req, res) => {
    const userLoginData = req.body;

    let loginError = [];

    // Obtenemos el id para redireccionar a la pagina del mismo
    const userID = await usersSchm.findOne(
        {
            "name": userLoginData.name
        }, {
            "_id": 1
        });

    // validamos por el nombre, contraseña y email
    const userAlreadyRegisteredData = await usersSchm.findOne(
        {
            "name": userLoginData.name,
            "password": userLoginData.password,
            "email": userLoginData.email
        },
        {
            _id: 0,
            name: 1,
            password: 1,
            email: 1,
        }
    );

    // Convertimos los objetos a objetos json para poder compararlos
    
    const user_Login_Data = JSON.stringify(userLoginData);
    const user_Already_Registered_Data_To_Json = JSON.stringify(userAlreadyRegisteredData);
    
    if(user_Login_Data !== user_Already_Registered_Data_To_Json) {
        loginError.push({error: "Los datos introducidos no son correctos o no estan registrados en la web, revisa de nuevo!"});
    };
    if (loginError.length > 0) {
        res.render("login", { loginError });
    } else {
        setTimeout(_ => {
            res.redirect("/user/:_id");
        }, 1777);
    };
};

