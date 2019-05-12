const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const recordButton = document.querySelector('button#recording')
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;

const stream = canvas.captureStream(); // frames per second
console.log('Started stream capture from canvas element: ', stream);

var audioCtx = new AudioContext();
  // create a stream from our AudioContext
const dest = audioCtx.createMediaStreamDestination();
const aStream = dest.stream;
  // connect our video element's output to the stream
const vid = document.getElementById('video');
const sourceNode = audioCtx.createMediaElementSource(vid);
sourceNode.connect(dest);
sourceNode.connect(audioCtx.destination);

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  video.src = window.URL.createObjectURL(superBuffer);
}

function toggleRecording() {
  if (recordButton.textContent == 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
}

function startRecording() {
  let options = {mimeType: 'video/webm'};
  recordedBlobs = [];
  var newStream = new MediaStream();
  newStream.addTrack(aStream.getAudioTracks()[0]);
  newStream.addTrack(stream.getVideoTracks()[0]);
  mediaRecorder = new MediaRecorder(newStream, options);
  
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(100); // collect 100ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
  video.controls = true;
}

function play() {
  video.play();
}

function download() {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
