# Teach-AI-to-Dance-with-PoseNet
I taught these AI to dance on In-My-Feelings song by Drake using PoseNet and Tensorflow.js

I have used the Pose Detection model called PoseNet implemented in Tensorflow.js. The original repository can be found in https://github.com/tensorflow/tfjs-models/tree/master/posenet. 

I have modified the codes to enable the following

1) Loads a pre-trained PoseNet model 
2) Run PoseNet model on any video saved on computer
3) Detects 16 set of keypoints from sixteen parts of the human body from the video
4) Draws the keypoints on Javascript Canvas on top of user selected background image
5) Canvas is being recorded and saved as .mp4!

The input video, output video and background image can be found in 'video' directory.

Here goes a short demo for you.

![Demo](video/kiki2.gif)
