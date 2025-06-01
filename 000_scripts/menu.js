document.addEventListener("DOMContentLoaded", function () {
  // ハンバーガーメニュー処理
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".hamburger-menu");
  const contentWrapper = document.querySelector(".content-wrapper");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    menu.classList.toggle("open");
    contentWrapper.classList.toggle("shifted");
  });

  // QRコード処理
  const qrButtons = document.querySelectorAll("#qrButton, #qrButtonSearch");
  const video = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");
  const canvas = canvasElement.getContext("2d", { willReadFrequently: true });
  const overlay = document.getElementById("video-overlay");
  const cancelButton = document.getElementById("cancel-button"); // ✅ キャンセルボタン取得

  let scanning = false;
  let stream = null;

  qrButtons.forEach(qrButton => {
    qrButton.addEventListener("click", async () => {
      try {
        overlay.style.display = "block";
        video.style.display = "block";
        cancelButton.style.display = "block";
        canvasElement.style.display = "none";

        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.setAttribute("playsinline", true);

        scanning = true;
        requestAnimationFrame(tick);
      } catch (err) {
        stopCamera();
        alert("カメラの起動に失敗しました: " + err);
      }
    });
  });

  cancelButton.addEventListener("click", () => {
    stopCamera(); // ✅ ボタンで停止
  });

  function tick() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        stopCamera(); // ✅ 読み取り後停止

        if (code.data.startsWith("http")) {
          window.location.href = code.data;
        } else {
          alert("QRコードに有効なURLが含まれていません: " + code.data);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  function stopCamera() {
    scanning = false;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = "none";
    overlay.style.display = "none";
    cancelButton.style.display = "none"; // ✅ キャンセルボタン非表示
  }
});
