import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blogPosts: [],
    postLoaded: null,
    blogHTML: "Write your blog title here...",
    blogTitle: "",
    blogPhotoName: "",
    blogPhotoFileURL: null,
    blogPhotoPreview: null,
    editPost: null,
    user: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,
  },
  getters: {
    blogPostsFeed(state) {
      //metode e cila kthen dy insertimet e fundit ne arrayn blogPosts - dy tparat shfrytzohen per popullim tposteve nhome
      return state.blogPosts.slice(0, 2);
    },
    blogPostsCards(state) {
      //metode e cila kthen insertimet 3,4,5,6 ne arrayn blogPosts - 4 tjerat shfrytezohen per popullim tblogcards nhome
      return state.blogPosts.slice(2, 6);
    },
  },
  mutations: {
    //metode e cila blogHTML-it te state ja jep vleren e payload
    newBlogPost(state, payload) {
      state.blogHTML = payload;
    },
    //metode e cila blogTitle-it te state ja jep vleren e payload
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
    },
    //metode e cila blogPhotoName-it te state ja jep vleren e payload
    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    //metode e cila blogPhotoFileURL-it te state ja jep vleren e payload
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },
    //metode e cila blogPhotoPreview-it te state ja toggle vleren per me mundesu hapjen dhe mbylljen e Preview Modal tek CreatePost.vue
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    //metode e cila editPost-it te state ja jep vleren e payload
    toggleEditPost(state, payload) {
      state.editPost = payload;
    },
    //metode e cila mundeson ndryshimin e te gjitha atributeve te nje bllogu te caktuar
    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
    //Metode e cila filtron bllogun specifik nga array i bllogave blogPosts
    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(
        (post) => post.blogID !== payload
      );
    },
    updateUser(state, payload) {
      //metode e cila tregon se useri eshte i lloguar apo jo
      state.user = payload;
    },
    setProfileInfo(state, doc) {
      //Metode e cila mundeson popullimin e atributeve te userit me infot perkatese
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
    },
    setProfileInitials(state) {
      //Metode e cila popullon inicialet e userit me shkronjen e pare te emrit dhe mbiemrit
      state.profileInitials =
        state.profileFirstName.match(/(\b\S)?/g).join("") +
        state.profileLastName.match(/(\b\S)?/g).join("");
    },
    changeFirstName(state, payload) {
      //Metode e cila mundeson ndryshimin e Emrit tek Profile.view
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      //Metode e cila mundeson ndryshimin e Mbiemrit tek Profile.view
      state.profileLastName = payload;
    },
    changeUsername(state, payload) {
      //Metode e cila mundeson ndryshimin e Usernameit tek Profile.view
      state.profileUsername = payload;
    },
  },
  actions: {
    async getCurrentUser({ commit }) {
      //metode e cila merr userin i cili aktualisht eshte i lloguar ne app dhe ia thirre mutacionet setProfileInfo dhe setProfileInitials
      const dataBase = await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();
      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");
    },
    async getPost({ state }) {
      //metode e cila mundeson marrjen e blogposteve nga firestore collection per ti shfaqur ku deshirojme
      const dataBase = await db.collection("blogPosts").orderBy("date", "desc");
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
          //kjo kontrollon a e kemi bllogun specifik te ruajtur ne arrayn (blogPosts) nmnyre qe mos me rujt dy here te njejtin bllog
          const data = {
            //lidhja e te dhenav specifike te firestore collection me arrayn
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
          };
          state.blogPosts.push(data); //bllogu futet ne array
        }
      });
      state.postLoaded = true;
    },
    //metode e cila mundeson updateimin e infove te nje posti kur editohet
    async updatePost({ commit, dispatch }, payload) {
      commit("filterBlogPost", payload);  //siguron fshirjen e postit te vjeter nga array e bllogave blogPosts
      await dispatch("getPost");          //sjell bllogun e updateuar nga firestore collection of blogPosts
    },
    //metode e cila iu qaset nje posti te caktuar ne firestore collection dhe e fshine ate
    async deletePost({ commit }, payload) {
      const getPost = await db.collection("blogPosts").doc(payload);
      await getPost.delete();
      commit("filterBlogPost", payload); //kjo pjese siguron qe bllogu i fshire filtrohet edhe prej arrayt qe shfrytezojme per paraqitjen e bllogave ne front
    },
    //metode e cila i dergon te dhenat e updateuara prej Profile.vue ne DB
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials"); //pas updateimit te infove i vendos edhe inicialet
    },
  },
  modules: {},
});
