//Mundeson krijimin e nje bllogu
<template>
    <div class="create-post">
        <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview"/>    <!-- Shfaqja e BlogCoverPreview Modal ne front tek CreatePost.vue -->
        <Loading v-show="loading"/>                                        <!--Shfaqja e Loading animation perderisa te dhenat uploadohen ne firebase-->
        <div class="container">
            <div :class="{invisible: !error}" class="err-message">         
                <p><span>Error:</span>{{ this.errorMsg }}</p>
            </div>
            <div class="blog-info">

                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" /> <!-- Enter Blog Title : blogTitle(computed) -->

                <div class="upload-file">

                    <label for="blog-photo">Upload Cover Photo</label>                   <!-- Upload Cover Photo : fileChange(methods) -->
                    <input type="file" ref="blogPhoto" id="blog-photo" 
                    @change="fileChange" accept=".png, .jpg, .jpeg" />                   

                                                                                         <!-- Preview Photo : openPreview(methods), BlogCoverPreview.vue -->
                    <button @click="openPreview" class="preview"                         
                    :class="{'button-inactive' : !this.$store.state.blogPhotoFileURL}">
                    Preview Photo</button>
                    <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>      

                </div>
            </div>

            <div class="editor">                                                         <!-- Editor : editorSettings(data), blogHTML(computed), imageHandler(methods) -->
                <vue-editor :editorOptions="editorSettings" 
                v-model="blogHTML" useCustomImageHandler @image-added="imageHandler" />
            </div>                                                                       

            <div class="blog-actions">                                                   <!-- Publish Blog : uploadBlog(methods)-->
                <button @click="uploadBlog">Publish Blog</button>

                <router-link class="router-button" :to="{ name: 'BlogPreview' }">        <!-- Post Preview : klikimi tqon ne viewin BlogPreview -->
                Post Preview</router-link>                                               
            </div>

        </div>
    </div>
</template>

