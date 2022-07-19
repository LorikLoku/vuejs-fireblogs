//Komponenta ne forme katrore e cila shfaq ndonje mesazh pas klikimit te ndonje butonit
<template>
    <div class="modal">
        <div class="modal-content">
            <p>{{ this.modalMessage }}</p>
            <button @click="closeModal">Close</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["modalMessage"],
    methods: {
        closeModal() {                  //sherben per emit e close-modal ku thirret metoda closeModal() e forgotpassword
            this.$emit("close-modal");
        },
    },
};
</script>

<style lang="scss" scoped>
.modal{
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
    position: absolute;
    width: 100%;
    height: 126.2%; //100%
    top: 0;
    background-color: rgba(0, 0, 0, 0.7);

    .modal-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 8px;
        width: 300px;
        padding: 40px 30px;
        background-color: #fff;

        p{
            text-align: center;
        }

        button{
            align-self: center;
        }
    }
}
</style>
