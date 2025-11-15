import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export async function cropToAspect(file, aspect) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  await new Promise((res, rej) => {
    img.onload = () => res(null);
    img.onerror = rej;
  });
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const currentAspect = iw / ih;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;
  if (currentAspect > aspect) {
    sw = Math.round(ih * aspect);
    sx = Math.round((iw - sw) / 2);
  } else if (currentAspect < aspect) {
    sh = Math.round(iw / aspect);
    sy = Math.round((ih - sh) / 2);
  }
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
  );
}

export async function uploadBanner(file, userId, updateUserDoc, dispatch, setUser) {
  const cropped = await cropToAspect(file, 16 / 9);
  const randId = uuidv4();
  const imageRef = ref(storage, `banners/${userId}/${randId}`);
  await uploadBytes(
    imageRef,
    new File([cropped], file.name, { type: "image/jpeg" })
  );
  const url = await getDownloadURL(imageRef);
  return url;
}

export async function uploadProfilePhoto(file, userId, updateUserDoc, dispatch, setUser) {
  const cropped = await cropToAspect(file, 1); // Square avatar (1:1 aspect ratio)
  const randId = uuidv4();
  const imageRef = ref(storage, `avatars/${userId}/${randId}`);
  await uploadBytes(
    imageRef,
    new File([cropped], file.name, { type: "image/jpeg" })
  );
  const url = await getDownloadURL(imageRef);
  return url;
}

