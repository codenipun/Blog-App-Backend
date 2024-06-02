import express from 'express'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import cors from "cors"
import cookieParser from 'cookie-parser'
import multer from 'multer'
import dotenv from "dotenv";

dotenv.config();
const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), function(req, res){
    const file = req.file;
res.status(200).json(file.filename)
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(8800, ()=>{
    console.log("connected");
})