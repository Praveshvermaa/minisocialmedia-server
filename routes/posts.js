const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'minisocialmedia',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, quality: 'auto', crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let posts = await Post.find()
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });

    if (sort === 'mostLiked') {
      posts = posts.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sort === 'mostCommented') {
      posts = posts.sort((a, b) => b.comments.length - a.comments.length);
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? req.file.path : '';

    if (!text && !image) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const post = new Post({
      user: req.user.id,
      text: text || '',
      image,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ user: req.user.id });
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
