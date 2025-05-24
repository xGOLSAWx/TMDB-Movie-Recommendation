// src/auth/favoriteUtils.js

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';


const COLL = 'favorites';

// Fetch movie favorites
export const getUserFavorites = async (email) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);
    return snap.exists() ? snap.data().movies || [] : [];
  } catch (e) {
    console.error('Error fetching favorites:', e);
    return [];
  }
};

export const addFavorite = async (email, movieId) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
      // First time: create document with this one ID
      await setDoc(userDoc, { movies: [movieId] });
    } else {
      // Already exists: just union without resetting
      await updateDoc(userDoc, {
        movies: arrayUnion(movieId),
      });
    }
  } catch (e) {
    console.error('Error adding favorite:', e);
  }
};

// Remove movie from favorites
export const removeFavorite = async (email, movieId) => {
  try {
    const userDoc = doc(db, COLL, email);
    await updateDoc(userDoc, {
      movies: arrayRemove(movieId),
    });
  } catch (e) {
    console.error('Error removing favorite:', e);
  }
};

export const getUserFavoriteActors = async (email) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);
    return snap.exists() ? snap.data().actors || [] : [];
  } catch (e) {
    console.error('Error fetching favorite actors:', e);
    return [];
  }
};

// Add actor to favorites
export const addActorToFavorites = async (email, actorId) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
      await setDoc(userDoc, { actors: [actorId] }, { merge: true });
    } else {
      await updateDoc(userDoc, { actors: arrayUnion(actorId) });
    }
  } catch (e) {
    console.error('Error adding actor:', e);
  }
};

// Remove actor from favorites
export const removeActorFromFavorites = async (email, actorId) => {
  try {
    const userDoc = doc(db, COLL, email);
    await updateDoc(userDoc, {
      actors: arrayRemove(actorId),
    });
  } catch (e) {
    console.error('Error removing actor:', e);
  }
};

export const getUserFavoriteTV = async (email) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);
    return snap.exists() ? snap.data().tv || [] : [];
  } catch (e) {
    console.error('Error fetching favorite TV shows:', e);
    return [];
  }
};


export const addTVToFavorites = async (email, tvId) => {
  try {
    const userDoc = doc(db, COLL, email);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
      await setDoc(userDoc, { tv: [tvId] }, { merge: true });
    } else {
      await updateDoc(userDoc, { tv: arrayUnion(tvId) });
    }
  } catch (e) {
    console.error('Error adding TV show to favorites:', e);
  }
};


export const removeTVFromFavorites = async (email, tvId) => {
  try {
    const userDoc = doc(db, COLL, email);
    await updateDoc(userDoc, {
      tv: arrayRemove(tvId),
    });
  } catch (e) {
    console.error('Error removing TV show from favorites:', e);
  }
};

