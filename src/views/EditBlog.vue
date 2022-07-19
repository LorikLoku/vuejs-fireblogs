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
                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input type="file" ref="blogPhoto" id="blog-photo" @change="fileChange" accept=".png, .jpg, .jpeg" />
                    <button @click="openPreview" class="preview" :class="{'button-inactive' : !this.$store.state.blogPhotoFileURL}">Preview Photo</button>
                    <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
                </div>
            </div>
            <div class="editor">
                <vue-editor :editorOptions="editorSettings" v-model="blogHTML" useCustomImageHandler @image-added="imageHandler" />
            </div>
            <div class="blog-actions">
                <button @click="updateBlog">Save Changes</button>
                <router-link class="router-button" :to="{ name: 'BlogPreview' }">Preview Changes</router-link>
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
            routeID: null,
            currentBllog: null,
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
    async mounted() {   //Ne menyre qe me editu bllogun perkates athere kjo metode shkon edhe i filtron bllogs per me gjet bllogun qe deshirojm me editu
        this.routeID = this.$route.params.blogid;
        this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
            return post.blogID === this.routeID;
        });
        this.$store.commit("setBlogState", this.currentBlog[0]); //setBlogState thirret mi apliku ndryshimet ne bllogun e paracaktuar 
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
        //Metode e cila mundeson menagjimin e fotos se uploaduar ne EDITOR (jo ne Upload Cover Photo button te CreatePost.vue)
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
        async updateBlog() {    //metode e cila mundeson editimin e bllogut ne firebase per shfaqjen e tij ne pjeset ku deshirojme
            const dataBase = await db.collection('blogPosts').doc(this.routeID);
            if(this.blogTitle.length !== 0 && this.blogHTML.length !== 0){   //fillimisht validojme bllogun duke kontrollu a ka titull edhe tekst te shkruajtur ne EDITOR
                if(this.file){                                               //pastaj kontrollojme userin a ka uploaduar cover photo (te butoni Upload Cover Photo)
                    this.loading = true;
                    const storageRef = firebase.storage().ref();
                    const docRef = storageRef.child(`documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
                    docRef.put(this.file).on("state_changed", (snapshot) => {
                        console.log(snapshot);                                //deri ktu uploadohet foto nstorage te firebase
                    }, (err) => {
                        console.log(err);                                      //shfaqet error nese kemi probleme
                        this.loading = false;
                    }, async () => {
                        const downloadURL = await docRef.getDownloadURL();     //krijojme qasje ne firestor collection per te ruajtur te dhenat e edituara te Blog Posteve

                        await dataBase.update({                                   //updateojme blog post firestore collection me te dhenat e edituara
                            blogHTML: this.blogHTML,
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoName: this.blogCoverPhotoName,
                            blogTitle: this.blogTitle,
                        });
                        await this.$store.dispatch("updatePost", this.routeID); //pasi dergojme te dhenat ne firestore, keto te dhena te updateuara i ridirektojme ne ViewBlog.vue per ti shfaqur permes action updatePost() te index.js (store)
                        this.loading = false;                                 
                        this.$router.push({ name: "ViewBlog", params: {blogid: dataBase.id} }); //mundeson redirektimin ne ViewBlog.vue pasi te postohet bllogu
                    });                                                                         
                    return;
                }
                this.loading = true;
                await dataBase.update({
                    blogHTML: this.blogHTML,        //nese jan editu vetem titulli edhe teksti ne editor, updateohen vetem ato dyja
                    blogTitle: this.blogTitle,
                });    
                await this.$store.dispatch('updatePost', this.routeID);
                this.loading = false;
                this.$router.push({name: "ViewBlog", params: {blogid: dataBase.id}});
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