emailjs.init("1tbaOyhaRyOoFYGyc");


const form =  document.querySelector('form');

const email =  document.getElementById('email');




  

form.addEventListener("submit", function (e) {
  e.preventDefault();
  checkInputs();

  
  const hasError = document.querySelector(".item.error")
    if (hasError) {
    Swal.fire({
      title: "Oops!",
      text: "Please fill in all required fields.",
      icon: "warning"
    });
    return; // Stop if any error
  }



  // Step 4: Use sendForm (EmailJS auto-handles field names)
  emailjs.sendForm("service_cgd8zu1", "template_1v0zzll", form ).then(
    message => {
      if (message.status === 200){
        Swal.fire({
          title: "success!",
          text: "Message sent Successfully!",
           icon: "success"
          });
          form.reset();
       }
    }).catch( 
    error =>{
      console.log("FAILED...", error);
      alert("Failed to send email. Please try again.");
    }
  );
});

function checkInputs(){
   const items = document.querySelectorAll(".item");


   for(const item of items){
    if (item.value == ""){
      item.classList.add("error")
      item.parentElement.classList.add("error")
    }    

             if (items[1].value != ""){
                 checkEmail()
             }
            items[1].addEventListener("keyup", () => {
                      checkEmail();
            })


        item.addEventListener("keyup", () => {
           if (item.value != ""){
            item.classList.remove("error");
            item.parentElement.classList.remove("error");

           } else{
                item.classList.add("error")
              item.parentElement.classList.add("error")
           }
        });
   }
}   


function checkEmail() {
  const emailRegex = /^[a-zA-Z0-9.\-+]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,3}$/;

  if (!email.value.match(emailRegex )){
     email.classList.add("error")
      email.parentElement.classList.add("error")
  } else{
       email.classList.remove("error")
        email.parentElement.classList.remove("error")
  }
}















  









  






