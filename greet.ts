
interface Person {
    firstName:string,
    lastName:string
}

function greeter(person: Person) {
    return "Hello, " + person;
}

let user:Person={
    firstName:'bu',
    lastName:'chengjian'
};

document.body.innerHTML = greeter(user);