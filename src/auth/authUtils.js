// src/auth/authUtils.js
import { auth ,db} from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  deleteUser as firebaseDeleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

// Register new user
export const saveUser = async (user) => {
  const { email, password } = user;
  if (!isValidGmail(email)) {
    return { success: false, message: "Invalid Gmail address." };
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Email already registered.' };
    }
    return { success: false, message: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch {
    return false;
  }
};

// Get current user from Firebase
export const getCurrentUser = () => auth.currentUser;

// Watch auth state changes
export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Helper to check Gmail format
export const isValidGmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};


/**
 * Deletes the current user and their Firestore data.
 * If credentials are stale, will try reauth with provided password.
 * @param {string} password – current password (for reauth if needed)
 */
export const deleteUser = async (password) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("deleteUser: no user signed in");
    return { success: false, message: "No user signed in." };
  }
  const email = user.email;
  console.log("deleteUser: starting deletion for", email);

  try {
    // 1️⃣ Delete Firestore doc
    console.log("deleteUser: deleting Firestore doc favorites/", email);
    await deleteDoc(doc(db, 'favorites', email));

    // 2️⃣ Delete Auth user
    console.log("deleteUser: deleting Firebase Auth user");
    await firebaseDeleteUser(user);

    // 3️⃣ Sign out
    console.log("deleteUser: signing out");
    await signOut(auth);

    console.log("deleteUser: success");
    return { success: true };
  } catch (error) {
    console.error("deleteUser: error", error);

    if (error.code === 'auth/requires-recent-login') {
      console.warn("deleteUser: requires recent login; reauthenticating...");
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("deleteUser: reauth successful; retrying deletion");

        // retry deletion
        await deleteDoc(doc(db, 'favorites', email));
        await firebaseDeleteUser(user);
        await signOut(auth);

        console.log("deleteUser: success after reauth");
        return { success: true };
      } catch (reauthError) {
        console.error("deleteUser: reauth failed", reauthError);
        return {
          success: false,
          message: "Reauthentication failed. Please log in again and retry."
        };
      }
    }

    return { success: false, message: error.message };
  }
};