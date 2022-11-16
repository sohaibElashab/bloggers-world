import { createStore } from "vuex";

// firebase imports
import {
  auth,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  blogsCollection,
  app,
} from "../firebase/config";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { onUnmounted } from "vue";

const store = createStore({
  state: {
    user: null,
    authIsReady: false,
    blogs: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    },
    setBlogs(state, payload) {
      state.blogs = payload;
    },
  },
  actions: {
    async signup(context, user) {
      const storage = getStorage();
      const storageRef = ref(storage, "users_profile/" + user.profile.name);
      var profile_url;
      await uploadBytes(storageRef, user.profile)
        .then(async (snapshot) => {
          profile_url = await getDownloadURL(snapshot.ref);
        })
        .catch((err) => {
          console.log(err);
        });
      const response = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      if (response) {
        await app.auth().currentUser.updateProfile({
          displayName: user.name,
          photoURL: profile_url,
          phoneNumber: user.phone,
        });
        context.commit("setUser", response.user);
        const actionCodeSettings = {
          url: "http://localhost:8080/",
        };
        await app.auth().currentUser.sendEmailVerification(actionCodeSettings);
      } else {
        throw new Error("Unable to register user");
      }
    },
    async login(context, { email, password }) {
      console.log("login action");

      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("setUser", res.user);
        if (!res.user.emailVerified) {
          console.log("Email is not verified");
          const actionCodeSettings = {
            url: "http://localhost:8080/",
          };
          await app
            .auth()
            .currentUser.sendEmailVerification(actionCodeSettings);
        }
      } else {
        throw new Error("could not complete login");
      }
    },
    async logout(context) {
      console.log("logout action");

      await signOut(auth);
      context.commit("setUser", null);
    },
    async createBlog(context, blog_created) {
      return await blogsCollection.add(blog_created);
    },

    async updateBlog(context, { id, blog }) {
      console.log('====================================');
      console.log(blog);
      console.log('====================================');
      return blogsCollection.doc(id).update(blog);
    },

    async deleteBlog(context, id) {
      return blogsCollection.doc(id).delete();
    },
    async useLoadBlogs(context) {
      const close = blogsCollection
        .where("user_id", "==", store.state.user.uid)
        .onSnapshot((snapshot) => {
          context.commit(
            "setBlogs",
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });
      onUnmounted(close);
    },
  },
});

const unsub = onAuthStateChanged(auth, async (user) => {
  store.commit("setAuthIsReady", true);
  store.commit("setUser", user);
  unsub();
});

export default store;