<script>
import BlogCoverPreview from "../components/BlogCoverPreview.vue";
import Loading from "../components/Loading.vue";
import firebase from "firebase/app";
import "firebase/storage";
import db from "../firebase/firebaseInit";
import Quill from "quill";                        //Quill na ndihmon per me mundesu img resize
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
    name: "CreatePost",
    data() {
        return {
            file: null,
            error: null,
            errorMsg: null,
            loading: null,
            editorSettings: {
                modules: {
                    imageResize: {},
                },
            },
        };
    },
    components: {
        BlogCoverPreview,
        Loading,
    },
    methods: {
        fileChange() {      //metode e cila tregon a kemi ndrrim te emrit dhe URL te fajllit te uploaduar
                            //e cila arrihet permes mutacioneve fileNameChange dhe createFileURL te index.js(store)
            this.file = this.$refs.blogPhoto.files[0];
            const fileName = this.file.name;
            this.$store.commit("fileNameChange", fileName);
            this.$store.commit("createFileURL", URL.createObjectURL(this.file));
        },
        openPreview() {     //metode e cila mundeson hapjen dhe mbylljen e Preview Modal te CreatePost.vue permes
                            //thirrjes se mutacionit openPhotoPreview te index.js (store)
            this.$store.commit("openPhotoPreview");
        },   
        //Metode e cila mundeson menagjimin e fotos se uploaduar ne EDITOR
        //arrihet fillimisht permes uploadimit te fotos ne storage te firebase dhe pastaj e shfaqim ne Editor
        imageHandler(file, Editor, cursorLocation, resetUploader) {
            const storageRef = firebase.storage().ref();
            const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
            docRef.put(file).on("state_changed", (snapshot) => {
                console.log(snapshot);                                      //deri ktu uploadohet foto nstorage te firebase
            }, (err) => {
                console.log(err);                                           //shfaqet error nese kemi probleme
            }, async () => {
                const downloadURL = await docRef.getDownloadURL();          //nga ktu fillon shfaqja e fotos ne Editor permes storage te firebase
                Editor.insertEmbed(cursorLocation, "image", downloadURL);
                resetUploader();
            });
        },
        uploadBlog() {    //metode e cila mundeson ruajtjen e bllogut ne firebase per shfaqjen e tij ne pjeset ku deshirojme
            if(this.blogTitle.length !== 0 && this.blogHTML.length !== 0){   //fillimisht validojme bllogun duke kontrollu a ka titull edhe tekst te shkruajtur ne EDITOR
                if(this.file){                                               //pastaj kontrollojme userin a ka uploaduar cover photo
                    this.loading = true;
                    const storageRef = firebase.storage().ref();
                    const docRef = storageRef.child(`documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
                    docRef.put(this.file).on("state_changed", (snapshot) => {
                        console.log(snapshot);                                //deri ktu uploadohet foto nstorage te firebase
                    }, (err) => {
                        console.log(err);                                      //shfaqet error nese kemi probleme
                        this.loading = false;
                    }, async () => {
                        const downloadURL = await docRef.getDownloadURL();     //krijojme qasje ne firestor collection per te ruajtur te dhenat e Blog Posteve 
                        const timestamp = await Date.now();
                        const dataBase = await db.collection("blogPosts").doc();

                        await dataBase.set({                                   //popullojme blog post firestore collection me te dhena
                            blogID: dataBase.id,
                            blogHTML: this.blogHTML,
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoName: this.blogCoverPhotoName,
                            blogTitle: this.blogTitle,
                            profileId: this.profileId,
                            date: timestamp,
                        });
                        await this.$store.dispatch("getPost"); //pasi dergojme te dhenat ne firestore, keto te dhena i ridirektojme ne ViewBlog.vue per ti shfaqur permes action getPost() te index.js (store)
                        this.loading = false;                                 
                        this.$router.push({ name: "ViewBlog", params: {blogid: dataBase.id} }); //mundeson redirektimin ne ViewBlog.vue pasi te postohet bllogu
                    });                                                                         
                    return;
                }
                // Kushtezon uploadimin e nje cover fotos ne EDITOR.
                // this.error = true;
                // this.errorMsg = "Please ensure you uploaded a cover photo!";
                // setTimeout(() => {     //pas 5 sekondav errori i shfaqur largohet
                //     this.error = false
                // }, 5000);  
                return;              
            }
            // Kushtezon vendosjen e nje titulli per bllog si dhe shkrimit ne editor.
            this.error = true;
            this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!";
            setTimeout(() => {      //pas 5 sekondav errori i shfaqur largohet
                this.error = false
            }, 5000);
            return;
        },                         
    },
    computed: {
        profileId() {           //kthen atributin profileId nga index.js e store perkatesisht tek state
            return this.$store.state.profileId;
        },
        blogCoverPhotoName() {  //kthen atributin blogPhotoName nga index.js e store perkatesisht tek state
            return this.$store.state.blogPhotoName;
        },
        blogTitle: {
            get() {             //kthen atributin blogTitle nga index.js e store perkatesisht tek state
                return this.$store.state.blogTitle;
            },
            set(payload) {      //mundeson popullimin e atributit blogTitle te index.js tek store perkatesisht tek state permes mutacionit updateBlogTitle
                this.$store.commit("updateBlogTitle", payload);
            },
        },
        blogHTML: {
            get() {             //kthen atributin blogHTML nga index.js e store perkatesisht tek state
                return this.$store.state.blogHTML;
            },
            set(payload) {      //mundeson popullimin e atributit blogHTML te index.js tek store perkatesisht tek state permes mutacionit newBlogPost
                this.$store.commit("newBlogPost", payload);
            },
        },                 
    },
};
</script>

<style lang="scss">
.create-post{
    position: relative;
    height: 100%;

    button{
        margin-top: 0;
    }

    .router-button{
        text-decoration: none;
        color: #fff;
    }

    label,
    button,
    .router-button{
        transition: 0.5s ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;

        &:hover{
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container{
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    //error styling
    .invisible{
        opacity: 0 !important;
    }

    .err-message{
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: 0.5s ease all;

        p{
            font-size: 14px;
        }

        span{
            font-weight: 600;
        }
    }

    .blog-info{
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1){
            min-width: 300px;
        }

        input{
            transition: 0.5s ease-in-out all;
            padding: 10px 4px;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus{
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }

        .upload-file{
            flex: 1;
            margin-left: 16px;
            position: relative;
            display: flex;

            input{
                display: none;
            }

            .preview{
                margin-left: 16px;
                text-transform: initial;
            }

            span{
                font-size: 12px;
                margin-left: 16px;
                align-self: center;
            }
        }
    }

    .editor{
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper{
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ql-container{
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: scroll;
        }

        .ql-editor{
            padding: 20px 16px 30px;
        }
    }

    .blog-actions{
        margin-top: 32px;

        button{
            margin-right: 16px;
        }
    }
}
</style>