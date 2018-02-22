// https://git.io/vH4Ek
var supports_video_autoplay = function(callback) {

    var v = document.createElement("video");
    v.paused = true;
    var p = "play" in v && v.play();

    typeof callback === "function" && callback(!v.paused || "Promise" in window && p instanceof Promise);

};

supports_video_autoplay(function(supported) {
    if (supported && 'IntersectionObserver' in window) {
        var videos = document.querySelectorAll('[data-gif]');

        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                var video = entry.target;
                if (entry.intersectionRatio > 0) {
                    // video is in the viewport - start it
                    if (!video.hasAttribute('autoplay')) {
                        video.setAttribute('autoplay', true);
                        video.setAttribute('loop', true);
                    }
                    video.play();
                } else {
                    // video is outside the viewport - pause it
                    video.pause();
                }
            });
        });

        [].forEach.call(videos, function(video) {
            video.removeAttribute('controls');

            observer.observe(video);
        });
    } else {
        // no video autoplay support :(
    }
});