const scriptUrl = 'https://script.google.com/macros/s/AKfycbyDapjTINFKyQDg48wJ3tA1t573lYgKcQ2EBB1OgcniiDMtdfOZIWqF30C0vjcD6zJq/exec';
const form = document.forms['contact-form'];

form.addEventListener('submit', e => {
    e.preventDefault()

    fetch(scriptUrl, {method: 'POST', body: new FormData(form)})
            .then(response => Swal.fire({
        title: "Registro hecho!",
        text: "Formulario Envíado",
        icon: "success"}))
            .then( () => { window.location.reload() } )
            .catch(error => console.error('Error', error.message))
})