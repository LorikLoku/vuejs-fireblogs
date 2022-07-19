//Te mundeson me bo preview bllogun kur klikohet butoni "Post Preview" i CreatePost.vue

<template>
    <div class="post-view">
        <div class="container quillWrapper">
            <h2>{{ this.blogTitle }}</h2>
            <img :src="blogCoverPhoto" alt="" />
            <div class="post-content ql-editor" v-html="blogHTML"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Post Preview",
    computed: {
        blogTitle() {    //kthen vleren e atributit blogTitle te marre nga index.js (store) perkatesisht tek state
            return this.$store.state.blogTitle;
        },
        blogHTML() {    //kthen vleren e atributit blogHTML te marre nga index.js (store) perkatesisht tek state
            return this.$store.state.blogHTML;
        },
        blogCoverPhoto() {  //kthen vleren e atributit blogPhotoFileURL te marre nga index.js (store) perkatesisht tek state
            return this.$store.state.blogPhotoFileURL;
        },                
    },    
};
</script>

<style lang="scss">
.post-view{
    min-height: 100%;

    .container{
        max-width: 1000px;
        padding: 60px 25px;
    }

    .ql-editor{
        padding: 0;
    }

    h2{
        margin-bottom: 16px;
        font-weight: 300;
        font-size: 32px;
    }

    img{
        width: 100%;
        margin-bottom: 32px;
    }
}
</style>