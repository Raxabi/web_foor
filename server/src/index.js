import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, _ => {
    console.log(`Server listening on port ${port}`)
});

const example = {
    hola: "a todos"
}