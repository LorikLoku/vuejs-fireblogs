//Permban forgot password page
<template>
    <div class="reset-password">  <!-- modalMessage gjendet tek Modal -->
        <Modal v-if="modalActive" :modalMessage="modalMessage" v-on:close-modal="closeModal"/>   <!-- Paraqitja e MODAL ne front per te dhene mesazh -->
        <Loading v-if="loading"/>                                   <!-- Paraqitja e LOADING ne front para mesazhit -->
        <div class="form-wrap">
            <form class="reset">
                <p class="login-register">
                    Back to
                    <router-link class="router-link" :to="{name: 'Login'}">Login</router-link>
                </p>                
                <h2>Reset Password</h2>
                <p>Forgot your password? Enter your email to reset it</p>
                <div class="inputs">
                    <div class="input">
                        <input type="text" placeholder="Email" v-model="email" />
                        <email class="icon" />
                    </div>
                </div>
                <button @click.prevent="resetPassword">Reset</button>
                <div class="angle"></div>
            </form>
            <div class="background"></div>
        </div>
    </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import Modal from "../components/Modal.vue";
import Loading from "../components/Loading.vue";
import firebase from "firebase/app";
import "firebase/auth";
export default {
    name: "ForgotPassword",
    data() {
        return {
            email: "",
            modalActive: false,                              //Na sherben per me toggle Modal
            modalMessage: "",                               //Na sherben per me rujt msg e Modal
            loading: null,
        };
    },
    components: {
        email,
        Modal,
        Loading,
    },
    methods: {
        resetPassword() {                                   //Metode e cila sherben per me resetu paswordin
            this.loading = true;                            //Se pari shfaqet animacioni i loading
            firebase.auth().sendPasswordResetEmail(this.email).then(() => {
                this.modalMessage = "If your account exists, you will recieve an email";
                this.loading = false;
                this.modalActive = true;
            }).catch(err => {
                this.modalMessage = err.message;
                this.loading = false;
                this.modalActive = true;
            });
        },
        closeModal() {                                      //Sherben per me toggle Modal (mbyllja, hapja)
            this.modalActive = !this.modalActive;
            this.email = "";
        },
    },
};
</script>

<style lang="scss" scoped>
.reset-password{
    position: relative;
    .form-wrap{
        .reset{
            h2{
                margin-bottom: 8px;
            }
            p{
                text-align: center;
                margin-bottom: 32px;
            }
        }
    }
}
</style>