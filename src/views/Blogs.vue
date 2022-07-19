//Pamja ku shfaqen vetem Blog Cards
<template>
    <div class="blog-card-wrap">
        <div class="blog-cards container">
            <div v-if="user" class="toggle-edit">
                <span>Toggle Editing Post</span>
                <input type="checkbox" v-model="editPost">   <!-- v-model sherben sikur name per db -->
            </div>
            <BlogCard :post="post" v-for="(post, index) in blogPosts" :key="index"/>        <!-- Shfaqja e blogCards ne front-->
        </div>
    </div>
</template>

<script>
import BlogCard from "../components/BlogCard.vue";
export default {
    name: "blogs",
    components: {
        BlogCard,
    },
    computed: {
        blogPosts() {                         //Metode e cila shkon tek store(index.js) dhe merr vlerat e arrayt blogPosts
            return this.$store.state.blogPosts;
        },
        editPost: {         
            get() {                                //Metode e cila shkon tek store(index.js) perkatesisht tek state dhe merr vleren e editPost.
                return this.$store.state.editPost;
            },
            set(payload) {                         //Metode e cila shkon tek store(index.js) perkatesisht tek mutacioni toggleEditPost dhe i ndrron vleren state.editPost varesisht payloadit.
                this.$store.commit("toggleEditPost", payload);
            },
        },
        user() {                                   //Metode qe kthen atributin user te index.js(store) perkatesisht tek state
            return this.$store.state.user;
        },        
    },
    beforeDestroy(){                              //Mundeson qe opcioni per editim dhe fshirje qe hapen ne blog cards permes checkbox on tek Blogs
                                                  //te mbyllen pas nderrimit te view(pathit)   
        this.$store.commit("toggleEditPost", false)
    },
};
</script>

<style lang="scss" scoped>
.blog-cards{
    position: relative;

    .toggle-edit{
        display: flex;
        align-items: center;
        position: absolute;
        top: -70px;
        right: 0;

        span{
            margin-right: 16px;
        }

        input[type="checkbox"]{
            position: relative;
            border: none;
            -webkit-appearance: none;
            background: #fff;
            outline: none;
            width: 80px;
            height: 30px;
            border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        input[type="checkbox"]:before{
            content: "";
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 20px;
            top: 0;
            left: 0;
            background: #303030;
            transform: scale(1.1);
            transition: 750ms ease all;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        input:checked[type="checkbox"]:before{
            background: #fff;
            left: 52px;
        }            
    }
}
</style>