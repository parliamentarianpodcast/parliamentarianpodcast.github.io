import { h, render } from "preact";
import { AudioPlayer } from "./AudioPlayer/AudioPlayer";

render(<AudioPlayer file_url={"static/Parliamentarian_Podcast_Episode_1_rc1.mp3"} />, document.getElementById("episode-1-player") as Element);
