//Sherben per me pa se qysh osht tu duke bllogu i sapo postum ose kur klikohet butoni "View The Post"

<template>
    <div class="post-view" v-if="currentBlog">
        <div class="container quillWrapper">
            <h2>{{ this.currentBlog[0].blogTitle }}</h2>
            <h4>Posted on: {{ new Date(this.currentBlog[0].blogDate).toLocaleString("en-gb", { dateStyle: "long" }) }}</h4>
            <img :src="this.currentBlog[0].blogCoverPhoto" alt="" />
            <div class="post-content ql-editor" v-html="this.currentBlog[0].blogHTML"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ViewBlog",
    data() {
        return {
            currentBlog: null,
        };  
    },
    async mounted() {   //Ne menyre qe me shfaq ne ViewBlog.vue bllogun qe pe kerkojme athere kjo metode shkon edhe i filtron bllogs
                        //ne baze te id-se. Aty ku ka match te id-ve, ate bllog me ate id e shfaq.
        this.currentBlog = await this.$store.state.blogPosts.filter(post => {
            return post.blogID === this.$route.params.blogid;
        });
    },
};
</script>

<style lang="scss">
.post-view{
    h4{
        font-weight: 400;
        font-size: 14px;
        margin-bottom: 24px;
    }
}    
</style>