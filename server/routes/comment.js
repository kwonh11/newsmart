const qs = require("qs");
const axios = require("axios");
require("dotenv").config();
// news router
const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
const Place = require("../schemas/place");
const { isLoggedIn } = require("./middlewares");

// 댓글 목록
router.get("/:contentId", async (req, res) => {
  try {
    const contentId = Number(req.params.contentId);
    const place = await Place.findOne({ contentid: contentId });
    const condition = place ? { place: place._id } : { contentId };
    const list = await Comment.find(condition).sort({ createAt: 1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(403).send(err);
  }
});

// 댓글 등록
router.post("/", isLoggedIn, async (req, res) => {
  const { contentId, commenter, content, place } = req.body;
  try {
    const newComment = await new Comment({
      nick: req.user.nick,
      contentId,
      commenter,
      content,
      place,
    });
    await newComment.save();
    res.status(200).end();
  } catch (err) {
    res.status(403).send(err);
  }
});

// 댓글 수정
router.patch("/", isLoggedIn, async (req, res) => {
  const { commentId, content, commenter } = req.body;
  try {
    if (req.user._id == commenter) {
      await Comment.findOneAndUpdate(
        { _id: commentId },
        { content: content }
      ).exec();
    } else {
      throw new Error();
    }
    res.status(200).end();
  } catch (err) {
    res.status(403).send(err);
  }
});

// 댓글 삭제
router.delete("/delete/:_id/:commenter", isLoggedIn, async (req, res) => {
  try {
    const { _id, commenter } = req.params;
    if (req.user._id == commenter) {
      // 사용자 일치, 삭제가능
      await Comment.findOneAndDelete({ _id });
      res.status(200).end();
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(403).send(err);
  }
});

// 대댓글 등록
router.post("/reply", isLoggedIn, async (req, res) => {
  const { commentId, reply } = req.body;
  const { nick } = req.user;
  const currentReply = { ...reply, nick };
  try {
    const comment = await Comment.findOne({ _id: commentId }).exec();
    await Comment.updateOne(
      { _id: commentId },
      { reply: [...comment.reply, currentReply] }
    ).exec();
    res.status(200).end();
  } catch (err) {
    res.status(403).send(err);
  }
});

// 대댓글 삭제
router.delete(
  "/reply/delete/:commentId/:replyId/:commenter",
  isLoggedIn,
  async (req, res) => {
    try {
      const { replyId, commenter, commentId } = req.params;
      if (req.user._id == commenter) {
        // 사용자 일치, 삭제가능
        const comment = await Comment.findOne({ _id: commentId }).exec();
        await comment.reply.pull({ _id: replyId });
        comment.save();
        console.log(comment.reply);
        res.status(200).end();
      } else {
        throw new Error();
      }
    } catch (err) {
      res.status(403).send(err);
    }
  }
);

// 좋아요
router.post("/like", isLoggedIn, async (req, res) => {
  const { commentId, userId } = req.body;
  try {
    if (req.user._id == userId) {
      const comment = await Comment.findOne({ _id: commentId }).exec();
      const likeIndex = comment.like.findIndex((id) => id == userId);
      if (likeIndex < 0) {
        await Comment.updateOne(
          { _id: commentId },
          { like: [...comment.like, userId] }
        );
      } else {
        await Comment.updateOne(
          { _id: commentId },
          { like: [...comment.like.filter((id) => id != userId)] }
        );
      }
      res.status(200).end();
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(403).send(err);
  }
});

module.exports = router;
