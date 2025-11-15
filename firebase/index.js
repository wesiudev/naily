import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  where,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { v4 as uuidv4 } from "uuid";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
export async function getUserById(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      console.log(`User with ID ${userId} does not exist`);
    }
    return userDoc.data();
  } catch (error) {
    return error;
  }
}

// Notifications helpers
// Structure: users/{uid}/notifications/{notificationId}
export function subscribeToUserNotifications(uid, callback) {
  const notificationsRef = collection(db, "users", uid, "notifications");
  const q = query(notificationsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export async function addUserNotification(uid, notification) {
  const id = notification?.id ?? uuidv4();
  const ref = doc(db, "users", uid, "notifications", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return id;
  await setDoc(ref, {
    ...notification,
    id,
    isRead: notification?.isRead ?? false,
    isDeleted: notification?.isDeleted ?? false,
    // Prefer server timestamp for consistent ordering
    createdAt: notification?.createdAt ?? serverTimestamp(),
  });
  return id;
}

export async function markNotificationRead(uid, id) {
  const ref = doc(db, "users", uid, "notifications", id);
  await updateDoc(ref, { isRead: true, readAt: serverTimestamp() });
}

export async function softDeleteNotification(uid, id) {
  const ref = doc(db, "users", uid, "notifications", id);
  await updateDoc(ref, { isDeleted: true, deletedAt: serverTimestamp() });
}

export async function deleteNotification(uid, id) {
  const ref = doc(db, "users", uid, "notifications", id);
  await deleteDoc(ref);
}

// Unread count subscription (for header badges)
export function subscribeToUserUnreadCount(uid, callback) {
  const notificationsRef = collection(db, "users", uid, "notifications");
  const q = query(
    notificationsRef,
    where("isDeleted", "==", false),
    where("isRead", "==", false)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

// Paged notifications (first page live, subsequent pages on demand)
export function subscribeToUserNotificationsPaged(
  uid,
  pageSize = 20,
  callback
) {
  const notificationsRef = collection(db, "users", uid, "notifications");
  const q = query(
    notificationsRef,
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs;
    const list = docs.map((d) => ({ id: d.id, ...d.data() }));
    const lastVisible = docs.length ? docs[docs.length - 1] : null;
    callback({ list, lastVisible });
  });
}

export async function fetchMoreUserNotifications(
  uid,
  pageSize = 20,
  lastVisible
) {
  if (!lastVisible) return { list: [], lastVisible: null };
  const notificationsRef = collection(db, "users", uid, "notifications");
  const q = query(
    notificationsRef,
    orderBy("createdAt", "desc"),
    startAfter(lastVisible),
    limit(pageSize)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  return {
    list: docs.map((d) => ({ id: d.id, ...d.data() })),
    lastVisible: docs.length ? docs[docs.length - 1] : null,
  };
}
export async function addMessageToConversation(
  message,
  authorId,
  participants
) {
  try {
    const sortedParticipantIds = participants?.map((p) => p.uid).sort();
    const conversationId = sortedParticipantIds.join("_");
    const conversationDocRef = doc(db, conversationId, conversationId);
    const conversationDoc = await getDoc(conversationDocRef);
    if (!conversationDoc.exists()) {
      console.log(`Conversation with ID ${conversationId} does not exist`);
    }

    const messages = conversationDoc.data().messages || [];
    messages.push({
      id: uuidv4(),
      content: message,
      sender: authorId,
      timestamp: Date.now(),
    });
    await updateDoc(conversationDocRef, {
      messages: messages,
    });
  } catch (error) {
    return error;
  }
}
export async function createConversation(conversationId, conversationData) {
  try {
    const conversationDocRef = doc(db, conversationId, conversationId);
    await setDoc(conversationDocRef, conversationData);
    return { id: conversationId, ...conversationData };
  } catch (error) {
    return error;
  }
}
export async function addConversation(participants) {
  try {
    // Sort participants by ID to ensure consistency
    const sortedParticipantIds = participants.map((p) => p.uid).sort();
    const conversationId = sortedParticipantIds.join("_");

    // Check if the conversation already exists in the db
    const conversationDocRef = doc(db, conversationId, conversationId);
    const conversationDoc = await getDoc(conversationDocRef);

    if (conversationDoc.exists()) {
      // Conversation already exists, return the existing chat room ID
      return conversationDoc.id;
    } else {
      const newConversationData = {
        participants: participants,
        messages: [],
        createdAt: Date.now(),
        id: conversationId,
      };

      // Ensure no undefined fields are passed
      if (
        Object.values(newConversationData).some((value) => value === undefined)
      ) {
        console.log("Undefined value found in conversation data");
      }

      // Set the document with initial data
      await createConversation(conversationId, newConversationData);

      // Return the ID of the new chat room
      return conversationId;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(userId, data) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
}

/**
 * Grants 30-day free premium subscription to a new user
 * @param {string} userId - The user's UID
 * @returns {Promise<void>}
 */
export async function grantFreePremium(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  const updateData = {
    premiumActive: true,
    active: true,
    allowedTabs: ["calendar", "portfolio", "services"], // Allow calendar, gallery (portfolio), and services tabs
    subscription: {
      id: `free_trial_${userId}`,
      status: "active",
      currentPeriodEnd: Math.floor(thirtyDaysFromNow / 1000), // Unix timestamp in seconds
      cancelAtPeriodEnd: false,
    },
  };

  // Only add payment if user document exists and has payments array
  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.payments && Array.isArray(userData.payments)) {
      updateData.payments = arrayUnion({
        amount: 0,
        date: Date.now(),
        result: "free_trial",
      });
    } else {
      // Initialize payments array if it doesn't exist
      updateData.payments = [{
        amount: 0,
        date: Date.now(),
        result: "free_trial",
      }];
    }
  }
  
  await updateDoc(userRef, updateData);
}

export async function getOpinions() {
  const opinionsRef = collection(db, "opinions");
  const opinionsSnap = await getDocs(opinionsRef);
  const opinions = opinionsSnap.docs.map((doc) => doc.data());
  return opinions;
}
export async function addOpinion(data) {
  const id = uuidv4();
  const opinionRef = doc(db, "opinions", id);
  await setDoc(opinionRef, {
    ...data,
    id,
    createdAt: Date.now(),
  });
  return id;
}
// Profile opinions (per user)
export function subscribeToUserOpinions(uid, callback) {
  const opinionsRef = collection(db, "users", uid, "opinions");
  const q = query(opinionsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export async function addUserOpinion(uid, opinion) {
  const id = opinion?.id ?? uuidv4();
  const ref = doc(db, "users", uid, "opinions", id);
  await setDoc(ref, {
    id,
    rating: Math.max(1, Math.min(5, Number(opinion?.rating ?? 5))),
    text: opinion?.text ?? "",
    isAnonymous: Boolean(opinion?.isAnonymous),
    authorName: opinion?.isAnonymous ? null : opinion?.authorName ?? null,
    createdAt: serverTimestamp(),
  });
  return id;
}

export async function setUserOpinionReply(uid, opinionId, reply) {
  const ref = doc(db, "users", uid, "opinions", opinionId);
  await updateDoc(ref, {
    reply: {
      text: reply?.text ?? "",
      createdAt: serverTimestamp(),
    },
  });
}
export async function updateUserSubscriptionData(
  userId,
  subscriptionId,
  customerId,
  payment
) {
  const userRef = doc(db, "users", userId);

  try {
    // Check if the user document exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update the subscriptionId and customerId for recurring payments
      // Append the new payment to the existing `payments` array
      await updateDoc(userRef, {
        subscriptionId,
        customerId,
        payments: arrayUnion(payment),
      });
    } else {
      // Initialize the user data for a new subscription
      await setDoc(userRef, {
        subscriptionId,
        customerId,
        payments: [payment],
      });
    }
  } catch (error) {
    console.error("Error updating subscription data:", error);
    console.log(error); // Propagate the error for additional handling if needed
  }
}
export async function pushAssistantMessage(data, uid) {
  const userDocRef = doc(collection(db, "users"), uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    await updateDoc(userDocRef, {
      assistantMessages: arrayUnion({
        ...data,
        createdAt: Date.now(),
      }),
    });
    return userDocRef;
  } else {
    await setDoc(userDocRef, {
      assistantMessages: [{ ...data, createdAt: Date.now() }],
    });
    return userDocRef;
  }
}
export async function deleteJobOffer(jobOfferId) {
  const jobOfferRef = doc(db, "job_offers", jobOfferId);
  await deleteDoc(jobOfferRef);
}
export async function deleteService(id) {
  const serviceRef = doc(db, "services", id);
  await deleteDoc(serviceRef);
}
export async function createAIChat(data) {
  const chatId = uuidv4();
  const productDocRef = doc(collection(db, "chats"), chatId);
  const docSnap = await getDoc(productDocRef);
  if (docSnap.exists()) {
    return productDocRef;
  } else {
    await setDoc(productDocRef, {
      data,
    });
    return productDocRef;
  }
}
export async function pushSpecialization(data) {
  const id = uuidv4();
  const productDocRef = doc(collection(db, "specializations"), id);
  const docSnap = await getDoc(productDocRef);
  if (docSnap.exists()) {
    return productDocRef;
  } else {
    await setDoc(productDocRef, {
      ...data,
      createdAt: Date.now(),
      id: id,
    });
    return productDocRef;
  }
}
export async function updateSpecialization(id, data) {
  const docRef = doc(collection(db, "specializations"), id);
  await updateDoc(docRef, data);
  return docRef;
}
export async function createUser(data) {
  const dbUser = await getDocument("users", data.uid);
  if (!dbUser) {
    await setDoc(doc(db, "users", data.uid), data);
    return { exists: false };
  }
  if (dbUser) {
    return { exists: true };
  }
}
export async function pushLead(data) {
  const id = uuidv4();
  const productDocRef = doc(collection(db, "leads"), id);
  const docSnap = await getDoc(productDocRef);
  if (docSnap.exists()) {
    return productDocRef;
  } else {
    await setDoc(productDocRef, {
      ...data,
      createdAt: Date.now(),
      id: id,
    });
    return productDocRef;
  }
}
export async function updateContent(id, data) {
  const docRef = doc(collection(db, "content"), id);
  await updateDoc(docRef, data);
  return docRef;
}
export async function updateLead(id, data) {
  const docRef = doc(collection(db, "leads"), id);
  await updateDoc(docRef, data);
  return docRef;
}
async function addBooking(req, id) {
  await setDoc(doc(db, "bookings", id), req);
}
async function updateBooking(uid, id) {
  const docRef = doc(db, "bookings", id);
  await updateDoc(docRef, {
    uid: uid,
    isReliable: true,
  });
}
async function getBookingById(id) {
  const docRef = doc(db, "bookings", id);
  const docSnapshot = await getDoc(docRef);
  const booking = {
    id: docSnapshot.id,
    ...docSnapshot.data(),
  };
  return booking;
}
async function getBookingsByUserId(uid) {
  const ref = collection(db, "bookings");
  const filter = query(ref, where("uid", "==", uid));
  const response = await getDocs(filter);
  const bookings = response.docs.map((doc) => doc.data());
  return bookings;
}
async function getAllBookings() {
  const ref = collection(db, "bookings");
  const response = await getDocs(ref);
  const bookings = response.docs.map((doc) => doc.data());
  return bookings;
}
async function getBookings(uid) {
  const requestsCollection = collection(db, "bookings");
  const userRequestsQuery = query(requestsCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(userRequestsQuery);
  const bookings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings;
}
async function getUsers() {
  const ref = collection(db, "users");
  const response = await getDocs(ref);
  const users = response.docs.map((doc) => doc.data());
  return users;
}
async function getUser(uid) {
  const ref = collection(db, "users");
  const filter = query(ref, where("uid", "==", uid));
  const response = await getDocs(filter);
  const user = response.docs.length > 0 ? response.docs[0].data() : null;
  return user;
}
async function getDocument(collectionName, key) {
  try {
    const docRef = doc(db, collectionName, key);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.warn(`Document ${key} not found in collection ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.warn(
      `Error fetching document ${key} from ${collectionName}:`,
      error
    );
    return null;
  }
}
export async function fetchUsers() {
  const ref = collection(db, "users");
  const response = await getDocs(ref);
  const users = response.docs.map((doc) => doc.data());
  return users;
}
export async function fetchOffers() {
  const ref = collection(db, "offers");
  const response = await getDocs(ref);
  const offers = response.docs.map((doc) => doc.data());
  return offers;
}
async function getDocuments(collectionName) {
  try {
    const ref = collection(db, collectionName);
    const response = await getDocs(ref);
    const res = response.docs.map((doc) => doc.data());
    return res;
  } catch (error) {
    console.warn(`Error fetching documents from ${collectionName}:`, error);
    // Return empty array as fallback during build time
    return [];
  }
}
function pruneUndefined(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => pruneUndefined(item));
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) {
        result[key] = pruneUndefined(val);
      }
    }
    return result;
  }
  return value;
}

async function addDocument(collectionName, uniqueId, data) {
  const cleaned = pruneUndefined(data);
  await setDoc(doc(db, collectionName, uniqueId), cleaned);
}
async function removeDocument(collectionName, uniqueId) {
  await deleteDoc(doc(db, collectionName, uniqueId));
}
async function updateDocument(keys, values, collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnapshot = await getDoc(docRef);

  const existingData = docSnapshot.data();
  const updatedData = { ...existingData };
  keys.forEach((key, index) => {
    updatedData[key] = values[index];
  });
  await updateDoc(docRef, updatedData);
}
async function updateUserLeads(uid, data) {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  const userData = userSnapshot.data();
  const leads = userData?.leads || [];
  await updateDoc(userRef, { leads: [...leads, data] });
}
async function getBlogPosts() {
  const docRef = doc(db, "blog", "blog");
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}
async function addBlogPost(post) {
  const docRef = doc(db, "blog", "blog");
  const docSnap = await getDoc(docRef);
  if (!docSnap.data()) {
    await setDoc(doc(db, "blog", "blog"), { posts: [post] });
  } else {
    await updateDoc(doc(db, "blog", "blog"), {
      posts: arrayUnion(post),
    });
  }
}
async function updateBlogPost(postId, updatedPost) {
  const docRef = doc(db, "blog", "blog");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const posts = docSnap.data().posts;
    const postIndex = posts.findIndex((post) => post.postId === postId);
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost;
      await updateDoc(docRef, { posts });
    }
  }
}

//auto blogger
//product === generated blog post

export async function createDraft(productConfig, customId) {
  const draftDocRef = doc(collection(db, "drafts"), customId);

  const docSnap = await getDoc(draftDocRef);
  if (docSnap.exists()) {
    // Document with customId already exists, do not create a new one
    return draftDocRef;
  } else {
    await setDoc(draftDocRef, {
      ...productConfig,
      createdAt: Date.now(),
    });
    return draftDocRef;
  }
}
export async function deleteBlogPost(postId) {
  const docRef = doc(db, "blog", "blog");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const posts = docSnap.data().posts;
    const postIndex = posts.findIndex((post) => post.postId === postId);
    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
      await updateDoc(docRef, { posts });
    }
  }
}

export async function getDrafts() {
  const querySnapshot = await getDocs(collection(db, "drafts"));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function getDraft(draftId) {
  const draftDocRef = doc(db, "drafts", draftId);
  const draftDoc = await getDoc(draftDocRef);
  return draftDoc.exists() ? { ...draftDoc.data(), id: draftDoc.id } : null;
}

export async function updateDraft(draftId, updates) {
  const draftDocRef = doc(db, "drafts", draftId);
  return await updateDoc(draftDocRef, updates);
}

export async function deleteDraft(draftId) {
  const draftDocRef = doc(db, "drafts", draftId);
  return await deleteDoc(draftDocRef);
}

export async function deleteMultipleDrafts(draftIds) {
  const promises = draftIds.map(async (draftId) => {
    const draftDocRef = doc(db, "drafts", draftId);
    await deleteDoc(draftDocRef);
  });
  await Promise.all(promises);
}

export async function deleteMultipleProducts(productIds) {
  const promises = productIds.map(async (productId) => {
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
  });
  await Promise.all(promises);
}

// Invitations and promo utilities
export async function createInvite(id, data) {
  await setDoc(doc(db, "invites", id), {
    id,
    status: "pending",
    type: data?.type ?? "manicure-pro",
    alias: data?.alias ?? null,
    batchId: data?.batchId ?? null,
    batchName: data?.batchName ?? null,
    createdAt: Date.now(),
    usedAt: null,
    usedBy: null,
  });
}

export async function getInvite(id) {
  const inviteRef = doc(db, "invites", id);
  const snap = await getDoc(inviteRef);
  return snap.exists() ? snap.data() : null;
}

export async function markInviteUsed(id, usedBy) {
  const inviteRef = doc(db, "invites", id);
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) return;
  await updateDoc(inviteRef, {
    status: "used",
    usedAt: Date.now(),
    usedBy: usedBy ?? null,
  });
}

export async function getPromoCounter(name) {
  const ref = doc(db, "promo_counters", name);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { usedCount: 0, name, updatedAt: Date.now() });
    return { usedCount: 0, name };
  }
  return snap.data();
}

export async function incrementPromoCounter(name) {
  const ref = doc(db, "promo_counters", name);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { usedCount: 1, name, updatedAt: Date.now() });
    return 1;
  }
  const current = snap.data().usedCount ?? 0;
  const next = current + 1;
  await updateDoc(ref, { usedCount: next, updatedAt: Date.now() });
  return next;
}

export async function listInvites() {
  const ref = collection(db, "invites");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data());
}

export async function updateInvite(id, updates) {
  const ref = doc(db, "invites", id);
  await updateDoc(ref, updates);
}

export async function getInviteByAlias(alias) {
  const ref = collection(db, "invites");
  const q = query(ref, where("alias", "==", alias));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  }
  return null;
}
export async function createProduct(productConfig) {
  const productDocRef = doc(collection(db, "products"), productConfig.id);
  const docSnap = await getDoc(productDocRef);
  if (docSnap.exists()) {
    // Document with customId already exists, do not create a new one
    return productDocRef;
  } else {
    await setDoc(productDocRef, {
      ...productConfig,
      createdAt: Date.now(),
    });
    return productDocRef;
  }
}
export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}
export async function addJobOffer(jobOffer) {
  const jobOfferDocRef = doc(collection(db, "offers"), jobOffer.id);
  await setDoc(jobOfferDocRef, {
    ...jobOffer,
    creationTime: Date.now(),
  });
  return jobOfferDocRef;
}

export async function updateJobOffer(jobOfferId, jobOffer) {
  const jobOfferDocRef = doc(db, "offers", jobOfferId);
  await updateDoc(jobOfferDocRef, jobOffer);
  return jobOfferDocRef;
}

export async function fetchJobOffer(jobOfferId) {
  const jobOfferDocRef = doc(db, "offers", jobOfferId);
  const jobOfferDoc = await getDoc(jobOfferDocRef);
  return jobOfferDoc.exists()
    ? { ...jobOfferDoc.data(), id: jobOfferDoc.id }
    : null;
}
export async function updateApplication(id, data) {
  const docRef = doc(collection(db, "employees"), id);
  await updateDoc(docRef, data);
  return docRef;
}
export async function fetchJobOffers() {
  const querySnapshot = await getDocs(collection(db, "offers"));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}
export async function getProduct(productId) {
  const productDocRef = doc(db, "products", productId);
  const productDoc = await getDoc(productDocRef);
  return productDoc.exists()
    ? { ...productDoc.data(), id: productDoc.id }
    : null;
}
export async function getProductByUrl(url) {
  const products = await getProducts();
  const product = products.find((product) => product.url === url);
  return product;
}

export async function updateProduct(productId, updates) {
  const productDocRef = doc(db, "products", productId);
  return await updateDoc(productDocRef, updates);
}

export async function deleteProduct(productId) {
  const productDocRef = doc(db, "products", productId);
  return await deleteDoc(productDocRef);
}

// Subscribe to new reservations for a specialist
export function subscribeToNewReservations(specialistUid, callback) {
  const reservationsRef = collection(db, "reservations");
  // Query for pending reservations for this specialist
  const q = query(
    reservationsRef,
    where("specialistUid", "==", specialistUid),
    where("status", "==", "pending")
  );
  
  let lastReservationIds = new Set();
  let isInitialLoad = true;
  
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      isInitialLoad = false;
      return;
    }
    
    // Get all current reservation IDs
    const currentIds = new Set(snapshot.docs.map(doc => doc.id));
    
    // On initial load, just store the IDs
    if (isInitialLoad) {
      lastReservationIds = currentIds;
      isInitialLoad = false;
      return;
    }
    
    // Find new reservations (IDs that weren't in the previous set)
    const newReservations = snapshot.docs
      .filter(doc => !lastReservationIds.has(doc.id))
      .map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Trigger callback for each new reservation
    newReservations.forEach(reservation => {
      callback(reservation);
    });
    
    // Update the set of known reservation IDs
    lastReservationIds = currentIds;
  });
}
export async function addOrder(id, data) {
  await setDoc(doc(db, "orders", id), data);

  const docRef = doc(db, "orders", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}
export async function updateOrder(keys, values, id) {
  const docRef = doc(db, "orders", id);
  const docSnapshot = await getDoc(docRef);

  let updatedData;

  if (docSnapshot.exists()) {
    const existingData = docSnapshot.data();
    updatedData = { ...existingData };

    keys.forEach((key, index) => {
      updatedData[key] = values[index];
    });

    await updateDoc(docRef, updatedData);
  } else {
    const initialData = {};
    keys.forEach((key, index) => {
      initialData[key] = values[index];
    });

    await setDoc(docRef, initialData);
    updatedData = initialData;
  }

  return updatedData;
}

export async function getIdea(userId, ideaId) {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userIdeas = userDoc.data().ideas;
    const ideaIndex = userIdeas.findIndex((idea) => idea.id === ideaId);
    if (ideaIndex !== -1) {
      return userIdeas[ideaIndex];
    }
  }
}

export {
  addBooking,
  auth,
  addDocument,
  getBookings,
  removeDocument,
  getUsers,
  getUser,
  updateDocument,
  getAllBookings,
  updateBooking,
  getBookingById,
  getBookingsByUserId,
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  getDocument,
  getDocuments,
  db,
  app,
  provider,
  storage,
  updateUserLeads,
  grantFreePremium,
  subscribeToUserNotifications,
  subscribeToUserNotificationsPaged,
  subscribeToUserUnreadCount,
  addUserNotification,
  markNotificationRead,
  softDeleteNotification,
  deleteNotification,
  subscribeToNewReservations,
};
