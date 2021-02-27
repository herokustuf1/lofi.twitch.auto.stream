// Requirements
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const axios = require("axios");

ffmpeg.setFfmpegPath(ffmpegPath);

let command;
var started = false;

const GetIngest = async () => {
    const res = await axios.get("https://ingest.twitch.tv/ingests");
    return res.data.ingests[0].url_template.replace("{stream_key}", process.env.STREAM_KEY);
}

module.exports.Start = async () => {
    started = true;
    console.log("Started streaming!");
    const ingest = await GetIngest();

    command = ffmpeg()
        .addInput("./assets/bkg.gif")
        .addInputOption("-ignore_loop 0")
        .addInput("https://lofi.stream.laut.fm/lofi")
        .size("960x540")
        .videoBitrate(5000, true)
        .withAspect('16:9')
        .videoCodec('libx264')
        .audioCodec('aac')
        .toFormat('flv')
        .save(ingest);
}

module.exports.Stop = async () => {
    command.ffmpegProc.stdin.write('q');
    started = false;
}

module.exports.Started = started;