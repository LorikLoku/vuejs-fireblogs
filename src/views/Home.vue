<template>
  <div class="home">

    <!-- Blog Posts -->
    <BlogPost v-if="!user" :post="welcomeScreen"/>                                 <!-- Shfaqja e BlogPost ne front (Home) - e para per Welcome BP -->
    <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index"/>   <!-- Shfaqja e blogPostsFeed ne front (Home) - 1 dhe 2 -->
  
    <!-- Blog Cards -->
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Recent Blogs</h3>
        <div class="blog-cards">
          <BlogCard :post="post" v-for="(post, index) in blogPostsCards" :key="index"/>  <!-- Shfaqja e blogPostsCards ne front (Home) - 3,4,5,6 -->
        </div>
      </div>
    </div>

    <!-- Never miss... -->
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Never miss a post. Register for yoyr free account today!</h2>
        <router-link class="router-button" :to="{ name: 'Register' }">
          Register for FireBlogs <Arrow class="arrow arrow-light"/>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import BlogPost from "../components/BlogPost.vue";
import BlogCard from "../components/BlogCard.vue";
import Arrow from "../assets/Icons/arrow-right-light.svg";
export default {
  name: "Home",
  components: {
    BlogPost,
    BlogCard,
    Arrow,
  },
  data() {                      
    return {
      welcomeScreen: {            //te dhena per popullimin e blogpost komponenteve ne home
        title: "Welcome!",
        blogPost: "Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
        welcomeScreen: true,
        photo: "coding",
      },        
    };
  },
  computed: {
    blogPostsFeed() {           //Metode e cila shkon tek store(index.js) perkatesisht tek getters dhe merr blogPostsFeed 1,2 infot.
      return this.$store.getters.blogPostsFeed;
    },  
    blogPostsCards() {           //Metode e cila shkon tek store(index.js) perkatesisht tek getters dhe merr blogPostsCards 3,4,5,6 infot.
      return this.$store.getters.blogPostsCards;
    },                 
    user() {                      //Metode qe kthen atributin user te index.js(store) perkatesisht tek state 
        return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-card-wrap{
  h3{
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates{
  .container{
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    .router-button{
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media (min-width: 800px) {
        margin-left: auto;
      }
    }

    h2{
      font-weight: 300;
      font-size: 32px;
      max-width: 425px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      @media (min-width: 800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>