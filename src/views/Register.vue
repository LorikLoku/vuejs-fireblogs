//Permban register page
<template>
    <div class="form-wrap">
        <form class="register">
            <p class="login-register">
                Already have an account?
                <router-link class="router-link" :to="{ name: 'Login' }">Login</router-link>
            </p>
            <h2>Create Your FireBlog Account</h2>
            <div class="inputs">
                <div class="input">
                    <input type="text" placeholder="First Name" v-model="firstName" />
                    <user class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Last Name" v-model="lastName" />
                    <user class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Username" v-model="username" />
                    <user class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Email" v-model="email" />
                    <email class="icon" />
                </div>
                <div class="input">
                    <input type="password" placeholder="Password" v-model="password" />
                    <password class="icon" />
                </div> 
                <div v-show="error" class="error">{{ this.errorMsg }}</div>         <!-- Shfaqja e errorit ne front -->      
            </div>
            <button @click.prevent="register">Sign Up</button>
            <div class="angle"></div>
        </form>
        <div class="background"></div>
    </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import password from "../assets/Icons/lock-alt-solid.svg";
import user from "../assets/Icons/user-alt-light.svg";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";
export default {
    name: "Register",
    components: {
        email,
        password,
        user,
    },
    data() {
        return {                //kan me sherby per me bart te dhena gjat komunikimit me firebase
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            error: null,        //kontrollon a ka error
            errorMsg: "",       //bart mesazhin e errorit
        };
    },  
    methods: {              
        async register() {                             //Metode e cila mundeson regjistrimin e nje useri ne firebase
            if(this.email !== "" && this.password !== "" && this.firstName !== "" && this.lastName !== "" && this.username !== ""){  //kontrollimi nese jan plotsu kejt fields te register
                this.error = false;
                this.errorMsg = "";
                const firebaseAuth = await firebase.auth();
                const createUser = await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password);
                const result = await createUser;     //deri ktu krijohet useri dhe pas kesaj dergojme te dhenat ne collection users te firebase
                const dataBase = db.collection("users").doc(result.user.uid);
                await dataBase.set({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    email: this.email, 
                });
                this.$router.push({ name: "Home" }); //pasi regjistrohet useri bohet redirect 
                return;
            }
            this.error = true;
            this.errorMsg = "Please fill out all the fields!";
            return;
        },
    },  
};
</script>

<style lang="scss" scoped>
.register{
    h2{
        max-width: 350px;
    }
}
</style>