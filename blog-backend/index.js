const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
app.use(
  cors({
    origin: "*",
  })
);
const port = 3000;
const fs = require("fs");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyBSgnCQ-HEOJ80YlyQte53KFgsGmlpXtcY",
  authDomain: "test-2e605.firebaseapp.com",
  projectId: "test-2e605",
  storageBucket: "test-2e605.appspot.com",
  messagingSenderId: "520337021037",
  appId: "1:520337021037:web:dcd0e4ff0e9dadbc154764",
};

const db = initializeApp(firebaseConfig);

(async function () {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  const storage = getStorage();
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.post("/", async (req, res) => {
    const form = formidable({});
    var paths = [];
    var durations = [];
    var videosURLS = [];

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      Object.keys(files).forEach((key) => {
        const p = uuidv4() + ".mp4";
        fs.writeFileSync(
          "uploads/" + p ,
          fs.readFileSync(files[key].filepath),
          () => {}
        );
        paths.push(p);
      });
      Object.keys(fields).forEach((key) => {
        durations.push(fields[key]);
      });
      for (let [index, path] of paths.entries()) {
        const dr = durations[index].split(",");
        ffmpeg.FS("writeFile", path, await fetchFile("uploads/" + path));
        await ffmpeg.run(
          "-i",
          path,
          "-ss",
          dr[0],
          "-to",
          dr[1],
          "-c:v",
          "libx264",
          "-crf",
          "30",
          "new_" + path
        );
        fs.writeFileSync(
          "uploads/" + path,
          ffmpeg.FS("readFile", "new_" + path)
        );
        const storageRef = ref(storage, "blogs/" + path);
        await uploadBytes(storageRef, fs.readFileSync("uploads/" + path)).then(
          async (snapshot) => {
            url = await getDownloadURL(snapshot.ref);
            videosURLS.push(url);
          }
        );
      }
      const directory = "uploads";

      for (const file of fs.readdirSync(directory)) {
        fs.unlinkSync(path.join(directory, file));
      }
      res.json(videosURLS);
    });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
